import constants from '../../utils/constants.js'
import developerApplication from '../../utils/developerApplication.js'
import developerApplicationValidation from '../../utils/developer-application-validation.js'
import {
  listArray,
  boolToYesNo,
  dateToString,
  hideClass
} from '../../utils/helpers.js'
import { logger } from 'defra-logging-facade'

const handlers = {
  get: async (request, h) => {
    const applicationData = developerApplication(request.yar)
    const additionalEmailAddresses = getAdditionalEmailAddressArray(applicationData.developerAllocation.additionalEmailAddresses)
    logger.info('GET Developer JSON payload for powerApp', applicationData)
    return h.view(constants.views.DEVELOPER_CHECK_ANSWERS, {
      developmentDetails: applicationData.developerAllocation.developmentDetails,
      files: applicationData.files,
      additionalEmailAddresses,
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    const { value, error } = developerApplicationValidation.validate(developerApplication(request.yar))
    if (error) {
      throw new Error(error)
    }
    logger.info('POST Developer JSON payload for powerApp', value, error)
    return h.redirect(constants.routes.DEVELOPER_ROUTING_REGISTER)
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
