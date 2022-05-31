import { createServer, init } from '../../../server.js'
import { getServer } from '../../../../.jest/setup.js'
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
  const expectedResponseCode =
    uploadConfig.generateHandleEventsError || uploadConfig.generateFormDataError || !uploadConfig.filePath
      ? 500
      : 302

  const formData = new FormData()

  if (uploadConfig.filePath) {
    const stream = fs.createReadStream(uploadConfig.filePath)
    fs.readFileSync(uploadConfig.filePath)
    formData.append(uploadConfig.formName, stream, uploadConfig.filePath)
  } else {
    formData.append(uploadConfig.formName, 'non-form data')
  }
  const payload = await streamToPromise(formData)
  const options = {
    url: uploadConfig.url,
    method: 'POST',
    headers: formData.getHeaders(),
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
