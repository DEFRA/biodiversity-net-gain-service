import { createServer, init } from './server.js'
import * as applicationInsights from './insights.js'

applicationInsights.setup()

createServer()
  .then(server =>
    init(server)
      .catch(err => {
        console.error(err)
        process.exit(1)
      })
  )
