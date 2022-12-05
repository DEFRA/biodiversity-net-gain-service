import path from 'path'

const buildMetricConfigFromMessage = message => {
  const fileLocation = message.location
  const fileDirectory = path.dirname(fileLocation)
  const metricData = message.metricData

  return Object.freeze({
    metricData,
    signalRMessageConfig: {
      userId: fileDirectory.substring(0, fileDirectory.indexOf('/')),
      target: `Processed ${message.blobName}`
    }
  })
}

export default buildMetricConfigFromMessage
