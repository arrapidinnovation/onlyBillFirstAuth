import * as express from "express"
import {create_endpoints, Request_Processor} from "./api"
import {RequestListener, ValidationCompiler} from "./types"

export interface SSLConfig {
  enabled?: boolean
  publicFile?: string
  privateFile?: string
}

export interface Server_Config {
  port?: number
  ssl?: SSLConfig
}

export class Server implements ValidationCompiler {
  private app
  private node_server
  private port: number = 3000
  private default_preprocessor = null
  private ajv = null
  private requestListener: RequestListener

  constructor(default_preprocessor: Request_Processor = null, requestedListener: RequestListener = null) {
    this.app = express()
    this.default_preprocessor = default_preprocessor
    this.requestListener = requestedListener
  }

  private checkAjv() {
    if (!this.ajv) {
      const Ajv = require('ajv')
      this.ajv = new Ajv()
    }
  }

  compileApiSchema(schema) {
    this.checkAjv()

    const result = {}
    for (let i in schema) {
      const entry = schema[i]
      if (entry.additionalProperties !== true && entry.additionalProperties !== false)
        entry.additionalProperties = false

      result [i] = this.ajv.compile(schema[i])
    }

    return result
  }

  addApiSchemaHelper(schema) {
    this.checkAjv()
    this.ajv.addSchema(schema)
  }

  getApiSchema() {
    this.checkAjv()
    return this.ajv
  }

  createEndpoints(endpoints, preprocessor: Request_Processor = this.default_preprocessor) {
    create_endpoints(this.app, endpoints, preprocessor, this.ajv, this.requestListener)
  }

  add_endpoints(endpoints, preprocessor?: Request_Processor) {
    this.createEndpoints(endpoints, preprocessor)
  }

  enable_cors() {
    this.app.use(require('cors')({
      origin: function (origin, callback) {
        callback(null, true)
      },
      credentials: true
    }))
  }

  start(config: Server_Config): Promise<void> {
    this.port = (config && config.port) || 3000
    return start_express(this.app, this.port, config.ssl || {})
      .then(server => {
        this.node_server = server
        console.log('Listening on port ' + this.port + '.')
      })
  }

  get_app() {
    return this.app
  }

  get_port(): number {
    return this.port
  }

  stop(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.node_server.close(() => resolve())
    })
  }
}

export function start_express(app: express.Application, port, ssl: SSLConfig): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    try {
      if (ssl.enabled) {
        const https = require('https')
        const fs = require('fs')
        let privateCert, publicCert
        try {
          privateCert = fs.readFileSync(ssl.privateFile)
          publicCert = fs.readFileSync(ssl.publicFile)
        }
        catch (error) {
          console.error('Error loading ssl cert file.', error)
          reject(error)
        }
        const server = https.createServer({
          key: privateCert,
          cert: publicCert
        }, app)
          .listen(port, function (err) {
            if (err)
              reject("Error starting server (SSL)")

            console.log('API is listening on port ' + port + ' (SSL)')
            resolve(server)
          })
      }
      else {
        const server = app.listen(port, function (err) {
          if (err)
            reject("Error starting server")

          console.log('API is listening on port ' + port)
          resolve(server)
        })
      }
    }
    catch (error) {
      reject(error)
    }
  })
}
