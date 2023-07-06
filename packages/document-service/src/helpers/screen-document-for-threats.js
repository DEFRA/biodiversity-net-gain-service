import axios from 'axios'
import https from 'https'
import FormData from 'form-data'
import path from 'path'
import { getBearerToken } from '@defra/bng-utils-lib'

const AUTHORIZATION = 'Authorization'
const FILE = 'file'
const FILE_DETAILS = 'fileDetails'
const OCP_APIM_SUBSCRIPTION_KEY = 'ocp-apim-subscription-key'

const requestTimeout = process.env.AV_REQUEST_TIMEOUT_MS || 120000

const screenDocumentForThreats = async (logger, config, stream) => {
  const fileDetails = buildFileDetails(config.fileConfig)
  const formData = buildFormData(config.fileConfig, stream, fileDetails)
  const headers = await buildHeaders(config, formData)
  const url = `${config.baseUrl}/${fileDetails.collection}/${fileDetails.key}`

  const options = {
    headers,
    url,
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  }

  const putOptions = Object.assign({ method: 'PUT', data: formData }, options)

  try {
    logger.log(`Sending ${fileDetails.key} for screening`)
    const axiosInstance = axios.create({
      httpAgent: new https.Agent({ keepAlive: true }),
      timeout: requestTimeout,
      headers: {
        Connection: 'Keep-Alive',
        'Keep-Alive': `timeout=${requestTimeout / 1000}, max=1000`
      }
    })
    return axiosInstance.request(putOptions)
  } catch (err) {
    logger.log(`Error connecting to AV service ${err}`)
    throw err
  }
}

const buildFileDetails = config => {
  const fileLocation = config.location
  const fileLocationComponents = fileLocation.split('/')
  const fileExtension = path.extname(fileLocation)

  return {
    key: fileLocationComponents[0],
    collection: fileLocationComponents[1],
    extension: fileExtension,
    service: 'bng',
    fileName: path.basename(fileLocationComponents[2], fileExtension),
    userId: process.env.AV_API_USER_ID
  }
}

const buildFormData = (config, stream, fileDetails) => {
  const formData = new FormData()
  formData.append(FILE_DETAILS, JSON.stringify(fileDetails))
  formData.append(FILE, stream, config.location)
  return formData
}

const buildHeaders = async (config, formData) => {
  const headers = Object.assign(config.headers || {}, formData.getHeaders())
  const bearerToken = await getBearerToken(config.authenticationConfig)
  headers[AUTHORIZATION] = `Bearer ${bearerToken.access_token}`
  headers[OCP_APIM_SUBSCRIPTION_KEY] = process.env.AV_API_OCP_APIM_SUBSCRIPTION_KEY
  return headers
}

export default screenDocumentForThreats
