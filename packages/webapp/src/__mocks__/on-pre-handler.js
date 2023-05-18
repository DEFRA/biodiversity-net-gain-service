import application from '../../src/__mock-data__/test-application.js'

// Adds prehandler to server that loads session with mock application data or sessionData object provided from test
const onPreHandler = (sessionData) => {
  return {
    plugin: {
      name: 'on-pre-handler',
      register: (server, _options) => {
        server.ext('onPreHandler', function (request, h) {
          request.yar._store = sessionData || JSON.parse(application.dataString)
          return h.continue
        })
      }
    }
  }
}

export default onPreHandler
