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
      beforeEach(() => {
        config.redirectExpected = config.uploadType.startsWith('credits')
      })

      it(`${config.uploadType} - Should return Malware detected error if Malware detected`, async () => {
        azureStorage.uploadStreamAndAwaitScan = jest.fn().mockImplementation(() => {
          return {
            'Malware Scanning scan result': 'Malicious',
            'Malware Notes': 'Mocked scan result for Azurite blob storage'
          }
        })

        if (config.redirectExpected) {
          await uploadFile(config)
        } else {
          const res = await uploadFile(config)
          expect(res.payload).toContain('There is a problem')
          expect(res.payload).toContain(constants.uploadErrors.threatDetected)
        }
      })

      it(`${config.uploadType} - Should return Malware failed error if Malware scan returns error`, async () => {
        azureStorage.uploadStreamAndAwaitScan = jest.fn().mockImplementation(() => {
          return {
            'Malware Scanning scan result': 'Scan failed - internal service error.',
            'Malware Notes': 'Mocked scan result for Azurite blob storage'
          }
        })

        if (config.redirectExpected) {
          await uploadFile(config)
        } else {
          const res = await uploadFile(config)
          expect(res.payload).toContain('There is a problem')
          expect(res.payload).toContain(constants.uploadErrors.malwareScanFailed)
        }
      })

      it(`${config.uploadType} - Should return Malware failed error if Malware scan returns nothing`, async () => {
        azureStorage.uploadStreamAndAwaitScan = jest.fn().mockImplementation(() => {
          return {}
        })

        if (config.redirectExpected) {
          await uploadFile(config)
        } else {
          const res = await uploadFile(config)
          expect(res.payload).toContain('There is a problem')
          expect(res.payload).toContain(constants.uploadErrors.malwareScanFailed)
        }
      })

      it(`${config.uploadType} - Should return file cannot be uploaded if Malware scan throws an error`, async () => {
        azureStorage.uploadStreamAndAwaitScan = jest.fn().mockImplementation(() => {
          throw new Error('unit test error')
        })

        if (config.redirectExpected) {
          await uploadFile(config)
        } else {
          const res = await uploadFile(config)
          expect(res.payload).toContain('There is a problem')
          expect(res.payload).toContain(constants.uploadErrors.uploadFailure)
        }
      })
    })
  })
})
