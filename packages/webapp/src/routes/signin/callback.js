import auth from '../../utils/auth.js'
import constants from '../../utils/constants.js'
import { getApplicationSession } from '../../utils/get-application.js'
import { postJson } from '../../utils/http.js'
import getOrganisationDetails from '../../utils/get-organisation-details.js'

const determineRedirectUrl = async (request, account, applicationType) => {
  let redirectUrl = constants.routes.MANAGE_BIODIVERSITY_GAINS
  if (applicationType) {
    const { currentOrganisationId: organisationId } = getOrganisationDetails(account.idTokenClaims)
    const applications = await postJson(`${constants.AZURE_FUNCTION_APP_URL}/getapplications`, {
      contactId: account.idTokenClaims.contactId,
      organisationId,
      applicationType
    })
    if (applications?.length === 1 && applications[0]?.applicationStatus === 'IN PROGRESS') {
      await getApplicationSession(request, applications[0]?.applicationReference, account.idTokenClaims.contactId, applicationType)
      redirectUrl = applicationType === constants.applicationTypes.ALLOCATION ? constants.routes.DEVELOPER_TASKLIST : constants.routes.REGISTER_LAND_TASK_LIST
    } else if (applications?.length > 1) {
      redirectUrl = applicationType === constants.applicationTypes.ALLOCATION ? constants.routes.DEVELOPER_DEVELOPMENT_PROJECTS : constants.routes.BIODIVERSITY_GAIN_SITES
    } else {
      redirectUrl = applicationType === constants.applicationTypes.ALLOCATION ? constants.routes.DEVELOPER_TASKLIST : constants.routes.REGISTER_LAND_TASK_LIST
    }
  }

  return redirectUrl
}

const getRedirectUrl = async (request, account, preAuthenticationRoute) => {
  if (!validatePreAuthenticationRoute(preAuthenticationRoute)) {
    return constants.routes.MANAGE_BIODIVERSITY_GAINS
  }
  const applicationType = getApplicationType(preAuthenticationRoute)
  const redirectUrl = await determineRedirectUrl(request, account, applicationType)
  return redirectUrl
}

const validatePreAuthenticationRoute = (route) => {
  if (typeof route !== 'string') {
    return false
  }
  const startsWithSlash = route.startsWith('/')
  const doesNotContainProtocol = !route.includes('://')
  const startsWithAllowedPath = ['/developer', '/land'].some(allowedPath => route.startsWith(allowedPath))
  return startsWithSlash && doesNotContainProtocol && startsWithAllowedPath
}

const getApplicationType = preAuthenticationRoute => {
  let applicationType
  if (preAuthenticationRoute) {
    if (preAuthenticationRoute.startsWith('/developer')) {
      applicationType = constants.applicationTypes.ALLOCATION
    } else if (preAuthenticationRoute.startsWith('/land')) {
      applicationType = constants.applicationTypes.REGISTRATION
    }
  }
  return applicationType
}

export default [{
  method: 'GET',
  path: constants.routes.SIGNIN_CALLBACK,
  options: {
    auth: {
      mode: 'try'
    }
  },
  handler: async (request, h) => {
    const account = await auth.authenticate(request.query.code, request.cookieAuth)
    const preAuthenticationRoute = request.yar.get(constants.redisKeys.PRE_AUTHENTICATION_ROUTE, true)
    const redirectUrl = await getRedirectUrl(request, account, preAuthenticationRoute)
    return h.redirect(redirectUrl)
  }
}]
