import constants from '../utils/constants.js'

const buildConfig = inputConfig => {
  const config = JSON.parse(JSON.stringify(inputConfig))
  buildBlobConfig(inputConfig.sessionId, config)
  buildFileValidationConfig(config)
  return config
}

const buildBlobConfig = (sessionId, config) => {
  config.blobConfig = {
    blobName: `${sessionId}/${config.uploadType}/`,
    containerName: 'customer-uploads'
  }
}

const buildFileValidationConfig = config => {
  config.fileValidationConfig = {
    fileExt: config.fileExt,
    maxFileSize: config.maxFileSize,
    fileType: config.fileExt.map(ext => constants.FILE_TYPES[ext]),
    checkFileType: config.checkFileType ?? false
  }
}

export { buildConfig }
