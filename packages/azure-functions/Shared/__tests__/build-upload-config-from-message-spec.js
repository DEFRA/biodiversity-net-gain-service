import buildUploadConfigFromMessage from '../build-upload-config-from-message.js'

const userId = 'mockUserId'
const uploadType = 'mockUploadType'
const filename = 'mockFilename'
const fileExtension = '.txt'

const message = {
  uploadType,
  location: `${userId}/${uploadType}/${filename}${fileExtension}`
}

describe('Building config from a message', () => {
  it('should convert a message to configuration', async () => {
    const expectedConfig = {
      containerName: message.containerName,
      fileConfig: {
        fileLocation: message.location,
        fileExtension,
        fileDirectory: message.location.substring(0, message.location.lastIndexOf('/')),
        filename
      },
      signalRMessageConfig: {
        userId,
        target: `Processed ${filename}${fileExtension}`
      }
    }
    const config = buildUploadConfigFromMessage(message)
    expect(config).toStrictEqual(expectedConfig)
  })
})
