import { extractMetric } from '@defra/bng-document-service'

const extractMetricData = async (logger, config) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const events = [`Processed ${config.blobConfig.fileName}`]
        createExtractionConfiguration(config)
        extractMetric(logger, config)
        const eventData = await config.functionConfig.handleEventsFunction(config, events)
        resolve(eventData)
      } catch (err) {
        reject(err)
      }
    })()
  })
}

const createExtractionConfiguration = config => {
  const _config = JSON.parse(JSON.stringify(config))
  _config.functionConfig.extractMetricData = config.functionConfig.extractMetricData
  return _config
}

export { extractMetricData }
