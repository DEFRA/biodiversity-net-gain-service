import { blobStorageConnector } from '@defra/bng-connectors-lib'
import { submitGetRequest } from '../helpers/server.js'

const url = '/land/geospatial-land-boundary'

jest.mock('@defra/bng-connectors-lib')

describe(url, () => {
  it('should make a call to retrieve a geospatial land boundary', async () => {
    blobStorageConnector.downloadToBufferIfExists.mockReturnValue(Buffer.from('Mock geospatial land boundary'))
    await submitGetRequest({ url })
    expect(blobStorageConnector.downloadToBufferIfExists).toHaveBeenCalled()
  })
  it('should cause an error when a geospatial boundary does not exist', async () => {
    blobStorageConnector.downloadToBufferIfExists.mockReturnValue(false)
    await submitGetRequest({ url }, 500)
    expect(blobStorageConnector.downloadToBufferIfExists).toHaveBeenCalled()
  })
})
