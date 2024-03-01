import { uploadFile } from '../helpers/server.js'
import { recreateContainers } from '@defra/bng-azure-storage-test-utils'
import { uploadTestConfig } from './upload-config.json.js'
import constants from '../../../utils/constants.js'
const azureStorage = require('../../../utils/azure-storage.js')
jest.mock('../../../utils/azure-storage.js')

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
            expect(res.payload).toContain(constants.uploadErrors.threatDetected)

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
            expect(res.payload).toContain(constants.uploadErrors.malwareScanFailed)

            setImmediate(() => {
              done()
            })
          } catch (err) {
            done(err)
          }
        })
      })

      it(`${config.uploadType} - Should returned Malware failed error if Malware scan returns nothing`, (done) => {
        jest.isolateModules(async () => {
          try {
            azureStorage.uploadStreamAndAwaitScan = jest.fn().mockImplementation(() => {
              return {}
            })

            const res = await uploadFile(config)
            expect(res.payload).toContain('There is a problem')
            expect(res.payload).toContain(constants.uploadErrors.malwareScanFailed)

            setImmediate(() => {
              done()
            })
          } catch (err) {
            done(err)
          }
        })
      })

      it(`${config.uploadType} - Should returned file cannot be uploaded if Malware scan throws an error`, (done) => {
        jest.isolateModules(async () => {
          try {
            azureStorage.uploadStreamAndAwaitScan = jest.fn().mockImplementation(() => {
              throw new Error('unit test error')
            })

            const res = await uploadFile(config)
            expect(res.payload).toContain('There is a problem')
            expect(res.payload).toContain(constants.uploadErrors.uploadFailure)

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
