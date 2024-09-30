import constants from '../utils/constants.js'

const signedOut = {
  method: 'GET',
  path: constants.routes.SIGNED_OUT,
  options: {
    auth: false
  },
  handler: (request, h) => {
    let content

    switch (request?.query?.app) {
      case constants.applicationTypes.REGISTRATION.toLowerCase():
        content = { heading: 'Your registrations', text: 'Sign in to continue with a registration' }
        break
      case constants.applicationTypes.ALLOCATION.toLowerCase():
        content = { heading: 'Development projects', text: 'Sign in to continue with a development project' }
        break
      case constants.applicationTypes.CREDITS_PURCHASE.toLowerCase():
        content = { heading: 'Your statutory biodiversity credits', text: 'Sign in to continue with a statutory biodiversity credits purchase' }
        break
      case constants.applicationTypes.COMBINED_CASE.toLocaleLowerCase():
        content = { heading: 'Combined cases', text: 'Sign in to continue with an application to register a gain site and record off site gains at the same time' }
        break
      default:
        content = { text: 'Sign in again to resume an existing application or start a new one' }
    }

    return h.view(constants.views.SIGNED_OUT, { content })
  }
}

export default signedOut
