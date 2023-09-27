import application from '../__mock-data__/test-application.js'

// Adds pre auth functionality to server that loads session with mock application data or sessionData object provided from test.
// This should really be done in a pre handler but only one pre handler can be registered with a Hapi.js server.
const onPreAuth = (sessionData) => {
  return {
    plugin: {
      name: 'on-pre-auth',
      register: (server, _options) => {
        server.ext('onPreAuth', function (request, h) {
          request.yar._store = sessionData || JSON.parse(application.dataString)
          return h.continue
        })
      }
    }
  }
}

export default onPreAuth
