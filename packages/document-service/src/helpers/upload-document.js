const uploadDocument = async (logger, config, document) => {
  const uploadConfig = createUploadConfiguration(logger, config)
  // Delegate upload processing to the function referenced in the configuration.
  // The configured funcion encapsulates all implementation specific details.
  return config.functionConfig.uploadFunction(logger, uploadConfig, document)
}

const createUploadConfiguration = (logger, config) => {
  // Clone the original configuration.
  const uploadConfig = JSON.parse(JSON.stringify(config))
  // Delete all configuration that does not need to be passed to the configured functions.
  delete uploadConfig.functionConfig
  logger.log('Upload configuration has been created')
  return uploadConfig
}

export default uploadDocument
