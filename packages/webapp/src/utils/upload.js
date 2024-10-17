import path from 'path'
import { fileTypeFromBuffer } from 'file-type'
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
  const fileSizeInBytes = part.byteCount || 0
  const filename = part.filename

  if (!filename) {
    uploadResult.errorMessage = constants.uploadErrors.noFile
    part.resume()
    return
  }

  if (isXSSVulnerable(filename)) {
    uploadResult.errorMessage = constants.uploadErrors.uploadFailure
    part.resume()
    return
  }

  if (fileSizeInBytes === 0) {
    uploadResult.errorMessage = constants.uploadErrors.emptyFile
    part.resume()
    return
  }

  // Capture the initial chunk of the stream for file type detection purposes while it continues to upload
  const chunks = []
  let initialChunk

  // Asynchronously collect the initial chunk while allowing the stream to flow
  const chunkPromise = new Promise((resolve, reject) => {
    part.on('data', (chunk) => {
      // Only the first chunk is collected as this should be enough for file type detection
      if (chunks.length === 0) {
        chunks.push(chunk)
        resolve(Buffer.concat(chunks))
      }
    })

    part.on('error', reject)
    part.on('end', () => {
      // Handle edge case where no data is present
      if (chunks.length === 0) {
        resolve(Buffer.concat(chunks))
      }
    })
  })

  try {
    // Start file upload stream while we process the first chunk
    const uploadConfig = JSON.parse(JSON.stringify(config))
    uploadConfig.blobConfig.blobName = `${config.blobConfig.blobName}${filename}`

    // Upload stream happens while chunk is processed
    const uploadPromise = uploadStreamAndAwaitScan(logger, uploadConfig, part)

    // Await chunk processing to detect file type
    initialChunk = await chunkPromise

    const fileExtension = path.extname(filename.toLowerCase())

    const validFileExtension = config.fileValidationConfig?.fileExt && config.fileValidationConfig.fileExt.includes(fileExtension)
    if (!validFileExtension) {
      uploadResult.errorMessage = constants.uploadErrors.unsupportedFileExt
      part.resume()
      return
    }

    // TODO: Account for the fact that we've found a .doc file can be detected as .cfb
    const detectedFileType = await fileTypeFromBuffer(initialChunk)
    const validFileType = config.checkFileType && config.fileValidationConfig?.fileType && `.${detectedFileType?.ext}` === fileExtension
    if (!detectedFileType || !validFileType) {
      uploadResult.errorMessage = `${constants.uploadErrors.invalidFileType}: ${detectedFileType.ext || 'No file type detected'}`
      part.resume()
      return
    }

    // Ensure file continues to be uploaded
    const tags = await uploadPromise
    uploadResult.tags = tags
    uploadResult.config = uploadConfig
    uploadResult.fileSize = fileSizeInBytes
    uploadResult.filename = filename
    uploadResult.fileType = detectedFileType.mime
  } catch (err) {
    logger.error(`Upload failed for ${filename}: ${err.message}`)
    uploadResult.errorMessage = constants.uploadErrors.uploadFailure
  }
}

export { uploadFile }
