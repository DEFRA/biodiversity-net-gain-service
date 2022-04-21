import { signalRConnector } from '@defra/bng-connectors-lib'
import { upload } from '@defra/bng-document-service'
import multiparty from 'multiparty'

const uploadFile = async (logger, request, h, config) => {
  const promises = []
  // Return a promise for processing the multipart request.
  // This code is inspired by https://stackoverflow.com/questions/50522383/promisifying-multiparty
  return new Promise((resolve, reject) => {
    const form = new multiparty.Form()
    form.on('part', function (part) {
      if (!part.filename) resolve()
      logger.log(`Uploading ${part.filename}`)
      const uploadConfig = createUploadConfiguration(logger, config)
      // Prepare to send this part of the multipart request for processing.
      promises.push(upload(logger, uploadConfig, part))
    })
    form.on('error', function (err) {
      reject(err)
    })
    form.on('close', async function () {
      try {
        // Send the upload for procssing.
        resolve(await processUpload(logger, promises, config.signalRConfig))
      } catch (err) {
        reject(err)
      }
      resolve()
    })
    form.parse(request.raw.req)
  })
}

const createUploadConfiguration = (logger, config, fileDetails) => {
  // Clone the original configuration and retain the configured function used to perform the upload.
  const uploadConfig = JSON.parse(JSON.stringify(config))
  uploadConfig.functionConfig.uploadFunction = config.functionConfig.uploadFunction
  // Delete all configuration that does not need to be passed to the configured functions.
  // delete uploadConfig.viewConfig
  return uploadConfig
}

// TO DO - Encapsulate this functionality in the Azure SignalR connector.
const processUpload = async (logger, promises, config) => {
  logger.log('Processing upload')
  // Prepare for SignalR to send a notification when the upload has been processed.
  const connection = signalRConnector.createConnection(logger, config.url)
  await connection.start()
  // Send the upload for processing.
  await Promise.all(promises)
  // Return a promise to be resolved when the upload has been processed.
  return createUploadProcessedPromise(logger, connection, config.eventName)
}

const createUploadProcessedPromise = (logger, connection, eventName) => {
  return new Promise((resolve, reject) => {
    // TO DO - Add error handling support.
    connection.on(eventName, async (data) => {
      try {
        // The upload has been processed.
        // Resolve the promise with metadata associated with the processed upload.
        resolve(data)
      } finally {
        await connection.stop()
      }
    })
  })
}

export { uploadFile }
