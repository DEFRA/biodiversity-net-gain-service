import { upload } from '@defra/bng-document-service'
import multiparty from 'multiparty'

const uploadFiles = async (logger, request, config) => {
  const events = []
  // Return a promise for processing the multipart request.
  // This code is inspired by https://stackoverflow.com/questions/50522383/promisifying-multiparty
  return new Promise((resolve, reject) => {
    const form = new multiparty.Form()
    form.on('part', function (part) {
      if (!part.filename) {
        reject(new Error('Non-file received'))
      } else {
        // Send this part of the multipart request for processing
        handlePart(logger, part, config)
        events.push(`Processed ${part.filename}`)
      }
    })
    form.on('error', function (err) {
      reject(err)
    })
    form.on('close', async function () {
      try {
        // Resolve the promise when all parts of the upload have been processed.
        const eventData = await config.functionConfig.handleEventsFunction(config, events)
        resolve(eventData)
      } catch (err) {
        reject(err)
      }
    })
    form.parse(request.raw.req)
  })
}

const createUploadConfiguration = config => {
  // Clone the original configuration and retain the configured function used to perform the upload.
  const uploadConfig = JSON.parse(JSON.stringify(config))
  uploadConfig.functionConfig.uploadFunction = config.functionConfig.uploadFunction
  // Delete all configuration that does not need to be passed to the configured functions.
  // delete uploadConfig.viewConfig
  return uploadConfig
}

const handlePart = (logger, part, config) => {
  logger.log(`Uploading ${part.filename}`)
  const uploadConfig = createUploadConfiguration(config)
  upload(logger, uploadConfig, part)
}

export { uploadFiles }
