import path from 'path'

const buildConfigFromMessage = message => {
  const fileLocation = message.location
  const fileExtension = path.extname(fileLocation)
  const fileDirectory = path.dirname(fileLocation)
  const filename = path.basename(fileLocation, fileExtension)

  const config = {
    fileConfig: {
      fileLocation,
      fileExtension,
      fileDirectory,
      filename
    },
    containerName: message.containerName
  }

  return Object.freeze({
    ...config,
    signalRMessageConfig: {
      userId: fileDirectory.substring(0, fileDirectory.indexOf('/')),
      target: `Processed ${filename}${fileExtension}`
    }
  })
}

export default buildConfigFromMessage
