import bngMetricService from '@defra/bng-metric-service'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import processMetric from '../../Shared/process-metric.js'

export default async (context, config) => {
  const { extractionConfiguration, validationConfiguration, extractMetricContent } = bngMetricService
  let metricData
  try {
    const response = await blobStorageConnector.downloadStreamIfExists(context, config)
    if (response) {
      const streamData = response.readableStreamBody
      const metricExtractionConfig = {
        extractionConfiguration: {
          start: extractionConfiguration.startExtractionConfig,
          ...extractionConfiguration['v4.1']
        },
        validationConfiguration
      }
      metricData = await extractMetricContent(streamData, metricExtractionConfig)
    } else {
      throw new Error('Unable to retrieve blob for credits metric file')
    }
    return {
      metricData: processMetric(metricData)
    }
  } catch (err) {
    context.log.error(err)
    throw err
  }
}