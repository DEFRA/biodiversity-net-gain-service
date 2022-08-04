import constants from '../../utils/constants.js'
import { logger } from 'defra-logging-facade'
import { getBearerToken } from '@defra/bng-utils-lib'

// A route to retrieve an OAuth bearer token for accessing Ordnance Survey APIs.
// TO DO - Investigate options for securing this route or securing the retrieval of
// bearer tokens in some other way.
const config = {
  url: 'https://api.os.uk/oauth2/token/v1',
  clientId: process.env.ORDNANCE_SURVEY_API_KEY,
  clientSecret: process.env.ORDNANCE_SURVEY_API_SECRET
}

const getToken = async () => {
  const bearerToken = await getBearerToken(config)
  logger.log('Got bearer token')
  return bearerToken
}

export default {
  method: 'GET',
  path: constants.routes.OS_API_TOKEN,
  handler: getToken
}
