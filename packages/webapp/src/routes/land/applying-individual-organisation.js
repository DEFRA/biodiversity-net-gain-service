import auth from '../../utils/auth.js'
import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    // TO DO - Add processRegistration task call when check your answers support is added for applicant information.
    return h.view(constants.views.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION, getContext(request))
  },
  post: async (request, h) => {
    const applicantType = request.payload.applicantType
    if (applicantType) {
      request.yar.set(constants.redisKeys.REGISTRATION_APPLICANT_TYPE, applicantType)
      // Check that the selected applicant type matches whether the user has signed in to represent themselves
      // or an organisation.
      const { currentOrganisation } = auth.getAuthenticationContext(request.auth.credentials.account)
      if ((applicantType === constants.applicantTypes.INDIVIDUAL && !currentOrganisation) ||
          (applicantType === constants.applicantTypes.ORGANISATION && currentOrganisation)) {
        return h.redirect(constants.routes.CHECK_DEFRA_ACCOUNT_DETAILS)
      // Add temporary basic sad path logic until sad path logic is agreed.
      } else if (applicantType === constants.applicantTypes.INDIVIDUAL) {
        return getErrorView(h, request, `You are signed in representing ${currentOrganisation}. Sign in representing yourself`)
      } else {
        return getErrorView(h, request, 'You are signed in representing yourself. Sign in representing the correct organisation')
      }
    } else {
      return getErrorView(h, request, 'Select if you are applying as an individual or as part of an organisation')
    }
  }
}

const getContext = request => {
  return {
    applicantType: request.yar.get(constants.redisKeys.REGISTRATION_APPLICANT_TYPE)
  }
}

const getErrorView = (h, request, errorMessage) => {
  return h.view(constants.views.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION, {
    err: [{
      text: errorMessage,
      href: '#applicantType'
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
