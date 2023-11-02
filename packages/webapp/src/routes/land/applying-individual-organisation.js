import auth from '../../utils/auth.js'
import constants from '../../utils/constants.js'

const individualSignInErrorMessage = `
  You cannot apply as an organisation because the Defra account you’re signed into is linked to an individual.
  Register for or sign into a Defra account representing an organisation before continuing this application`

const organisationSignInErrorMessage = `
  You cannot apply as an individual because the Defra account you’re signed into is linked to an organisation.
  Register for or sign into a Defra account as yourself before continuing this application`

const handlers = {
  get: async (request, h) => {
    // TO DO - Add processRegistration task call when check your answers support is added for applicant information.
    return h.view(constants.views.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION, getContext(request))
  },
  post: async (request, h) => {
    const landownerType = request.payload.landownerType
    if (landownerType) {
      request.yar.set(constants.redisKeys.LANDOWNER_TYPE, landownerType)
      // Check that the selected applicant type matches whether the user has signed in to represent themselves
      // or an organisation.
      const { currentOrganisation } = auth.getAuthenticationContext(request.auth.credentials.account)
      if ((landownerType === constants.landownerTypes.INDIVIDUAL && !currentOrganisation) ||
          (landownerType === constants.landownerTypes.ORGANISATION && currentOrganisation)) {
        return h.redirect(constants.routes.CHECK_DEFRA_ACCOUNT_DETAILS)
      // Add temporary basic sad path logic until sad path logic is agreed.
      } else if (landownerType === constants.landownerTypes.INDIVIDUAL) {
        return getErrorView(h, request, organisationSignInErrorMessage)
      } else {
        return getErrorView(h, request, individualSignInErrorMessage)
      }
    } else {
      return getErrorView(h, request, 'Select if you are applying as an individual or as part of an organisation')
    }
  }
}

const getContext = request => {
  return {
    landownerType: request.yar.get(constants.redisKeys.LANDOWNER_TYPE)
  }
}

const getErrorView = (h, request, errorMessage) => {
  return h.view(constants.views.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION, {
    err: [{
      text: errorMessage,
      href: '#landownerType'
    }],
    ...getContext(request)
  })
}

export default [{
  method: 'GET',
  path: constants.routes.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION,
  handler: handlers.post
}
]
