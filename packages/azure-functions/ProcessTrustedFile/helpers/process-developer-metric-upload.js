import buildSignalRMessage from '../../Shared/build-signalr-message.js'
import bngMetricService from '@defra/bng-metric-service'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import processMetric from '../../Shared/process-metric.js'
import { logger } from 'defra-logging-facade'

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
      const { startExtractionConfig, getExtractionConfigForDeveloper } = bngMetricService.extractionConfiguration
      logger.info(`${new Date().toUTCString()} Config ${JSON.stringify(await getExtractionConfigForDeveloper())}`)
      const metricExtractionConfig = {
        extractionConfiguration: {
          start: startExtractionConfig,
          ...await getExtractionConfigForDeveloper()
        },
        validationConfiguration: bngMetricService.validationConfiguration
      }
      metricData = await bngMetricService.extractMetricContent(documentStream, metricExtractionConfig)
    } else {
      throw new Error('Unable to retrieve blob for developer metric file')
    }

    logger.info(`${new Date().toUTCString()} Metric data ${JSON.stringify(metricData)}`)
    signalRMessageArguments = [{
      location: config.fileConfig.fileLocation,
      metricData: processMetric(metricData)
    }]
  } catch (err) {
    context.log.error(err)
    logger.info(`${new Date().toUTCString()} Error ${err}`)
    signalRMessageArguments = [{ errorCode: err.code }]
  } finally {
    context.bindings.signalRMessages = [buildSignalRMessage(config.signalRMessageConfig, signalRMessageArguments)]
  }
}
