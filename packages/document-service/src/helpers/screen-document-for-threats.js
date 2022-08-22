import axios from 'axios'
import FormData from 'form-data'
import path from 'path'
import { ThreatScreeningError } from '@defra/bng-errors-lib'
import { getBearerToken } from '@defra/bng-utils-lib'

const AUTHORIZATION = 'Authorization'
const FILE = 'file'
const FILE_DETAILS = 'fileDetails'
const NOT_FOUND = 404
const OCP_APIM_SUBSCRIPTION_KEY = 'ocp-apim-subscription-key'
const OK = 200

const screenDocumentForThreats = async (logger, config, stream) => {
  const fileDetails = buildFileDetails(config.fileConfig)
  const formData = buildFormData(config.fileConfig, stream, fileDetails)
  const headers = await buildHeaders(config, formData)
  const url = `${config.baseUrl}/${fileDetails.collection}/${fileDetails.key}`

  const options = {
    headers,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    url
  }

  const getOptions = Object.assign({ method: 'GET', responseType: 'stream' }, options)
  const putOptions = Object.assign({ method: 'PUT', data: formData }, options)
  await axios.request(putOptions)

  // TO DO - Preliminary integration with the asynchronous streaming based anti-virus API
  // endpoints requires polling. If asynchronous integration is used in the long term, it
  // is preferable for notifications to be provided when screening is complete.
  return waitForFileProcessing(logger, fileDetails, getOptions)
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

const waitForFileProcessing = async (logger, fileDetails, options) => {
  const file = `${fileDetails.fileName}${fileDetails.extension}`
  let count = parseInt(process.env.AV_API_RESULT_RETRIEVAL_ATTEMPTS) || 4
  let response

  do {
    logger.log(`Waiting for screening of ${file} - ${count} attempt(s) remaining`)
    await new Promise(resolve => setTimeout(resolve, parseInt(process.env.AV_API_RESULT_RETRIEVAL_INTERVAL_MS) || 5000))
    count--
    try {
      response = await axios.request(options)
    } catch (err) {
      if (err.response && err.response.status === NOT_FOUND && count > 0) {
        // Screening is still in progress so contune polling.
        response = err.response
        continue
      } else {
        throw new ThreatScreeningError(err)
      }
    }
  } while (response.status !== OK)

  logger.log(`Screening of ${file} succeeded`)
  return response.data
}

export default screenDocumentForThreats
