import { getContext, getTimer } from '../../.jest/setup.js'

jest.mock('@defra/bng-connectors-lib')

describe('ProcessMaliciousUploads', () => {
  const containerNameKey = 'container-name'

  const mockBlobItem = {
    name: 'mock-blob',
    [containerNameKey]: 'mock-container',
    tags: { 'Malware Scanning scan result': 'Malicious' },
    tagValue: 'Malicious'
  }

  it('Should process all malicious uploads when no processing pause is required', done => {
    jest.isolateModules(async () => {
      try {
        // Ensure module level variables are reset in each test.
        const processMaliciousUploads = require('../index.mjs').default
        const mockBlobItems = new Array(5)
        mockBlobItems.fill(mockBlobItem)
        const { blobStorageConnector } = require('@defra/bng-connectors-lib')
        blobStorageConnector.findBlobsInContainerByTags.mockImplementation(() => mockBlobItems.values())
        const spy = jest.spyOn(blobStorageConnector, 'deleteBlobIfExists')
        await processMaliciousUploads(getContext(), getTimer())
        expect(spy).toHaveBeenCalledTimes(5)
        done()
      } catch (err) {
        done(err)
      }
    })
  })

  it('Should pause when processing a large number of malicious uploads ', done => {
    jest.isolateModules(async () => {
      try {
        // Ensure module level variables are reset in each test.
        const processMaliciousUploads = require('../index.mjs').default
        process.env.MALICIOUS_UPLOAD_PROCESSING_TIMEOUT_MILLIS = '2000'
        const mockBlobItems = new Array(5)
        mockBlobItems.fill(mockBlobItem)
        const { blobStorageConnector } = require('@defra/bng-connectors-lib')
        const deleteBlobIfExists = jest.fn(() => new Promise(resolve => setTimeout(resolve, 1000)))
        blobStorageConnector.findBlobsInContainerByTags.mockImplementation(() => mockBlobItems.values())
        blobStorageConnector.deleteBlobIfExists.mockImplementation(deleteBlobIfExists)
        await processMaliciousUploads(getContext(), getTimer())
        // The number of times deleteBlobIfExists is called before processing is paused can fluctuate but
        // the function should be called at least once.
        expect(deleteBlobIfExists).toHaveBeenCalled()
        // Call the function again to use the cached processing pause value and increae test coverage.
        await processMaliciousUploads(getContext(), getTimer())
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('Should process malicious uploads with a default processing timeour when an invalid processing timeout is configured', done => {
    jest.isolateModules(async () => {
      try {
        // Ensure module level variables are reset in each test.
        const processMaliciousUploads = require('../index.mjs').default
        // Absolute values are configured to guard against negative values being specified using environment variables.
        process.env.MALICIOUS_UPLOAD_PROCESSING_TIMEOUT_MILLIS = 'mock'
        process.env.MALICIOUS_UPLOAD_PROCESSING_PAUSE_MILLIS = '-100'
        // Use a custom pause between the processing of each malicious upload to increase test coverage.
        const mockBlobItems = new Array(5)
        mockBlobItems.fill(mockBlobItem)
        const { blobStorageConnector } = require('@defra/bng-connectors-lib')
        blobStorageConnector.findBlobsInContainerByTags.mockImplementation(() => mockBlobItems.values())
        const spy = jest.spyOn(blobStorageConnector, 'deleteBlobIfExists')
        await processMaliciousUploads(getContext(), getTimer())
        expect(spy).toHaveBeenCalledTimes(5)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('Should process malicious uploads with a default pause between each upload when an invalid pause is configured', done => {
    jest.isolateModules(async () => {
      try {
        // Ensure module level variables are reset in each test.
        const processMaliciousUploads = require('../index.mjs').default
        process.env.MALICIOUS_UPLOAD_PROCESSING_PAUSE_MILLIS = 'mock'
        const mockBlobItems = new Array(5)
        mockBlobItems.fill(mockBlobItem)
        const { blobStorageConnector } = require('@defra/bng-connectors-lib')
        blobStorageConnector.findBlobsInContainerByTags.mockImplementation(() => mockBlobItems.values())
        const spy = jest.spyOn(blobStorageConnector, 'deleteBlobIfExists')
        await processMaliciousUploads(getContext(), getTimer())
        expect(spy).toHaveBeenCalledTimes(5)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('Should process malicious uploads with default configuration when an error occurs during environment variable processing', done => {
    jest.isolateModules(async () => {
      try {
        // Ensure module level variables are reset in each test.
        const processMaliciousUploads = require('../index.mjs').default
        process.env.MALICIOUS_UPLOAD_PROCESSING_PAUSE_MILLIS = '5000'
        const mockBlobItems = new Array(5)
        mockBlobItems.fill(mockBlobItem)
        const { blobStorageConnector } = require('@defra/bng-connectors-lib')
        blobStorageConnector.findBlobsInContainerByTags.mockImplementation(() => mockBlobItems.values())
        const deleteBlobIfExistsSpy = jest.spyOn(blobStorageConnector, 'deleteBlobIfExists')
        const errorSpy = jest.spyOn(global.Math, 'abs').mockImplementation(() => { throw new Error('mock error') })
        await processMaliciousUploads(getContext(), getTimer())
        expect(deleteBlobIfExistsSpy).toHaveBeenCalledTimes(5)
        expect(errorSpy).toHaveBeenCalledTimes(1)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
})
