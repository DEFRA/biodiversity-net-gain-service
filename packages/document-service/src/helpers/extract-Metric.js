const extractMetric = async (logger, config) => {
  const extractionConfig = createExtractionConfiguration(logger, config)
  // Delegate upload processing to the function referenced in the configuration.
  // The configured funcion encapsulates all implementation specific details.
  return config.functionConfig.extractMetricFunction(logger, extractionConfig)
}

const createExtractionConfiguration = (logger, config) => {
  // Clone the original configuration.
  const extractionConfig = JSON.parse(JSON.stringify(config))
  // Delete all configuration that does not need to be passed to the configured functions.
  delete extractionConfig.functionConfig
  logger.log(`${new Date().toUTCString()} Metric extraction configuration has been created`)
  return extractionConfig
}

export default extractMetric
