import buildSignalRMessage from '../../Shared/build-signalr-message.js'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import { Readable } from 'stream'
import bngMetricService from '@defra/bng-metric-service'
import { MetricExtractionError, uploadGeospatialLandBoundaryErrorCodes } from '@defra/bng-errors-lib'

export default async function (context, config) {
  let signalRMessageArguments, metricData
  try {
    const blobConfig = {
      blobName: config.fileConfig.fileLocation,
      containerName: config.containerName
    }
    const buffer = await blobStorageConnector.downloadToBufferIfExists(context, blobConfig)
    if (buffer) {
      const readableStream = Readable.from(buffer)
      const extractionConfiguration = {
        startPage: bngMetricService.extractionConfiguration.startExtractionConfig,
        siteHabitatBaseline: bngMetricService.extractionConfiguration.habitatBaselineExtractionConfig
      }
      metricData = await bngMetricService.extractMetricContent(readableStream, { extractionConfiguration })
    } else {
      throw new MetricExtractionError(uploadGeospatialLandBoundaryErrorCodes.BUFFER_NOT_EXISTS, 'Blob not exists')
    }
    signalRMessageArguments = [{
      location: config.fileConfig.fileLocation,
      metricData
    }]
  } catch (err) {
    signalRMessageArguments = [{ errorCode: err.code }]
  } finally {
    context.bindings.signalRMessages = [buildSignalRMessage(config.signalRMessageConfig, signalRMessageArguments)]
  }
}
