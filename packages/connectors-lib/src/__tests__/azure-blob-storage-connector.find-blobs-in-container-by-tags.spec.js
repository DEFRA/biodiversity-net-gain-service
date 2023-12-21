// At the time of writing, Azurite does not appear to provide support for finding blobs by tags.
// As such, relevant elements of the Azure SDK for JavaScript need to be mocked. This requires
// the blob storage connector to be loaded during a distinct unit test rather than being
// loaded at the start of unit tests using Azurite.
describe('The Azure blob storage connector', () => {
  it('should find blobs in a container by tags', done => {
    jest.isolateModules(async () => {
      try {
        const MOCK_TAG_KEY = 'mock-tag-key'
        const MOCK_TAG_VALUE = 'mock-tag-value'

        const config = {
          containerName: 'mockContainer',
          tags: `"${MOCK_TAG_KEY}" = '${MOCK_TAG_VALUE}'`
        }

        const mockBlobItem = {
          mockKey: 'mock value'
        }

        jest.mock('../helpers/azure-storage.js')
        const { getBlobServiceClient } = require('../helpers/azure-storage.js')
        getBlobServiceClient.mockImplementation(() => {
          return {
            getContainerClient: jest.fn(containerName => {
              return {
                findBlobsByTags: jest.fn(async config => {
                  return [mockBlobItem].values()
                })
              }
            })
          }
        })

        const { blobStorageConnector } = require('../connectors.js')
        const iterator = await blobStorageConnector.findBlobsInContainerByTags(config)
        const blobItem = (await iterator.next()).value
        expect(blobItem).toStrictEqual(mockBlobItem)
        setImmediate(() => {
          done()
        })
      } catch (err) {
        done(err)
      }
    })
  })
})
