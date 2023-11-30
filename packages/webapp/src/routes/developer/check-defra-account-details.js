import constants from '../../utils/constants.js'
import getApplicantContext from '../../utils/get-applicant-context.js'

const handlers = {
  get: async (request, h) => {
    // Clear any previous confirmation every time this page is accessed as part of forcing the user to confirm
    // their account details are correct based on who they are representing in the current session.
    request.yar.get(constants.redisKeys.DEVELOPER_DEFRA_ACCOUNT_DETAILS_CONFIRMED, true)
    request.yar.get(constants.redisKeys.ORGANISATION_ID, true)
    return h.view(constants.views.DEVELOPER_CHECK_DEFRA_ACCOUNT_DETAILS, getApplicantContext(request.auth.credentials.account, request.yar))
  },
  post: async (request, h) => {
    const { organisationId } = getApplicantContext(request.auth.credentials.account, request.yar)
    const defraAccountDetailsConfirmed = request.payload.defraAccountDetailsConfirmed
    if (defraAccountDetailsConfirmed) {
      request.yar.set(constants.redisKeys.DEVELOPER_DEFRA_ACCOUNT_DETAILS_CONFIRMED, defraAccountDetailsConfirmed)

      if (organisationId) {
        // If representing an organisation store the organisation ID so that it can be included in the payload
        // sent to the operator.
        request.yar.set(constants.redisKeys.ORGANISATION_ID, organisationId)
      }

      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || redirect(request.yar, h))
    } else {
      return h.view(constants.views.DEVELOPER_CHECK_DEFRA_ACCOUNT_DETAILS, {
        ...getApplicantContext(request.auth.credentials.account, request.yar),
        err: [{
          text: 'You must confirm your Defra account details are up to date',
          href: '#defraAccountDetailsConfirmed'
        }]
      })
    }
  }
}

const redirect = (session, h) => {
  if (session.get(constants.redisKeys.DEVELOPER_IS_AGENT) === constants.APPLICANT_IS_AGENT.YES) {
    return constants.routes.DEVELOPER_LANDOWNER_OR_LEASEHOLDER
  } else if (session.get(constants.redisKeys.DEVELOPER_LANDOWNER_OR_LEASEHOLDER) === constants.DEVELOPER_IS_LANDOWNER_OR_LEASEHOLDER.YES) {
    return constants.routes.DEVELOPER_BNG_NUMBER
  } else {
    return constants.routes.DEVELOPER_UPLOAD_CONSENT_TO_USE_GAIN_SITE
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_CHECK_DEFRA_ACCOUNT_DETAILS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_CHECK_DEFRA_ACCOUNT_DETAILS,
  handler: handlers.post
}]
