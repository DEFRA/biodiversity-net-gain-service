import path from 'path'
import { uploadDocument } from '@defra/bng-document-service'
import { uploadStreamAndAwaitScan } from './azure-storage.js'
import multiparty from 'multiparty'
import constants from './constants.js'

const uploadFile = async (logger, request, config) => {
  // Use multiparty to get file stream
  const uploadResult = await new Promise((resolve, reject) => {
    const form = new multiparty.Form()
    form.on('part', async function (part) {
      try {
        const uploadResult = {}
        // Send this part of the multipart request for processing
        await handlePart(logger, part, config, uploadResult)
        resolve(uploadResult)
      } catch (err) {
        reject(err)
      }
    })
    form.on('error', function (err) {
      reject(err)
    })
    form.on('close', async function () {
      // Do nothing as we need to await the upload of the file
    })
    form.parse(request.raw.req)
  })

  if (uploadResult.errorMessage) {
    throw new Error(uploadResult.errorMessage)
  }

  // Do we need to post process the file?

  return uploadResult
}

const uploadFiles = async (logger, request, config) => {
  const events = []
  // Return a promise for processing the multipart request.
  // This code is inspired by https://stackoverflow.com/questions/50522383/promisifying-multiparty
  return new Promise((resolve, reject) => {
    const form = new multiparty.Form()
    const uploadResult = {}
    form.on('part', function (part) {
      try {
        // Send this part of the multipart request for processing
        handlePart(logger, part, config, uploadResult)
        events.push(`Processed ${part.filename}`)
      } catch (err) {
        reject(err)
      }
    })
    form.on('error', function (err) {
      reject(err)
    })
    form.on('close', async function () {
      if (uploadResult.errorMessage) {
        reject(new Error(uploadResult.errorMessage))
      } else {
        try {
          // Resolve the promise when all parts of the upload have been processed.
          const eventData = await config.functionConfig.handleEventsFunction(config, events)
          resolve(Object.assign(uploadResult, eventData))
        } catch (err) {
          reject(err)
        }
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

const handlePart = async (logger, part, config, uploadResult) => {
  const fileSizeInBytes = part.byteCount
  const fileSize = parseFloat(parseFloat(part.byteCount / 1024 / 1024).toFixed(config.fileValidationConfig?.maximumDecimalPlaces || 2))
  const filename = part.filename
  // Delay throwing errors until the form is closed.
  if (!filename) {
    uploadResult.errorMessage = constants.uploadErrors.noFile
    part.resume()
  } else if (config.fileValidationConfig?.fileExt && !config.fileValidationConfig.fileExt.includes(path.extname(filename.toLowerCase()))) {
    uploadResult.errorMessage = constants.uploadErrors.unsupportedFileExt
    part.resume()
  } else if (fileSize * 100 === 0) {
    uploadResult.errorMessage = constants.uploadErrors.emptyFile
    part.resume()
  } else if (fileSizeInBytes > config.fileValidationConfig.maxFileSize) {
    uploadResult.errorMessage = constants.uploadErrors.maximumFileSizeExceeded
    part.resume()
  } else {
    logger.log(`${new Date().toUTCString()} Uploading ${filename}`)
    uploadResult.fileSize = fileSizeInBytes
    if (filename) {
      uploadResult.filename = filename
    }
    if (part.headers['content-type']) {
      uploadResult.fileType = part.headers['content-type']
    }
    const uploadConfig = JSON.parse(JSON.stringify(config))
    config.blobConfig.blobName = `${config.blobConfig.blobName}${filename}`
    const tags = await uploadStreamAndAwaitScan(logger, uploadConfig, part)
    uploadResult.tags = tags
    uploadResult.blobConfig = config.blobConfig

    // React to file scanning result
    if (tags['Malware Scanning scan result'] !== 'No threats found') {
      uploadResult.errorMessage = `Malware scanning result: ${JSON.stringify(tags)}`
    }
  }
}

export { uploadFile, uploadFiles }
