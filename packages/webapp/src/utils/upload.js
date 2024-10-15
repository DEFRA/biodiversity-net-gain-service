import path from 'path'
import { fileTypeFromStream } from 'file-type'
import { PassThrough } from 'stream'
import { uploadStreamAndAwaitScan, deleteBlobFromContainers } from './azure-storage.js'
import multiparty from 'multiparty'
import constants from './constants.js'
import { postProcess } from './file-post-process.js'
import { fileMalwareCheck } from './file-malware-check.js'
import { isXSSVulnerable } from './html-sanitizer.js'

// The logger object is accessible through the request object
// since the introduction of hapi-pino. Ideally the logger parameter
// is redundant accordingly but the legacy signature remains due to
// failing unit tests associated with file uploads. Refactoring can be
// performed as tech debt.
const uploadFile = async (logger, request, config) => {
  // Use multiparty to get file stream
  const uploadResult = await new Promise((resolve, reject) => {
    const form = new multiparty.Form()
    form.on('part', async function (part) {
      try {
        const uploadResult = {}
        // Send this part of the multipart request for processing
        await handlePart(request.logger, part, config, uploadResult)
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

  // Check tags returned for Malware scanning here
  fileMalwareCheck(uploadResult.tags)

  // Send file for post Processing
  if (uploadResult.config.postProcess) {
    try {
      uploadResult.postProcess = await postProcess(uploadResult.config.uploadType, uploadResult.config.blobConfig.blobName, uploadResult.config.blobConfig.containerName)

      if (uploadResult.postProcess.errorMessage) {
        await deleteBlobFromContainers(uploadResult.config.blobConfig.blobName)
        throw new Error(uploadResult.postProcess.errorMessage)
      }
    } catch (err) {
      logger.error(`${new Date().toUTCString()} File failed post processing: ${uploadResult.config.blobConfig.blobName}`)
      throw err
    }
  }

  return uploadResult
}

const handlePart = async (logger, part, config, uploadResult) => {
  const fileSizeInBytes = part.byteCount
  const fileSize = parseFloat(parseFloat(part.byteCount / 1024 / 1024).toFixed(config.fileValidationConfig?.maximumDecimalPlaces || 2))
  const filename = part.filename

  // In order to detect the file type we create two passthrough streams to "clone" the original stream: one to detect
  // the file type and one to upload the part. This is needed to prevent the file type check from consuming the entire
  // stream immediately.
  const fileTypePart = new PassThrough()
  const uploadPart = new PassThrough()
  part.pipe(fileTypePart)
  part.pipe(uploadPart)
  const detectedFileType = await fileTypeFromStream(fileTypePart)

  // Delay throwing errors until the form is closed.
  if (!filename) {
    uploadResult.errorMessage = constants.uploadErrors.noFile
    part.resume()
  } else if (isXSSVulnerable(filename)) {
    throw new Error(constants.uploadErrors.uploadFailure)
  } else if (config.fileValidationConfig?.fileExt && !config.fileValidationConfig.fileExt.includes(path.extname(filename.toLowerCase()))) {
    uploadResult.errorMessage = constants.uploadErrors.unsupportedFileExt
    part.resume()
  } else if (config.fileValidationConfig?.fileType && !config.fileValidationConfig.fileType.includes(detectedFileType.mime)) {
    uploadResult.errorMessage = constants.uploadErrors.invalidFileType
    part.resume()
  } else if (fileSize * 100 === 0) {
    uploadResult.errorMessage = constants.uploadErrors.emptyFile
    part.resume()
  } else if (fileSizeInBytes > config.fileValidationConfig.maxFileSize) {
    uploadResult.errorMessage = constants.uploadErrors.maximumFileSizeExceeded
    part.resume()
  } else {
    logger.info(`${new Date().toUTCString()} Uploading ${filename}`)
    uploadResult.fileSize = fileSizeInBytes
    uploadResult.filename = filename
    uploadResult.fileType = detectedFileType.mime

    const uploadConfig = JSON.parse(JSON.stringify(config))
    uploadConfig.blobConfig.blobName = `${config.blobConfig.blobName}${filename}`
    const tags = await uploadStreamAndAwaitScan(logger, uploadConfig, uploadPart)
    uploadResult.tags = tags
    uploadResult.config = uploadConfig
  }
}

export { uploadFile }
