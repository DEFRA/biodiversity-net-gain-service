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
    console.log('HERE')
    console.log(getContext(request))
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
    // Removing not required field from payload
    delete value.developerAllocation.confirmDevelopmentDetails
    delete value.developerAllocation.confirmOffsiteGainDetails

    const result = await postJson(`${constants.AZURE_FUNCTION_APP_URL}/processdeveloperapplication`, value)
    request.yar.set(constants.redisKeys.DEVELOPER_APP_REFERENCE, result.gainSiteReference)
    return h.redirect(constants.routes.APPLICATION_SUBMITTED)
  }
}

const getAdditionalEmailAddressArray = additionalEmailAddresses =>
  additionalEmailAddresses?.map(item => ({
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
  const applicationData = developerApplication(request.yar, request.auth.credentials.account)
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
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_CHECK_ANSWERS,
  handler: handlers.post
}]
