import buildSignalRMessage from '../../Shared/build-signalr-message.js'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import bngMetricService from '@defra/bng-metric-service'

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
      const extractionConfiguration = {
        startPage: bngMetricService.extractionConfiguration.startExtractionConfig,
        siteHabitatBaseline: bngMetricService.extractionConfiguration.habitatBaselineExtractionConfig
      }
      metricData = await bngMetricService.extractMetricContent(documentStream, { extractionConfiguration })
    } else {
      throw new Error('Unable to retrieve blob')
    }

    signalRMessageArguments = [{
      location: config.fileConfig.fileLocation,
      metricData
    }]
  } catch (err) {
    context.log.error(err)
    signalRMessageArguments = [{ errorCode: err.code }]
  } finally {
    context.bindings.signalRMessages = [buildSignalRMessage(config.signalRMessageConfig, signalRMessageArguments)]
  }
}
