import path from 'path'
import { uploadStreamAndAwaitScan } from './azure-storage.js'
import multiparty from 'multiparty'
import constants from './constants.js'
import { postProcess } from './file-post-process.js'

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

  // Send file for post Processing
  if (uploadResult.config.postProcess) {
    try {
      uploadResult.postProcess = await postProcess(uploadResult.config.uploadType, uploadResult.config.blobConfig.blobName, uploadResult.config.blobConfig.containerName)
    } catch (err) {
      logger.log(`${new Date().toUTCString()} File failed post processing: ${uploadResult.config.blobConfig.blobName}`)
      throw err
    }
  }

  return uploadResult
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
    uploadConfig.blobConfig.blobName = `${config.blobConfig.blobName}${filename}`
    const tags = await uploadStreamAndAwaitScan(logger, uploadConfig, part)
    uploadResult.tags = tags
    uploadResult.config = uploadConfig

    // React to file scanning result
    if (tags['Malware Scanning scan result'] !== 'No threats found') {
      uploadResult.errorMessage = `Malware scanning result: ${JSON.stringify(tags)}`
    }
  }
}

export { uploadFile }
