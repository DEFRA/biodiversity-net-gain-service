import processTrustedFile from '../index.mjs'
import { getContext } from '../../.jest/setup.js'

describe('Trusted file processing', () => {
  it('should load and call a function that can process a particular upload type. ', done => {
    jest.isolateModules(async () => {
      try {
        jest.mock('../helpers/process-geospatial-land-boundary.js')

        const message = {
          uploadType: 'geospatial-land-boundary',
          location: 'mock-user-id/landBoundary/mock-data.json'
        }

        const processGeospatialLandBoundary = (await import('../helpers/process-geospatial-land-boundary.js')).default
        processGeospatialLandBoundary.mockImplementation((context, fileLocation) => {})
        await processTrustedFile(getContext(), message)

        setImmediate(async () => {
          await expect(processGeospatialLandBoundary).toHaveBeenCalled()
          done()
        })
      } catch (e) {
        done(e)
      }
    })
  })

  it('should not process an unsupported file type.', done => {
    jest.isolateModules(async () => {
      try {
        const filename = 'mock-data.json'
        const userId = 'mockUserId'
        const uploadType = 'unknown-upload-type'
        const expectedSignalRMessage = {
          userId,
          target: `Processed ${filename}`,
          arguments: {
            code: 'UNKNOWN-UPLOAD-TYPE',
            uploadType
          }
        }
        const message = {
          uploadType,
          location: `${userId}/mockUploadType/${filename}`
        }
        await processTrustedFile(getContext(), message)

        setImmediate(async () => {
          await expect(getContext().bindings.signalRMessages).toStrictEqual([expectedSignalRMessage])
          done()
        })
      } catch (e) {
        done(e)
      }
    })
  })
})
