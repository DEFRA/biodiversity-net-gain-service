import auth from '../../utils/auth.js'
import constants from '../../utils/constants.js'
import { postJson } from '../../utils/http.js'

const getRedirectUrl = async (account, preAuthenticationRoute) => {
  let redirectUrl = constants.routes.MANAGE_BIODIVERSITY_GAINS
  const applicationType = getApplicationType(preAuthenticationRoute)
  if (applicationType) {
    const applications = await postJson(`${constants.AZURE_FUNCTION_APP_URL}/getapplications`, {
      contactId: account.idTokenClaims.contactId,
      applicationType
    })
    if (applications?.length > 0) {
      if (applications?.length === 1 && applications?.applicationStatus === 'IN PROGRESS') {
        redirectUrl = applicationType === constants.applicationTypes.ALLOCATION ? constants.routes.DEVELOPER_TASKLIST : constants.routes.REGISTER_LAND_TASK_LIST
      } else {
        redirectUrl = applicationType === constants.applicationTypes.ALLOCATION ? constants.routes.DEVELOPER_DEVELOPMENT_PROJECTS : constants.routes.BIODIVERSITY_GAIN_SITES
      }
    } else {
      redirectUrl = applicationType === constants.applicationTypes.ALLOCATION ? constants.routes.DEVELOPER_TASKLIST : constants.routes.REGISTER_LAND_TASK_LIST
    }
  }

  return redirectUrl
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
    const redirectUrl = await getRedirectUrl(account, preAuthenticationRoute)
    return h.redirect(redirectUrl)
  }
}]
