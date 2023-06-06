import constants from '../../utils/constants.js'
import developerApplication from '../../utils/developer-application.js'
import {
  initialCapitalization,
  dateToString,
  hideClass
} from '../../utils/helpers.js'
import { logger } from 'defra-logging-facade'
import developerApplicationValidation from '../../utils/developer-application-validation.js'
import { postJson } from '../../utils/http.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.DEVELOPER_CHECK_ANSWERS, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    const { value, error } = developerApplicationValidation.validate(developerApplication(request.yar))
    if (error) {
      throw new Error(error)
    }
    const result = await postJson(`${constants.AZURE_FUNCTION_APP_URL}/processdeveloperapplication`, value)
    request.yar.set(constants.redisKeys.APPLICATION_REFERENCE, result.gainSiteReference)
    return h.redirect(constants.routes.DEVELOPER_APPLICATION_SUBMITTED)
  }
}

const getAdditionalEmailAddressArray = additionalEmailAddresses =>
  additionalEmailAddresses && additionalEmailAddresses.map(item => ({
    key: {
      text: 'Email'
    },
    value: {
      html: `<span>${item.email}</span>`
    },
    actions: {
      items: [
        {
          href: constants.routes.DEVELOPER_EMAIL_ENTRY,
          text: 'Change',
          visuallyHiddenText: ' Addtional email addresses'
        }
      ]
    }
  }))

const getContext = _request => {
  const applicationData = developerApplication(_request.yar)
  const additionalEmailAddresses = getAdditionalEmailAddressArray(applicationData.developerAllocation.additionalEmailAddresses)

  const developmentDetails = applicationData.developerAllocation.developmentDetails
  const files = applicationData.developerAllocation.files
  const biodiversityGainSiteNumber = applicationData.developerAllocation.biodiversityGainSiteNumber
  const confirmDevelopmentDetails = applicationData.developerAllocation.confirmDevelopmentDetails
  const confirmOffsiteGainDetails = applicationData.developerAllocation.confirmOffsiteGainDetails
  logger.info('GET Developer JSON payload for powerApp', JSON.stringify(applicationData))
  return {
    initialCapitalization,
    dateToString,
    hideClass,
    routes: constants.routes,
    application: applicationData,
    developmentDetails,
    additionalEmailAddresses,
    files,
    biodiversityGainSiteNumber,
    confirmDevelopmentDetails,
    confirmOffsiteGainDetails
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
