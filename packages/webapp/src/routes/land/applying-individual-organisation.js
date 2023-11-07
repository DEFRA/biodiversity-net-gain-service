import getApplicantContext from '../../utils/get-applicant-context.js'
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
      const { noOrganisationsLinkedToDefraAccount, organisation } =
        getApplicantContext(request.auth.credentials.account, request.yar)

      if ((landownerType === constants.landownerTypes.INDIVIDUAL && !organisation) ||
          (landownerType === constants.landownerTypes.ORGANISATION && organisation)) {
        return h.redirect(constants.routes.CHECK_DEFRA_ACCOUNT_DETAILS)
      // Add temporary basic sad path logic until sad path logic is agreed.
      } else if (landownerType === constants.landownerTypes.INDIVIDUAL) {
        // Individual has been chosen as the landowner type but the user is signed in representing an organisation.
        return getErrorView(h, request, organisationSignInErrorMessage)
      } else {
        // Organisation has been chosen as the landowner type but the user is signed in as an individual.
        // Check if the user has any organisations lined to their Defra account to decide which error page
        // or error message to display.
        return processOrganisationLandownerError(h, request, noOrganisationsLinkedToDefraAccount)
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

const processOrganisationLandownerError = (h, request, noOrganisationsLinkedToDefraAccount) => {
  if (noOrganisationsLinkedToDefraAccount) {
    return h.redirect(constants.routes.DEFRA_ACCOUNT_NOT_LINKED)
  } else {
    return getErrorView(h, request, individualSignInErrorMessage)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION,
  handler: handlers.post
}]
