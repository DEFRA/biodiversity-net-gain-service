import path from 'path'
import constants from '../../webapp/src/utils/constants.js'

const buildConfigFromMessage = message => {
  const fileLocation = message.location
  const fileExtension = path.extname(fileLocation)
  const fileDirectory = path.dirname(fileLocation)
  const filename = path.basename(fileLocation, fileExtension)

  let _config
  if (message.uploadType === constants.uploadTypes.DEVELOPER_METRIC_EXTRACTION_UPLOAD_TYPE) {
    _config = {
      containerName: message.containerName,
      blobName: message.location
    }
  } else {
    _config = {
      fileConfig: {
        fileLocation,
        fileExtension,
        fileDirectory,
        filename
      }
    }
  }

  return Object.freeze({
    ..._config,
    signalRMessageConfig: {
      userId: fileDirectory.substring(0, fileDirectory.indexOf('/')),
      target: `Processed ${filename}${fileExtension}`
    }
  })
}

export default buildConfigFromMessage
