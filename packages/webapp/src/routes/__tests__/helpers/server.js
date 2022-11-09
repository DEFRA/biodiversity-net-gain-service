import { createServer, init } from '../../../server.js'
import { getServer } from '../../../../.jest/setup.js'
import FormData from 'form-data'
import fs from 'fs'
import streamToPromise from 'stream-to-promise'
import { isUploadComplete, receiveMessages } from '@defra/bng-azure-storage-test-utils'

const startServer = async (options) => {
  const server = await createServer(options)
  await init(server)
  return server
}

const getExpectedErrorCode = (uploadConfig) => {
  if (uploadConfig.hasError !== undefined && uploadConfig.hasError) {
    return 200
  }
  if (uploadConfig.hasError !== undefined && !uploadConfig.hasError) {
    return 302
  } else if (uploadConfig.generateHandleEventsError || uploadConfig.generateFormDataError || !uploadConfig.filePath) {
    return 500
  }
  return 302
}

const uploadFile = async (uploadConfig) => {
  const expectedResponseCode = getExpectedErrorCode(uploadConfig)

  const formData = new FormData()

  if (uploadConfig.filePath) {
    const stream = fs.createReadStream(uploadConfig.filePath)
    fs.readFileSync(uploadConfig.filePath)
    formData.append(uploadConfig.formName, stream, uploadConfig.filePath)
  } else {
    formData.append(uploadConfig.formName, 'non-form data')
  }
  const requestHeaders = formData.getHeaders()
  if (uploadConfig.headers !== undefined) {
    Object.keys(uploadConfig.headers).forEach(header => {
      requestHeaders[header] = uploadConfig.headers[header]
    })
  }
  const payload = await streamToPromise(formData)
  const options = {
    url: uploadConfig.url,
    method: 'POST',
    headers: requestHeaders,
    payload
  }

  if (uploadConfig.generateFormDataError) {
    delete options.headers
  }

  const { handleEvents } = require('../../../utils/azure-signalr.js')

  handleEvents.mockImplementation(async (config, events) => {
    const blobName = `${config.blobConfig.blobName}${events[0].split(' ')[1]}`
    const uploadComplete = await isUploadComplete('untrusted', blobName, 1000)

    if (uploadConfig.generateHandleEventsError || !uploadComplete) {
      throw new Error(`Upload of ${config.filePath} ${uploadConfig.generateHandleEventsError ? 'failed' : 'timed out'}`)
    } else {
      // Check that a message corresponding to the uploaded blob has been queued.
      // This has to be checked in this mock implementation because the web application session ID is generated dynamically.
      const expectedMessage = {
        uploadType: uploadConfig.uploadType,
        location: blobName
      }

      const response = await receiveMessages('untrusted-file-queue')
      const receivedMessageItems = response.receivedMessageItems
      expect(receivedMessageItems.length).toBe(1)
      const message = receivedMessageItems[0]
      const jsonMessage = JSON.parse(Buffer.from(message.messageText, 'base64').toString())
      await expect(jsonMessage).toStrictEqual(expectedMessage)
      return uploadConfig.eventData
    }
  })
  const response = await submitRequest(options, expectedResponseCode)
  return response
}

const submitGetRequest = async (options, expectedResponseCode = 200) => {
  options.method = 'GET'
  return submitRequest(options, expectedResponseCode)
}

const submitPostRequest = async (options, expectedResponseCode = 302) => {
  options.method = 'POST'
  return submitRequest(options, expectedResponseCode)
}

const submitRequest = async (options, expectedResponseCode) => {
  const response = await getServer().inject(options)
  expect(response.statusCode).toBe(expectedResponseCode)
  return response
}

export { startServer, submitGetRequest, submitPostRequest, uploadFile }
