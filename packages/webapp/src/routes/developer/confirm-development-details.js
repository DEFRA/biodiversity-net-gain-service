import constants from '../../utils/constants.js'
import path from 'path'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import { logger } from 'defra-logging-facade'
import BngExtractionService from '../../../../bngdataextractor/src/bng-metric-extraction-service.js'
import fs from 'fs'

const href = '#dev-details-checked-yes'
const handlers = {
  get: async (request, h) => {
    const context = await getContext(request)
    return h.view(constants.views.DEVELOPER_CONFIRM_DEV_DETAILS, context)
  },
  post: async (request, h) => {
    const confirmDevDetails = request.payload.confirmDevDetails
    const metricUploadLocation = request.yar.get(constants.redisKeys.METRIC_LOCATION)
    request.yar.set(constants.redisKeys.METRIC_FILE_CHECKED, confirmDevDetails)
    if (confirmDevDetails === 'no') {
      // delete the file from blob storage
      const config = {
        containerName: 'untrusted',
        blobName: metricUploadLocation
      }
      await blobStorageConnector.deleteBlobIfExists(config)
      request.yar.clear(constants.redisKeys.METRIC_LOCATION)
      return h.redirect(constants.routes.DEVELOPER_UPLOAD_METRIC)
    } else if (confirmDevDetails === 'yes') {
      return h.redirect('/' + constants.views.DEVELOPER_CONFIRM_DEV_DETAILSx)
    } else {
      return h.view(constants.views.DEVELOPER_CHECK_UPLOAD_METRIC, {
        filename: path.basename(metricUploadLocation),
        ...await getContext(request),
        err: [
          {
            text: 'Select yes if this is the correct file',
            href
          }
        ]
      })
    }
  }
}

const getContext = async request => {
  const blobName = request.yar.get(constants.redisKeys.METRIC_LOCATION)
  const metricData = await getMetricFileDataAsObject(blobName)
  request.yar.set(constants.redisKeys.DEVELOPER_METRIC_DATA, metricData)
  return {
    startPage: metricData.startPage
  }
}

export const getMetricFileDataAsObject = async (blobName) => {
  const currentPath = process.cwd()
  const filepath = currentPath + '/tmp/metric.xls'
  const tmpDir = currentPath + '/tmp'
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir)
  }

  const config = {
    blobName,
    containerName: 'untrusted',
    fileNameWithPath: filepath
  }
  await blobStorageConnector.downloadBlobToFileIfExists(logger, config)

  if (checkFileExists(filepath)) {
    console.log('Extracting file info...')
    const extractService = new BngExtractionService()
    const readableStream = fs.createReadStream(path.resolve(currentPath, filepath))
    return await extractService.extractMetricContent(readableStream)
  }
  return null
}

const checkFileExists = (filepath) => {
  try {
    if (!fs.existsSync(filepath)) {
      fs.writeFileSync(filepath, '')
    }
    const stats = fs.statSync(filepath)
    const fileSize = stats.size
    console.info('Size:', fileSize)
    return fileSize > 0
  } catch (error) {
    console.error('Err:', error)
  }
  return false
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_CONFIRM_DEV_DETAILS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_CONFIRM_DEV_DETAILS,
  handler: handlers.post
}]
