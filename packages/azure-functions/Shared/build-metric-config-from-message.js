import path from 'path'

const buildMetricConfigFromMessage = message => {
  const fileLocation = message.location
  const fileDirectory = path.dirname(fileLocation)
  const fileExtension = path.extname(fileLocation)
  const filename = path.basename(fileLocation, fileExtension)
  return Object.freeze({
    containerName: message.containerName,
    blobName: message.location,
    signalRMessageConfig: {
      userId: fileDirectory.substring(0, fileDirectory.indexOf('/')),
      target: `Processed ${filename}${fileExtension}`
    }
  })
}

export default buildMetricConfigFromMessage
