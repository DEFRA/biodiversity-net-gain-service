import { extractMetric } from '@defra/bng-document-service'

const extractMetricData = async (logger, request, config) => {
  return new Promise((resolve, reject) => {
    try {
      const extractionResult = {}
      const events = [`Processed ${config.blobConfig.blobName}`]
      createExtractionConfiguration(config)
      extractMetric(logger, config)
      const eventData = config.functionConfig.handleEventsFunction(config, events)
      resolve(Object.assign(extractionResult, eventData))
    } catch (err) {
      reject(err)
    }
  })
}

const createExtractionConfiguration = config => {
  const _config = JSON.parse(JSON.stringify(config))
  _config.functionConfig.extractMetricData = config.functionConfig.extractMetricData
  return _config
}

export { extractMetricData }
