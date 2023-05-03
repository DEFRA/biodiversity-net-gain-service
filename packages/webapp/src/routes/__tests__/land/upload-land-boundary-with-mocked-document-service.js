import { uploadFile } from '../helpers/server.js'
import { clearQueues, recreateContainers, recreateQueues } from '@defra/bng-azure-storage-test-utils'
import constants from '../../../utils/constants.js'
const LAND_BOUNDARY_FORM_ELEMENT_NAME = 'landBoundary'
const url = constants.routes.UPLOAD_LAND_BOUNDARY

const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/legal-agreements'
jest.mock('../../../utils/azure-signalr.js')
jest.mock('@defra/bng-document-service')

describe('Land boundary upload additional error tests', () => {
  beforeAll(async () => {
    await recreateQueues()
  })
  beforeEach(async () => {
    await recreateQueues()
  })

  describe('POST', () => {
    const mockLegalAgreement = [
      {
        location: 'mockUserId/mockUploadType/mockFilename',
        mapConfig: {}
      }
    ]
    const baseConfig = {
      uploadType: 'land-boundary',
      url,
      formName: LAND_BOUNDARY_FORM_ELEMENT_NAME,
      eventData: mockLegalAgreement
    }

    beforeEach(async () => {
      await recreateContainers()
      await clearQueues()
    })


    it('should handle when upload processing fails due to a document service error', (done) => {
      jest.isolateModules(async () => {
        try {
          const { uploadDocument } = require('@defra/bng-document-service')
          uploadDocument.mockImplementation(() => {
            throw new Error('Upload error')
          })
          const config = Object.assign({}, baseConfig)
          config.filePath = `${mockDataPath}/legal-agreement.pdf`
          config.hasError = true
          await uploadFile(config)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
