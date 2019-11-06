# Vineyard Lawn

Vineyard Lawn is a wrapper for Express.js that provides a high level API for defining JSON web services.

Most tools used to create web services are designed primarily to serve HTML pages and any web service support is an additional feature. Lawn specializes exclusively in creating JSON web services.  Some of its features include:

* Consistent use of JSON.  Lawn will never return an HTML response.
* A single point in code that sends HTTP responses.
* All endpoint handlers either return a promise or throw an error.
* Automatic merging of query and post data.
* Simplified request objects that only contain the essentials for standard endpoint logic.
* Merging of POST data and query parameters.
* Built-in support for JSON Schema validation.
* Built-in support for versioning.

If an endpoint needs more flexibility it can bypass Lawn and be directly defined in Express.

## API Examples

### TypeScript

    import * as lawn from 'vineyard-lawn'
    import {Method, HTTP_Error, Bad_Request} from 'vineyard-lawn'
  
    lawn.create_endpoints(app, [
      {
        method: Method.get,
        path: "adventure",
        action: request => {
          const response = {}
          return Promise.resolve(response)
        }
      },
      {
        method: Method.post,
        path: "adventure",
        action: request => {
          if (!request.data.page)
            throw new Bad_Request("Missing 'page' argument.")

          return Promise.resolve({})
        }
      },
    ])
    
### Node.js 4.0+

    const lawn = require('vineyard-lawn')
  
    lawn.create_endpoints(app, [
      {
        method: lawn.Method.get,
        path: "adventure",
        action: request => {
          const response = {}
          return Promise.resolve(response)
        }
      },
      {
        method: lawn.Method.post,
        path: "adventure",
        action: request => {
          if (!request.data.page)
            throw new Bad_Request("Missing 'page' argument.")
          
          const response = {}
          return Promise.resolve(response)
        }
      },
    ])
    
## Server Helper

Lawn also provides an optional, CORS-enabled Server class. It streamlines some of the common tasks used to create a Lawn server.

### TypeScript Example

    import * as lawn from 'vineyard-lawn'
    const config = require('../config/config.json')

    const server = new lawn.Server()
    lawn.create_endpoints(server.get_app(), ...)
    server.start(config.api)

While the above example demonstrates directly using Lawn's Server object, it is recommended to wrap a Lawn Server inside a project-specific Server object, such as:

    import * as lawn from 'vineyard-lawn'
    const config = require('../config/config.json')
    
    export class Server {
        server: lawn.Server = new lawn.Server()
        
        start() {
            return this.server.start(config.api)
        }
    }