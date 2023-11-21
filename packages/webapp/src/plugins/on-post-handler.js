import constants from '../utils/constants.js'
import getApplicantContext from '../utils/get-applicant-context.js'
import { logger } from 'defra-logging-facade'

const onPostHandler = {
  plugin: {
    name: 'on-post-handler',
    register: (server, _options) => {
      server.ext('onPostHandler', async function (request, h) {
        // filter out everything but view gets
        if (request.response.variety === 'view') {
          if (request.method === 'get') {
            // if getting a view then set headers to stop client caching
            request.response.headers['cache-control'] = 'no-cache, no-store, must-revalidate'
            handleReferer(request)
          }
          // Add Account details to context if present
          addAccountDetailsToContextIfPresent(request, h)
        } else if (isApplicationSessionSaveNeeded(request)) {
          await saveApplicationSession(request)
        }
        return h.continue
      })
    }
  }
}

const handleReferer = request => {
  if (request.headers.referer) {
    // If referer was a check route then set the session referer
    // Route then decides whether to redirect to referer or not
    const setReferer = constants.setReferer.find(item => request.headers.referer.indexOf(item) > -1)
    const clearReferer = constants.clearReferer.find(item => request.headers.referer.indexOf(item) > -1)
    if (setReferer) {
      request.yar.set(constants.redisKeys.REFERER, `/${setReferer}`)
    } else if (clearReferer) {
      request.yar.clear(constants.redisKeys.REFERER)
    }
  } else {
    // If no referer then clear referer key because user has broken the journey
    request.yar.clear(constants.redisKeys.REFERER)
  }
}

const addAccountDetailsToContextIfPresent = (request, h) => {
  if (request.auth?.isAuthenticated && request.auth.credentials?.account) {
    if (!h.request.response.source.context) {
      h.request.response.source.context = {}
    }
    const { representing, organisation } = getApplicantContext(request.auth.credentials.account, request.yar)
    const accountInfo = request.auth.credentials.account.idTokenClaims
    h.request.response.source.context.auth = {
      isAuthenticated: true,
      firstName: accountInfo.firstName,
      lastName: accountInfo.lastName,
      email: accountInfo.email,
      contactId: accountInfo.contactId,
      accountManagementUrl: process.env.DEFRA_ID_ACCOUNT_MANAGEMENT_URL,
      enableAccountManagementUrl: request.path !== `${constants.routes.MANAGE_BIODIVERSITY_GAINS}`
    }

    if (organisation) {
      h.request.response.source.context.auth.representing = representing
    }
  }
}

const saveApplicationSession = async request => {
  // Use a dynamic import for the http utility module to prevent
  // errors when the unit tests for the http module run (there appears to be a conflict when
  // this file uses a standard import of the http module).
  const { postJson } = await import('../utils/http.js')
  cacheContactIdIfNeeded(request)
  cacheApplicationTypeIfNeeded(request)

  // Use the correct Redis key for the application type.
  const applicationReferenceRedisKey =
    request.yar.get(constants.redisKeys.APPLICATION_TYPE) === constants.applicationTypes.REGISTRATION
      ? constants.redisKeys.APPLICATION_REFERENCE
      : constants.redisKeys.DEVELOPER_APP_REFERENCE

  if (request.yar.get(applicationReferenceRedisKey)) {
    // Persist the session data asynchronously and allow the user to progress without waiting.
    // Log any failure but allow the journey to continue.
    // When the user signs out an attempt will be made to save journey data using async await
    // if required.

    // Ensure unsaved journey data is saved if the user signs out before this asynchronous
    // attempt to save data completes successfully.
    request.yar.set(constants.redisKeys.SAVE_APPLICATION_SESSION_ON_SIGNOUT_OR_JOURNEY_CHANGE, true)
    postJson(`${constants.AZURE_FUNCTION_APP_URL}/saveapplicationsession`, request.yar._store)
      .then(() => {
        request.yar.clear(constants.redisKeys.SAVE_APPLICATION_SESSION_ON_SIGNOUT_OR_JOURNEY_CHANGE)
      })
      .catch(error => {
        logger.error(error)
        request.yar.set(constants.redisKeys.SAVE_APPLICATION_SESSION_ON_SIGNOUT_OR_JOURNEY_CHANGE, true)
      })
  } else {
    const applicationReference = await postJson(`${constants.AZURE_FUNCTION_APP_URL}/saveapplicationsession`, request.yar._store)
    request.yar.set(applicationReferenceRedisKey, applicationReference)
  }
}

const isApplicationSessionSaveNeeded = request => {
  return request.method === 'post' &&
    request?.response?.statusCode === 302 &&
    // Exclude credits estimation and developing routing
    isRouteIncludedInApplicationSave(request) &&
    // Do not save application session data when an application has just been submitted.
    request?.response?.headers?.location !== constants.routes.APPLICATION_SUBMITTED &&
    request?.auth?.isAuthenticated
}

const isRouteIncludedInApplicationSave = request => {
  return !(request.path.startsWith('/credits-estimation')) &&
         !(request.path.startsWith('/developer/routing-'))
}

const cacheContactIdIfNeeded = request => {
  if (!request.yar.get(constants.redisKeys.CONTACT_ID)) {
    request.yar.set(constants.redisKeys.CONTACT_ID, request.auth.credentials.account.idTokenClaims.contactId)
  }
}

const cacheApplicationTypeIfNeeded = request => {
  let applicationType = request.yar.get(constants.redisKeys.APPLICATION_TYPE)
  const journeyType = request.path.split('/')[1]
  if (!applicationType) {
    if (journeyType === 'developer') {
      applicationType = constants.applicationTypes.ALLOCATION
      // Default to the application type for registations as
      // no other routes accept HTTP POSTS that cause this funcion to be called.
    } else {
      applicationType = constants.applicationTypes.REGISTRATION
    }
    request.yar.set(constants.redisKeys.APPLICATION_TYPE, applicationType)
  }
}

export default onPostHandler
