import * as express from "express"
import * as body_parser from 'body-parser'
import {validate} from "./validation"
import {handleError} from "./error-handling"
import {Version} from "./version"
import {Method, Request, PromiseOrVoid, RequestListener, SimpleResponse} from "./types"
import {Bad_Request} from "./errors";

const json_temp = body_parser.json()
const json_parser = function (req, res, next) {
  json_temp(req, res, next)
}

export type Promise_Or_Void = Promise<void> | void
export type Request_Processor = (request: Request) => Promise<Request>
export type Response_Generator = (request: Request) => Promise<any>
export type Filter = (request: Request) => Promise_Or_Void
export type Validator = (data: any) => boolean

export function logErrorToConsole(error) {
  if (!error.stack)
    console.error("Error", error.status, error.message)
  else
    console.error("Error", error.status, error.stack)
}

class DefaultRequestListener implements RequestListener {

  onRequest(request: Request, response: SimpleResponse, res): PromiseOrVoid {
    return
  }

  onError(error, request?: Request): PromiseOrVoid {
    logErrorToConsole(error)
    return
  }

}

export interface Endpoint_Info {
  method: Method
  path: string
  action: Response_Generator
  middleware?: any[]
  filter?: Filter
  validator?: Validator
}

export interface Optional_Endpoint_Info {
  method?: Method
  path?: string
  action?: Response_Generator
  middleware?: any[]
  filter?: Filter
}

// This function is currently modifying req.body for performance though could be changed if it ever caused problems.
function get_arguments(req: express.Request) {
  const result = req.body || {}
  for (let i in req.query) {
    result[i] = req.query[i]
  }
  return result
}

function getVersion(req, data): Version {
  let version: Version = null
  if (typeof req.params.version == 'string') {
    return new Version(req.params.version)
  }
  else if (typeof data.version == 'string') {
    const version = new Version(data.version)
    delete data.version
    return version
  }

  throw new Bad_Request("Missing version property.")
}

function formatRequest(req): Request {
  const data = get_arguments(req)

  const request: Request = {
    data: data,
    session: req.session,
    version: null,
    original: req,
    startTime: new Date().getTime()
  }
  if (req.params)
    request.params = req.params

  return request
}

function logRequest(request: Request, listener: RequestListener, response: SimpleResponse, req) {
  try {
    listener.onRequest(request, response, req)
  }
  catch (error) {
    console.error('Error while logging request', error)
  }
}

export function create_handler(endpoint: Endpoint_Info, action, ajv, listener: RequestListener) {
  if (endpoint.validator && !ajv)
    throw new Error("Lawn.create_handler argument ajv cannot be null when endpoints have validators.")

  return function (req, res) {
    let request

    try {
      request = formatRequest(req)
    }
    catch (error) {
      console.error('Error in early request handling stages will result in a missing request log.', error)
      handleError(res, error, listener, null)
      return
    }

    try {
      request.version = getVersion(req, request.data)

      if (endpoint.validator)
        validate(endpoint.validator, request.data, ajv)

      action(request)
        .then(function (content) {
            res.send(content)
            logRequest(request, listener, {
              code: 200,
              message: "",
              body: content
            }, req)
          },
          function (error) {
            handleError(res, error, listener, request)
            logRequest(request, listener, {
              code: error.status,
              message: error.message,
              body: error.body
            }, req)
          })
    }
    catch (error) {
      handleError(res, error, listener, null)
      if (!request.version)
        request.version = new Version(0, 0, 'error')

      logRequest(request, listener, {
        code: error.status,
        message: error.message,
        body: error.body
      }, req)
    }
  }
}

function register_http_handler(app: express.Application, path: string, method: Method, handler, middleware) {
  switch (method) {
    case Method.get:
      app.get(path, middleware, handler)
      break;

    case Method.post:
      app.post(path, [json_parser].concat(middleware), handler)
      break;

    case Method.put:
      app.put(path, [json_parser].concat(middleware), handler)
      break;

    case Method.delete:
      app.delete(path, [json_parser].concat(middleware), handler)
      break;
  }
}

export function attach_handler(app: express.Application, endpoint: Endpoint_Info, handler) {
  let path = endpoint.path
  if (path [0] != '/')
    path = '/' + path

  const middleware = endpoint.middleware || []
  register_http_handler(app, path, endpoint.method, handler, middleware)
  register_http_handler(app, '/:version' + path, endpoint.method, handler, middleware)
}

export function create_endpoint(app: express.Application, endpoint: Endpoint_Info,
                                preprocessor: Request_Processor = null, ajv = null,
                                listener: RequestListener = new DefaultRequestListener()) {
  const action = preprocessor
    ? request => preprocessor(request).then(request => endpoint.action(request))
    : endpoint.action

  const handler = create_handler(endpoint, action, ajv, listener)
  attach_handler(app, endpoint, handler)
}

export function create_endpoint_with_defaults(app: express.Application, endpoint_defaults: Optional_Endpoint_Info,
                                              endpoint: Optional_Endpoint_Info,
                                              preprocessor: Request_Processor = null) {
  create_endpoint(app, Object.assign({}, endpoint_defaults, endpoint), preprocessor)
}

export function create_endpoints(app: express.Application, endpoints: Endpoint_Info[],
                                 preprocessor: Request_Processor = null, ajv = null,
                                 listener: RequestListener = new DefaultRequestListener()) {
  for (let endpoint of endpoints) {
    create_endpoint(app, endpoint, preprocessor, ajv, listener)
  }
}

export function createEndpoints(app: express.Application, endpoints: Endpoint_Info[],
                                preprocessor: Request_Processor = null, ajv = null,
                                listener: RequestListener = new DefaultRequestListener()) {
  return create_endpoints(app, endpoints, preprocessor, ajv, listener)
}
