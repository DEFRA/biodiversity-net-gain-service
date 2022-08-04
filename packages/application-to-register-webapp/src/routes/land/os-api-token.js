import constants from '../../utils/constants.js'
import { getBearerToken } from '@defra/bng-utils-lib'

// A route to retrieve an OAuth bearer token for accessing Ordnance Survey APIs.
// TO DO - Investigate options for securing this route or securing the retrieval of
// bearer tokens in some other way.
const config = {
  url: 'https://api.os.uk/oauth2/token/v1',
  clientId: process.env.ORDNANCE_SURVEY_API_KEY,
  clientSecret: process.env.ORDNANCE_SURVEY_API_SECRET
}

const getToken = () => {
  return (async () => await getBearerToken(config))()
}

export default {
  method: 'GET',
  path: constants.routes.OS_API_TOKEN,
  handler: getToken
}
