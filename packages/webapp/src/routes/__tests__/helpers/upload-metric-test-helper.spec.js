// import { submitGetRequest, submitPostRequest, uploadFile } from '../helpers/server.js'
import { uploadFile } from './server.js'
import { recreateContainers } from '@defra/bng-azure-storage-test-utils'
// import * as azureStorage from '../../../utils/azure-storage.js'
// import constants from '../../../utils/constants.js'

export const UPLOAD_METRIC_FORM_ELEMENT_NAME = 'uploadMetric'
// const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/metric-file'

export const getBaseConfig = (uploadType, url) => ({
  uploadType,
  url,
  formName: UPLOAD_METRIC_FORM_ELEMENT_NAME,
  postProcess: {
    metricData: {
      validation: {
        isSupportedVersion: true,
        isOffsiteDataPresent: true,
        areOffsiteTotalsCorrect: true,
        isDraftVersion: false
      }
    }
  },
  sessionData: {}
})

export const beforeEachSetup = async () => {
  await recreateContainers()
}

export const runCommonUploadTests = (uploadType, url, constants) => {
  describe('POST', () => {
    beforeEach(async () => {
      await beforeEachSetup()
    })

    // it('should upload metric file to cloud storage', (done) => {
    //   jest.isolateModules(async () => {
    //     try {
    //       const uploadConfig = getBaseConfig(uploadType, url)
    //       uploadConfig.hasError = false
    //       uploadConfig.filePath = `${mockDataPath}/metric-file-4.1.xlsm`
    //       await uploadFile(uploadConfig)
    //       setImmediate(() => {
    //         done()
    //       })
    //     } catch (err) {
    //       done(err)
    //     }
    //   })
    // }, 300000)

    // SHOULD NOT UPLOAD NO SELECTED METRIC FILE
    it('should not upload no selected metric', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = getBaseConfig(uploadType, url)
          uploadConfig.hasError = true
          const res = await uploadFile(uploadConfig)
          expect(res.result).toContain('There is a problem')
          expect(res.result).toContain('Select a statutory biodiversity metric')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })
  })
}
