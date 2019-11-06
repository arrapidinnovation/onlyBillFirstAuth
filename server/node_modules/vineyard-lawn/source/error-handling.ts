import {Request, RequestListener} from './types'

export function sendErrorResponse(res, error) {
  const message = error.message = error.status == 500 ? "Server Error" : error.message
  res.statusMessage = message
  const body: any = {
    error: {
      code: error.status,
      message: message
    }
  }

  if (error.body && (typeof error.body != 'object' || Object.keys(error.body).length > 0))
    body.additional = error.body

  error.body = body
  res.status(error.status).send(body)
}

export function handleError(res, error, listener: RequestListener, request: Request = null) {
  error.status = error.status || 500

  try {
    listener.onError(error, request)
  }
  catch (error) {
    console.error('Error while logging http handling error', error)
  }
  return sendErrorResponse(res, error)
}
