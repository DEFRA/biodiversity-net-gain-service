import buildSignalRMessage from '../../Shared/build-signalr-message.js'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import bngMetricService from '@defra/bng-metric-service'
import { ValidationError } from '@defra/bng-errors-lib'

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

      // Process to extract metric file data using bng-metric-service package
      metricData = await bngMetricService.extractMetricContent(documentStream)
      console.log('DMD==>', metricData)
    } else {
      throw new Error('Unable to retrieve blob')
    }

    signalRMessageArguments = [{
      location: config.fileConfig.fileLocation,
      metricData
    }]
  } catch (err) {
    context.log.error(err)
    if (err instanceof ValidationError) {
      signalRMessageArguments = [{ errorCode: err.code }]
    } else {
      signalRMessageArguments = [{ errorCode: err.message }]
    }
  } finally {
    context.bindings.signalRMessages = [buildSignalRMessage(config.signalRMessageConfig, signalRMessageArguments)]
  }
}
