import buildSignalRMessage from '../../Shared/build-signalr-message.js'
import bngMetricService from '@defra/bng-metric-service'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import processMetric from '../../Shared/process-metric.js'

export default async function (context, config) {
  let signalRMessageArguments, metricData
  try {
    const blobConfig = {
      blobName: config.fileConfig.fileLocation,
      containerName: config.containerName
    }
    const response = await blobStorageConnector.downloadStreamIfExists(context, blobConfig)
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

    signalRMessageArguments = [{
      location: config.fileConfig.fileLocation,
      metricData: processMetric(metricData)
    }]
  } catch (err) {
    context.log.error(err)
    signalRMessageArguments = [{ errorCode: err.code }]
  } finally {
    context.bindings.signalRMessages = [buildSignalRMessage(config.signalRMessageConfig, signalRMessageArguments)]
  }
}
