import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    // Todo here
    // Get entire cache object and store to database.
    const sessionStore = request.yar._store
    return h.view(constants.views.REGISTRATION_SAVED, {
      gainSiteReference: 'test reference'
    })
  }
}

export default [{
  method: 'GET',
  path: constants.routes.REGISTRATION_SAVED,
  handler: handlers.get
}]
