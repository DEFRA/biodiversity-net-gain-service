import wreck from '@hapi/wreck'
import { BACKEND_API } from './config.js'
import { logger } from '@defra/bng-utils-lib'

const MAX_ATTEMPTS = 5

let cachedToken = null
let tokenExpiration = null

const getToken = async () => {
  const currentTime = Math.floor(Date.now() / 1000)

  if (cachedToken && tokenExpiration && currentTime < tokenExpiration) {
    return cachedToken
  }

  const tokenUrl = `https://login.microsoftonline.com/${BACKEND_API.OAUTH_TENANT_ID}/oauth2/v2.0/token`

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: BACKEND_API.OAUTH_CLIENT_ID,
    client_secret: BACKEND_API.OAUTH_SECRET,
    scope: BACKEND_API.OAUTH_SCOPE
  })

  try {
    const { payload } = await wreck.post(tokenUrl, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      payload: body.toString(),
      json: true
    })

    cachedToken = payload.access_token
    tokenExpiration = currentTime + payload.expires_in

    return cachedToken
  } catch (error) {
    logger.error(`Error fetching OAuth token: ${error}`)
    throw error
  }
}

export const resetTokenCache = ({ token = null, expiration = null } = {}) => {
  cachedToken = token
  tokenExpiration = expiration
}

const determineHeaders = async () => {
  if (BACKEND_API.USE_OAUTH) {
    const oauthToken = await getToken()
    return {
      Authorization: `Bearer ${oauthToken}`
    }
  }

  return {
    'Ocp-Apim-Subscription-Key': BACKEND_API.SUBSCRIPTION_KEY
  }
}

export default async (url) => {
  let attempts = 0

  while (attempts < MAX_ATTEMPTS) {
    attempts++

    try {
      const headers = await determineHeaders()

      const { payload } = await wreck.get(url, {
        headers,
        json: true
      })

      return payload
    } catch (err) {
      if (err.output?.statusCode === 401 && BACKEND_API.USE_OAUTH) {
        // Invalidate the token to fetch a new one. We only need to do this if we're using OAuth.
        cachedToken = null
      } else {
        throw err
      }
    }
  }

  throw new Error('Max attempts reached without successful response')
}
