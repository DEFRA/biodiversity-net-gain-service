import constants from '../../utils/constants.js'
import Joi from 'joi'

export default [{
  method: 'GET',
  path: constants.routes.CANNOT_VIEW_APPLICATION,
  options: {
    validate: {
      query: Joi.object({
        orgError: Joi.boolean()
      })
    }
  },
  handler: (request, h) => h.view(constants.views.CANNOT_VIEW_APPLICATION, { orgError: request.query.orgError }).code(401)
}]
