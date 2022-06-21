import { Readable } from 'stream'
import { upload } from '../service.js'

describe('The document service', () => {
  it('should delegate the upload of a document to a configured function', async () => {
    const logger = {
      log: jest.fn()
    }
    const config = {
      functionConfig: {
        uploadFunction: jest.fn()
      }
    }

    const documentStream = Readable.from('mock document')
    await upload(logger, config, documentStream)
    // The upload function should have been called after the upload function has been removed from the configuration.
    expect(config.functionConfig.uploadFunction).toHaveBeenCalledWith(logger, {}, documentStream)
  })
})
