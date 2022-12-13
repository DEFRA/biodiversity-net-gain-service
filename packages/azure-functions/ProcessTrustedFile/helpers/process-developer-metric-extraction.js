import { blobStorageConnector } from '@defra/bng-connectors-lib'
import { Readable } from 'stream'
import buildSignalRMessage from '../../Shared/build-signalr-message.js'
import bngMetricService from '@defra/bng-metric-service'
import { MetricExtractionError, uploadGeospatialLandBoundaryErrorCodes } from '@defra/bng-errors-lib'

export default async function (context, config) {
  let signalRMessageArguments, metricData
  try {
    const blobConfig = {
      blobName: config.blobName,
      containerName: config.containerName
    }
    const buffer = await blobStorageConnector.downloadToBufferIfExists(context, blobConfig)
    if (buffer) {
      const readableStream = Readable.from(buffer)
      metricData = await bngMetricService.extractMetricContent(readableStream)
    } else {
      throw new MetricExtractionError(uploadGeospatialLandBoundaryErrorCodes.BUFFER_NOT_EXISTS, 'Blob not exists')
    }
    signalRMessageArguments = [{
      location: config.blobName,
      metricData
    }]
  } catch (err) {
    signalRMessageArguments = [{ errorCode: err.code }]
  } finally {
    context.bindings.signalRMessages = [buildSignalRMessage(config.signalRMessageConfig, signalRMessageArguments)]
  }
}
