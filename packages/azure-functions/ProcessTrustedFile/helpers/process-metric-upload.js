import bngMetricService from '@defra/bng-metric-service'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import processMetric from '../../Shared/process-metric.js'

export default async function (context, config) {
  let metricData
  try {
    const response = await blobStorageConnector.downloadStreamIfExists(context, config)
    if (response) {
      const documentStream = response.readableStreamBody
      const metricExtractionConfig = {
        extractionConfiguration: {
          start: bngMetricService.extractionConfiguration.startExtractionConfig,
          ...bngMetricService.extractionConfiguration['v4.1']
        },
        validationConfiguration: bngMetricService.validationConfiguration
      }
      metricData = await bngMetricService.extractMetricContent(documentStream, metricExtractionConfig)
    } else {
      throw new Error('Unable to retrieve blob')
    }

    return {
      metricData: processMetric(metricData)
    }
  } catch (err) {
    context.log.error(err)
    return {
      errorMessage: err.message
    }
  }
}
