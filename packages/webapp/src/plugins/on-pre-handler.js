import constants from '../utils/constants.js'

const onPostAuthHandler = {
  plugin: {
    name: 'on-pre-handler',
    register: (server, _options) => {
      server.ext('onPreHandler', function (request, h) {
        // Do not allow users to change the application type part way through a journey.
        const applicationType = request.yar.get(constants.redisKeys.APPLICATION_TYPE)
        if (applicationType === constants.applicationTypes.ALLOCATION && request.path.startsWith('/land')) {
          return h.redirect(constants.routes.DEVELOPER_TASKLIST).takeover()
        } else if (((applicationType === constants.applicationTypes.REGISTRATION && request.path.startsWith('/developer')))) {
          return h.redirect(constants.routes.REGISTER_LAND_TASK_LIST).takeover()
        } else {
          return h.continue
        }
      })
    }
  }
}

export default onPostAuthHandler
