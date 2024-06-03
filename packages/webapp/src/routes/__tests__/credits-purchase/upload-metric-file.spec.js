// // import { submitGetRequest, submitPostRequest, uploadFile } from '../helpers/server.js'
// // import { recreateContainers } from '@defra/bng-azure-storage-test-utils'
// // import * as azureStorage from '../../../utils/azure-storage.js'
// import constants from '../../../utils/constants.js'

// // const UPLOAD_METRIC_FORM_ELEMENT_NAME = 'uploadMetric'
// // const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/metric-file'
// const url = constants.routes.CREDITS_PURCHASE_UPLOAD_METRIC

// // describe('Metric file upload controller tests', () => {
// //   describe('GET', () => {
// //     it(`should render the ${url.substring(1)} view`, async () => {
// //       await submitGetRequest({ url })
// //     })
// //   })

//   describe('POST', () => {
//     // const getBaseConfig = () => ({
//     //   uploadType: constants.uploadTypes.CREDITS_PURCHASE_METRIC_UPLOAD_TYPE,
//     //   url,
//     //   // formName: UPLOAD_METRIC_FORM_ELEMENT_NAME,
//     //   postProcess: {
//     //     metricData: {
//     //       validation: {
//     //         isSupportedVersion: true,
//     //         isOffsiteDataPresent: true,
//     //         areOffsiteTotalsCorrect: true,
//     //         isDraftVersion: false
//     //       }
//     //     }
//     //   },
//     //   sessionData: {}
//     // })

//     // beforeEach(async () => {
//     //   await recreateContainers()
//     // })

//     it('should upload metric file to cloud storage', (done) => {
//       jest.isolateModules(async () => {
//         try {
//           const uploadConfig = getBaseConfig()
//           uploadConfig.hasError = false
//           uploadConfig.filePath = `${mockDataPath}/metric-file-4.1.xlsm`
//           await uploadFile(uploadConfig)
//           setImmediate(() => {
//             done()
//           })
//         } catch (err) {
//           done(err)
//         }
//       })
//     }, 300000)

//     it('should upload feb24 format metric file to cloud storage', (done) => {
//       jest.isolateModules(async () => {
//         try {
//           const uploadConfig = getBaseConfig()
//           uploadConfig.hasError = false
//           uploadConfig.filePath = `${mockDataPath}/metric-file-4.1-feb24.xlsm`
//           await uploadFile(uploadConfig)
//           setImmediate(() => {
//             done()
//           })
//         } catch (err) {
//           done(err)
//         }
//       })
//     }, 300000)

//     it('should cause an internal server error response when upload processing fails', (done) => {
//       jest.isolateModules(async () => {
//         try {
//           const config = getBaseConfig()
//           config.uploadType = null
//           config.filePath = `${mockDataPath}/metric-file.xlsx`
//           config.generateHandleEventsError = true
//           config.hasError = true
//           const response = await uploadFile(config)
//           expect(response.payload).toContain('The selected file could not be uploaded -- try again')
//           setImmediate(() => {
//             done()
//           })
//         } catch (err) {
//           done(err)
//         }
//       })
//     })
