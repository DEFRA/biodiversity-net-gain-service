import buildSignalRMessage from '../../Shared/build-signalr-message.js'

export default async function (context, config) {
  let signalRMessageArguments
  try {
    // const extractService = new BngExtractionService()
    // const buffer = await blobStorageConnector.downloadToBufferIfExists(context, config)
    // const readableStream = Readable.from(buffer)
    // const metricData = await extractService.extractMetricContent(readableStream)
    signalRMessageArguments = [{
      location: config.fileConfig.fileLocation,
      metricData: config.fileConfig.metricData
    }]
  } catch (error) {

  }
  context.bindings.signalRMessages = [buildSignalRMessage(config.signalRMessageConfig, signalRMessageArguments)]
}
