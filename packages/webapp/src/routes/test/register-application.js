import constants from '../../utils/constants.js'
import application from '../../utils/application.js'
import applicationValidation from '../../utils/application-validation.js'

const seedData = {
  method: 'GET',
  path: constants.routes.TEST_REGISTER_APPLICATION,
  handler: async (request, h) => {
    const { value, error } = applicationValidation.validate(application(request.yar, request.auth.credentials.account))
    if (error) {
      return h.response(JSON.stringify({
        statusCode: 500,
        err: true,
        message: error.message
      })).type('application/json')
    }
    return h.response(JSON.stringify(value)).type('application/json')
  }
}

export default seedData
