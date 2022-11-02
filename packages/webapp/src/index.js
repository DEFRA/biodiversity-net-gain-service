import { createServer, init } from './server.js'

createServer()
  .then(server =>
    init(server)
      .catch(err => {
        console.error(err)
        process.exit(1)
      })
  )
