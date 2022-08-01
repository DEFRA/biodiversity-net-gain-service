import axios from 'axios'

const getBearerToken = async config => {
  const params = new URLSearchParams()
  params.append('grant_type', 'client_credentials')

  if (config.scope) {
    params.append('scope', config.scope)
  }

  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    auth: {
      username: config.clientId,
      password: config.clientSecret
    },
    data: params.toString(),
    url: config.url
  }

  const response = await axios.request(options)
  return response.data.access_token
}

export default getBearerToken
