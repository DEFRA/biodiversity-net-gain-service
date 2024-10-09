import { BACKEND_API } from './config.js'

let cachedToken = null
let tokenExpiration = null

export const getToken = async () => {
  const currentTime = Math.floor(Date.now() / 1000)

  if (cachedToken && tokenExpiration && currentTime < tokenExpiration) {
    console.log('Returning cached token...')
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
    console.log('Fetching fresh token...')
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch token: ${response.statusText}`)
    }

    console.log('Token successfully fetched!')

    const data = await response.json()

    cachedToken = data.access_token
    tokenExpiration = currentTime + data.expires_in

    const expirationDate = new Date(tokenExpiration * 1000)
    console.log(`Token expires: ${expirationDate.toLocaleString()}`)

    return cachedToken
  } catch (error) {
    console.error('Error fetching OAuth token:', error)
    throw error
  }
}
