import { uploadFile } from '../helpers/server.js'
import { recreateContainers } from '@defra/bng-azure-storage-test-utils'
import constants from '../../../utils/constants'

const azureStorage = require('../../../utils/azure-storage.js')
jest.mock('../../../utils/azure-storage.js')

const uploadTestConfig = [
  {
    uploadType: 'land-ownership',
    url: constants.routes.UPLOAD_LAND_OWNERSHIP,
    hasError: true,
    filePath: 'packages/webapp/src/__mock-data__/uploads/legal-agreements/legal-agreement.pdf'
  }, {
    uploadType: 'metric-upload',
    url: constants.routes.UPLOAD_METRIC,
    hasError: true,
    filePath: 'packages/webapp/src/__mock-data__/uploads/metric-file/metric-file-4.0.xlsm'
  }, {
    uploadType: 'management-plan',
    url: constants.routes.UPLOAD_MANAGEMENT_PLAN,
    hasError: true,
    filePath: 'packages/webapp/src/__mock-data__/uploads/legal-agreements/legal-agreement.pdf'
  }, {
    uploadType: 'metric-upload',
    url: constants.routes.UPLOAD_LOCAL_LAND_CHARGE,
    hasError: true,
    filePath: 'packages/webapp/src/__mock-data__/uploads/local-land-charge/local-land-charge.pdf'
  }, {
    uploadType: 'legal-agreement',
    url: constants.routes.UPLOAD_LEGAL_AGREEMENT,
    hasError: true,
    filePath: 'packages/webapp/src/__mock-data__/uploads/legal-agreements/legal-agreement.pdf'
  }, {
    uploadType: 'land-boundary',
    url: constants.routes.UPLOAD_LAND_BOUNDARY,
    hasError: true,
    filePath: 'packages/webapp/src/__mock-data__/uploads/legal-agreements/legal-agreement.pdf'
  }, {
    uploadType: 'geospatial-land-boundary',
    url: constants.routes.UPLOAD_GEOSPATIAL_LAND_BOUNDARY,
    hasError: true,
    filePath: 'packages/webapp/src/__mock-data__/uploads/geospatial-land-boundaries/geopackage-land-boundary-4326.gpkg'
  }, {
    uploadType: 'developer-upload-consent',
    url: constants.routes.DEVELOPER_CONSENT_AGREEMENT_UPLOAD,
    hasError: true,
    filePath: 'packages/webapp/src/__mock-data__/uploads/written-consent/sample.docx'
  }, {
    uploadType: constants.uploadTypes.DEVELOPER_METRIC_UPLOAD_TYPE,
    url: constants.routes.DEVELOPER_UPLOAD_METRIC,
    hasError: true,
    filePath: 'packages/webapp/src/__mock-data__/uploads/metric-file/metric-file-4.0.xlsm'
  }]

describe('Upload controller tests with azure storage mocked', () => {
  describe('POST', () => {
    beforeEach(async () => {
      await recreateContainers()
    })

    uploadTestConfig.forEach((config) => {
      it(`${config.uploadType} - Should returned Malware detected error if Malware detected`, (done) => {
        jest.isolateModules(async () => {
          try {
            azureStorage.uploadStreamAndAwaitScan = jest.fn().mockImplementation(() => {
              return {
                'Malware Scanning scan result': 'Malicious',
                'Malware Notes': 'Mocked scan result for Azurite blob storage'
              }
            })

            const res = await uploadFile(config)
            expect(res.payload).toContain('There is a problem')
            expect(res.payload).toContain('File malware detected')

            setImmediate(() => {
              done()
            })
          } catch (err) {
            done(err)
          }
        })
      })

      it(`${config.uploadType} - Should returned Malware failed error if Malware scan returns error`, (done) => {
        jest.isolateModules(async () => {
          try {
            azureStorage.uploadStreamAndAwaitScan = jest.fn().mockImplementation(() => {
              return {
                'Malware Scanning scan result': 'Scan failed - internal service error.',
                'Malware Notes': 'Mocked scan result for Azurite blob storage'
              }
            })

            const res = await uploadFile(config)
            expect(res.payload).toContain('There is a problem')
            expect(res.payload).toContain('File malware scan failed')

            setImmediate(() => {
              done()
            })
          } catch (err) {
            done(err)
          }
        })
      })

      it('Should returned Malware failed error if Malware scan returns nothing', (done) => {
        jest.isolateModules(async () => {
          try {
            azureStorage.uploadStreamAndAwaitScan = jest.fn().mockImplementation(() => {
              return {}
            })

            const res = await uploadFile(config)
            expect(res.payload).toContain('There is a problem')
            expect(res.payload).toContain('File malware scan failed')

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
})
