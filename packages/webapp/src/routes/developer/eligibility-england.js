import constants from '../../utils/constants.js'

// const href = '#eligibilityEngland'
const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.DEVELOPER_ELIGIBILITY_ENGLAND)
  },
  post: async (request, h) => {
    return h.redirect('#')
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_ELIGIBILITY_ENGLAND,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_ELIGIBILITY_ENGLAND,
  handler: handlers.post
}]
