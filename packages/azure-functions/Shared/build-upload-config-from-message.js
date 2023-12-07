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
    }
  })
}

export default buildUploadConfigFromMessage
