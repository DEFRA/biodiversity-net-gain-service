import { ConfidentialClientApplication, LogLevel } from '@azure/msal-node'
import { DEFRA_ID, IS_PRODUCTION, SERVICE_HOME_URL } from './config.js'
import constants from './constants.js'

const authConfig = {
  authority: `${DEFRA_ID.DEFRA_ID_INSTANCE}/${DEFRA_ID.DEFRA_ID_DOMAIN}/${DEFRA_ID.DEFRA_ID_POLICY_ID}`,
  clientId: DEFRA_ID.DEFRA_ID_CLIENT_ID,
  clientSecret: DEFRA_ID.DEFRA_ID_CLIENT_SECRET,
  knownAuthorities: [DEFRA_ID.DEFRA_ID_INSTANCE],
  redirectUri: DEFRA_ID.DEFRA_ID_REDIRECT_URI,
  validateAuthority: false
}

const msalClientApplication = new ConfidentialClientApplication({
  auth: authConfig,
  system: {
    loggerOptions: {
      loggerCallback (_loglevel, message, _containsPii) {
        console.log(message)
      },
      piiLoggingEnabled: false,
      logLevel: IS_PRODUCTION ? LogLevel.Error : LogLevel.Info
    }
  }
})

const getAuthenticationUrl = () => {
  const authCodeUrlParameters = {
    scopes: ['openid', 'offline_access', authConfig.clientId],
    extraQueryParameters: {
      serviceId: DEFRA_ID.DEFRA_ID_SERVICE_ID,
      forceReselection: true
    },
    redirectUri: authConfig.redirectUri
  }

  return msalClientApplication.getAuthCodeUrl(authCodeUrlParameters)
}

const setCookie = (cookieAuth, token) => cookieAuth.set({
  account: { idTokenClaims: token?.account?.idTokenClaims }
})

const authenticate = async (code, cookieAuth) => {
  const { redirectUri } = authConfig
  const token = await msalClientApplication.acquireTokenByCode({
    code,
    redirectUri
  })
  setCookie(cookieAuth, token)
  return token
}

const refresh = async (account, cookieAuth, forceRefresh = true) => {
  const token = await msalClientApplication.acquireTokenSilent({
    account,
    forceRefresh
  })
  setCookie(cookieAuth, token)
  return token
}

const logout = async request => msalClientApplication.getTokenCache().removeAccount(request.auth.credentials.account)

const getLogoutUrl = () => {
  const signoutUrl = new URL(`${authConfig.authority}/oauth2/v2.0/logout`)
  signoutUrl.searchParams.append('post_logout_redirect_uri', `${SERVICE_HOME_URL}${constants.routes.SIGNED_OUT}`)
  return signoutUrl
}

export default {
  getAuthenticationUrl,
  authenticate,
  refresh,
  logout,
  getLogoutUrl
}
