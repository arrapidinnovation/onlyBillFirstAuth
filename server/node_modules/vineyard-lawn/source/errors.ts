// Lawn will handle any type of thrown errors, but also provides these helper Error types.

export class HTTP_Error extends Error {
  status: number
  body: any
  key: string

  constructor(message: string = "Server Error", status: number = 500, body = {}) {
    super(message)
    this.status = status
    this.message = message // super(message) doesn't seem to be working.
    this.body = body
  }
}

export class Bad_Request extends HTTP_Error {

  constructor(message: string = "Bad Request", bodyOrKey = {}) {
    if (typeof bodyOrKey === 'string') {
      super(message, 400)
      this.key = bodyOrKey
    }
    else {
      super(message, 400, bodyOrKey)
    }
  }
}

export class BadRequest extends HTTP_Error {

  constructor(message: string = "Bad Request", bodyOrKey = {}) {
    if (typeof bodyOrKey === 'string') {
      super(message, 400)
      this.key = bodyOrKey
    }
    else {
      super(message, 400, bodyOrKey)
    }
  }
}

export class Needs_Login extends HTTP_Error {

  constructor(message: string = "This request requires a logged in user.") {
    super(message, 401)
  }
}

export class Unauthorized extends HTTP_Error {

  constructor(message: string = "You are not authorized to perform this request.") {
    super(message, 403)
  }
}