import constants from '../../utils/constants.js'
import developerApplication from '../../utils/developer-application.js'
import developerApplicationValidation from '../../utils/developer-application-validation.js'
import {
  listArray,
  boolToYesNo,
  dateToString,
  hideClass
} from '../../utils/helpers.js'
import { logger } from 'defra-logging-facade'
import { postJson } from '../../utils/http.js'

const handlers = {
  get: async (request, h) => {
    const applicationData = developerApplication(request.yar)
    const additionalEmailAddresses = getAdditionalEmailAddressArray(applicationData.developerAllocation.additionalEmailAddresses)
    logger.info('GET Developer JSON payload for powerApp', applicationData.developerAllocation)
    return h.view(constants.views.DEVELOPER_CHECK_ANSWERS, {
      developmentDetails: applicationData.developerAllocation.developmentDetails,
      files: applicationData.developerAllocation.files,
      additionalEmailAddresses,
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    const { value, error } = developerApplicationValidation.validate(developerApplication(request.yar))
    if (error) {
      throw new Error(error)
    }
    const result = await postJson(`${constants.AZURE_FUNCTION_APP_URL}/processdeveloperapplication`, value)
    request.yar.set(constants.redisKeys.APPLICATION_REFERENCE, result.referenceNumber)
    return h.redirect(constants.routes.DEVELOPER_CONFIRM)
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
  return {
    listArray,
    boolToYesNo,
    dateToString,
    hideClass,
    routes: constants.routes
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_CHECK_ANSWERS,
  handler: handlers.get
},
{
  method: 'POST',
  path: constants.routes.DEVELOPER_CHECK_ANSWERS,
  handler: handlers.post
}]
