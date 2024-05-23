import constants from '../../utils/constants.js'
import developerApplication from '../../utils/developer-application.js'
import developerApplicationValidation from '../../utils/developer-application-validation.js'
import {
  initialCapitalization,
  dateToString,
  hideClass
} from '../../utils/helpers.js'
import { postJson } from '../../utils/http.js'

const handlers = {
  get: async (request, h) => {
    const { value, error } = developerApplicationValidation.validate(developerApplication(request.yar, request.auth.credentials.account))

    console.log(JSON.stringify(value, null, 2))

    console.log(error)

    return request.yar.get(constants.redisKeys.DEVELOPER_APP_REFERENCE) !== null
      ? h.view(constants.views.DEVELOPER_CHECK_ANSWERS, {
        ...getContext(request)
      })
      : h.redirect('/')
  },
  post: async (request, h) => {
    const { value, error } = developerApplicationValidation.validate(developerApplication(request.yar, request.auth.credentials.account))
    if (error) {
      throw new Error(error)
    }

    const result = await postJson(`${constants.AZURE_FUNCTION_APP_URL}/processdeveloperapplication`, value)
    request.yar.set(constants.redisKeys.DEVELOPER_APP_REFERENCE, result.allocationReference)
    return h.redirect(constants.routes.APPLICATION_SUBMITTED)
  }
}

const getContext = request => {
  const applicationData = developerApplication(request.yar, request.auth.credentials.account)
  const developmentDetails = applicationData.developerRegistration.developmentDetails
  const files = applicationData.developerRegistration.files
  const biodiversityGainSiteNumber = applicationData.developerRegistration.biodiversityGainSiteNumber
  const confirmDevelopmentDetails = applicationData.developerRegistration.confirmDevelopmentDetails
  const confirmOffsiteGainDetails = applicationData.developerRegistration.confirmOffsiteGainDetails
  return {
    routes: constants.routes,
    application: applicationData,
    developmentDetails,
    files,
    biodiversityGainSiteNumber,
    confirmDevelopmentDetails,
    confirmOffsiteGainDetails,
    initialCapitalization,
    dateToString,
    hideClass
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_CHECK_ANSWERS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_CHECK_ANSWERS,
  handler: handlers.post
}]
