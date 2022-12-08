import { blobStorageConnector } from '@defra/bng-connectors-lib'
import { Readable } from 'stream'
import buildSignalRMessage from '../../Shared/build-signalr-message.js'
import BngExtractionService from '@defra/bng-metric-service/src/BngMetricExtractionService.js'
import { MetricExtractionError, uploadGeospatialLandBoundaryErrorCodes } from '@defra/bng-errors-lib'

export default async function (context, config) {
  let signalRMessageArguments
  try {
    const blobConfig = {
      blobName: config.blobName,
      containerName: config.containerName
    }
    const buffer = await blobStorageConnector.downloadToBufferIfExists(context, blobConfig)
    if (buffer) {
      const readableStream = Readable.from(buffer)
      const extractService = new BngExtractionService()
      const metricData = await extractService.extractMetricContent(readableStream)
      signalRMessageArguments = [{
        location: config.blobName,
        metricData
      }]
    } else {
      context.log(`${new Date().toUTCString()} Blob not exists  ${config.blobName}`)
      throw new MetricExtractionError(uploadGeospatialLandBoundaryErrorCodes.BUFFER_NOT_EXISTS, 'Blob not exists')
    }
  } catch (err) {
    if (err instanceof MetricExtractionError) {
      signalRMessageArguments = [{ errorCode: err.code }]
    } else {
      signalRMessageArguments = [{ errorMessage: err.message }]
    }
  } finally {
    context.bindings.signalRMessages = [buildSignalRMessage(config.signalRMessageConfig, signalRMessageArguments)]
  }
}
