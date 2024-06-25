import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.START_REGISTER_GAIN_SITE, {
    })
  },
  post: async (request, h) => {
    const applicationType = request.payload.applicationType
    if (applicationType === 'registration') {
      return h.redirect(constants.routes.BIODIVERSITY_GAIN_SITES)
    } else if (applicationType === 'combined-case') {
      return h.redirect(constants.routes.COMBINED_CASE_PROJECTS)
    } else {
      return h.view(constants.views.START_REGISTER_GAIN_SITE, {
        err: [{
          text: 'Select an option to continue',
          href: '#applicant-type'
        }]
      })
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.START_REGISTER_GAIN_SITE,
  handler: handlers.get
},
{
  method: 'POST',
  path: constants.routes.START_REGISTER_GAIN_SITE,
  handler: handlers.post
}]
