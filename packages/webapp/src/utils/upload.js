import path from 'path'
import { uploadDocument } from '@defra/bng-document-service'
import multiparty from 'multiparty'
import constants from './constants.js'
import { generateUniqueFilename } from './helpers.js'
const uploadFiles = async (logger, request, config, mode = 'single') => {
  const events = []
  // Return a promise for processing the multipart request.
  // This code is inspired by https://stackoverflow.com/questions/50522383/promisifying-multiparty
  return new Promise((resolve, reject) => {
    const form = new multiparty.Form()
    const uploadResults = []
    form.on('part', function (part) {
      try {
        // Send this part of the multipart request for processing
        if (mode === 'multiple') {
          const uniqueBlobName = generateUniqueFilename(part.filename)
          part.filename = uniqueBlobName
        }
        handlePart(logger, part, config, uploadResults)
        events.push(`Processed ${part.filename}`)
      } catch (err) {
        reject(err)
      }
    })
    form.on('error', function (err) {
      reject(err)
    })
    form.on('close', async function () {
      for (const uploadResult of uploadResults) {
        if (uploadResult.errorMessage) {
          reject(new Error(uploadResult.errorMessage))
          return
        }
      }

      try {
        // Resolve the promise when all parts of the upload have been processed.
        const eventData = await config.functionConfig.handleEventsFunction(config, events)
        const result = uploadResults.map(result => Object.assign(result, eventData))
        if (mode === 'multiple') {
          resolve(result)
        } else {
          resolve(result[0])
        }
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

const handlePart = (logger, part, config, uploadResults) => {
  const fileSizeInBytes = part.byteCount
  const fileSize = parseFloat(parseFloat(part.byteCount / 1024 / 1024).toFixed(config.fileValidationConfig?.maximumDecimalPlaces || 2))

  const uploadResult = {
    fileSize: fileSizeInBytes,
    filename: part.filename || null,
    fileType: part.headers['content-type'] ? part.headers['content-type'] : null
  }
  if (!part.filename) {
    uploadResult.errorMessage = constants.uploadErrors.noFile
    part.resume()
  } else if (config.fileValidationConfig?.fileExt && !config.fileValidationConfig.fileExt.includes(path.extname(part.filename.toLowerCase()))) {
    uploadResult.errorMessage = constants.uploadErrors.unsupportedFileExt
    part.resume()
  } else if (fileSize * 100 === 0) {
    uploadResult.errorMessage = constants.uploadErrors.emptyFile
    part.resume()
  } else if (fileSizeInBytes > config.fileValidationConfig.maxFileSize) {
    uploadResult.errorMessage = constants.uploadErrors.maximumFileSizeExceeded
    part.resume()
  } else {
    logger.log(`${new Date().toUTCString()} Uploading ${part.filename}`)
    const uploadConfig = createUploadConfiguration(config)
    uploadDocument(logger, uploadConfig, part)
  }
  uploadResults.push(uploadResult)
}

export { uploadFiles }
