import { BACKEND_API } from './config.js'
import wreck from '@hapi/wreck'

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
    console.error('Error fetching OAuth token:', error)
    throw error
  }
}

export const resetTokenCache = ({ token = null, expiration = null } = {}) => {
  cachedToken = token
  tokenExpiration = expiration
}

export default async (url, options = {}, maxAttempts = 5) => {
  let attempts = 0

  while (attempts < maxAttempts) {
    attempts++

    try {
      const token = await getToken()
      const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`
      }

      const { payload } = await wreck.get(url, {
        ...options,
        headers,
        json: true
      })

      return payload
    } catch (err) {
      if (err.output?.statusCode === 401) {
        // Invalidate the token to fetch a new one
        cachedToken = null
      } else {
        throw err
      }
    }
  }

  throw new Error('Max attempts reached without successful response')
}
