import { createServer, init } from '../../../server.js'
import FormData from 'form-data'
import fs from 'fs'
import streamToPromise from 'stream-to-promise'
import { isUploadComplete } from '@defra/bng-azure-storage-test-utils'

const startServer = async (options) => {
  const server = await createServer(options)
  await init(server)
  return server
}

const uploadFile = async (uploadConfig) => {
  const formData = new FormData()
  const stream = fs.createReadStream(uploadConfig.filePath)
  fs.readFileSync(uploadConfig.filePath)
  formData.append(uploadConfig.formName, stream, uploadConfig.filePath)
  const payload = await streamToPromise(formData)
  const options = {
    url: uploadConfig.url,
    method: 'POST',
    headers: formData.getHeaders(),
    payload
  }
  const { handleEvents } = require('../../../utils/azure-signalr.js')
  handleEvents.mockImplementation(async (config, events) => {
    const uploadComplete = await isUploadComplete('untrusted', `${config.blobConfig.blobName}${events[0].split(' ')[1]}`, 1000)
    if (uploadComplete) {
      return uploadConfig.eventData
    } else {
      throw new Error(`Upload of ${config.filePath} timed out`)
    }
  })
  const response = await submitPostRequest(uploadConfig.server, options, 302)
  return response
}

const submitPostRequest = async (server, options, expectedResponseCode = 200) => {
  const response = await server.inject(options)
  expect(response.statusCode).toBe(expectedResponseCode)
  return response
}

export { startServer, submitPostRequest, uploadFile }
