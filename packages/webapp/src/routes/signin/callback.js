import { Boom } from '@hapi/boom'
import auth from '../../utils/auth.js'
import constants from '../../utils/constants.js'
import { postJson } from '../../utils/http.js'

const getRedirectUrl = async (request, account, preAuthenticationRoute) => {
  let redirectUrl = constants.routes.MANAGE_BIODIVERSITY_GAINS
  const applicationType = getApplicationType(preAuthenticationRoute)
  if (applicationType) {
    const applications = await postJson(`${constants.AZURE_FUNCTION_APP_URL}/getapplications`, {
      contactId: account.idTokenClaims.contactId,
      applicationType
    })
    if (applications?.length > 0) {
      if (applications?.length === 1 && applications[0]?.applicationStatus === 'IN PROGRESS') {
        await getApplicationSession(request, applications[0]?.applicationReference, account.idTokenClaims.contactId, applicationType)
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

const getApplicationSession = async (request, applicationReference, contactId, applicationType) => {
  const session = await postJson(`${constants.AZURE_FUNCTION_APP_URL}/getapplicationsession`, {
    applicationReference,
    contactId,
    applicationType
  })
  if (Object.keys(session).length === 0) {
    return Boom.badRequest(`${applicationType} with reference ${applicationReference} does not exist`)
  } else {
    request.yar.set(session)
  }
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
