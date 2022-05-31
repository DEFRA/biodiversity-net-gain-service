import constants from '../../utils/constants.js'
import axios from 'axios'

// A route to retrieve an OAuth bearer token for accessing Ordnance Survey APIs.
// TO DO - Investigate options for securing this route or securing the retrieval of
// bearer tokens in some other way.
const params = new URLSearchParams()
params.append('grant_type', 'client_credentials')

const options = {
  method: 'POST',
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  auth: {
    username: process.env.ORDNANCE_SURVEY_API_KEY,
    password: process.env.ORDNANCE_SURVEY_API_SECRET
  },
  data: params.toString(),
  url: 'https://api.os.uk/oauth2/token/v1'
}

const getToken = async (request) => {
  const response = await axios.request(options)
  return response.data
}
const ordnanceSurveyApiTokenRoutes = {
  method: 'GET',
  path: constants.routes.OS_API_TOKEN,
  handler: getToken
}

export default ordnanceSurveyApiTokenRoutes
