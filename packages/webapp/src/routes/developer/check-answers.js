import constants from '../../utils/constants.js'
import developerApplication from '../../utils/developer-application.js'
import developerApplicationValidation from '../../utils/developer-application-validation.js'
import {
  initialCapitalization,
  dateToString,
  hideClass
} from '../../utils/helpers.js'

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

const getContext = request => {
  const applicationData = developerApplication(request.yar)
  const additionalEmailAddresses = getAdditionalEmailAddressArray(applicationData.developerAllocation.additionalEmailAddresses)

  const developmentDetails = applicationData.developerAllocation.developmentDetails
  const files = applicationData.developerAllocation.files
  const biodiversityGainSiteNumber = applicationData.developerAllocation.biodiversityGainSiteNumber
  const confirmDevelopmentDetails = applicationData.developerAllocation.confirmDevelopmentDetails
  const confirmOffsiteGainDetails = applicationData.developerAllocation.confirmOffsiteGainDetails
  return {
    routes: constants.routes,
    application: applicationData,
    developmentDetails,
    additionalEmailAddresses,
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
}]
