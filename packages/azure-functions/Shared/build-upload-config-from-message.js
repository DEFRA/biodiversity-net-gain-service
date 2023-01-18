import path from 'path'

const buildUploadConfigFromMessage = message => {
  const fileLocation = message.location
  const fileExtension = path.extname(fileLocation)
  const fileDirectory = path.dirname(fileLocation)
  const filename = path.basename(fileLocation, fileExtension)

  return Object.freeze({
    containerName: message.containerName,
    fileConfig: {
      fileLocation,
      fileExtension,
      fileDirectory,
      filename
    },
    signalRMessageConfig: {
      userId: fileDirectory.substring(0, fileDirectory.indexOf('/')),
      target: `Processed ${filename}${fileExtension}`
    }
  })
}

export default buildUploadConfigFromMessage
