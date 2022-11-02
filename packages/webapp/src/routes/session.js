import constants from '../utils/constants.js'
import Joi from 'joi'

const session = [{
  method: 'GET',
  path: constants.routes.SESSION,
  handler: async (request, h) => {
    return h.view(constants.views.SESSION, {
      helloWorld: request.yar.get('helloWorld') || 'session not set' // show helloWorld from session or not set
    })
  }
}, {
  method: 'POST',
  path: constants.routes.SESSION,
  handler: (request, h) => {
    request.yar.set('helloWorld', request.payload.helloWorld)
    return h.redirect(constants.routes.SESSION)
  },
  options: {
    validate: {
      payload: Joi.object().keys({
        helloWorld: Joi.string().required()
      })
    }
  }
}]

export default session
