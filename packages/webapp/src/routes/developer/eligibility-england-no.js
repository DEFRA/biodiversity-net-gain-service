import constants from '../../utils/constants.js'

// const href = '#eligibilityEngNo'
const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.DEVELOPER_ELIGIBILITY_NO)
  },
  post: async (request, h) => {
    return h.redirect('#')
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_ELIGIBILITY_NO,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_ELIGIBILITY_NO,
  handler: handlers.post
}]
