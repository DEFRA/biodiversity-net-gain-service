// // import { submitGetRequest, submitPostRequest, uploadFile } from '../helpers/server.js'
// // import { recreateContainers } from '@defra/bng-azure-storage-test-utils'
// // import * as azureStorage from '../../../utils/azure-storage.js'
// import constants from '../../../utils/constants'

// // const UPLOAD_METRIC_FORM_ELEMENT_NAME = 'uploadMetric'
// // const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/metric-file'
// const url = constants.routes.UPLOAD_METRIC

// describe('Metric file upload controller tests', () => {
//   describe('GET', () => {
//     it(`should render the ${url.substring(1)} view`, async () => {
//       await submitGetRequest({ url })
//     })
//   })

//   describe('POST', () => {
//     // const getBaseConfig = () => ({
//     //   uploadType: 'metric-upload',
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
//           const spy = jest.spyOn(azureStorage, 'deleteBlobFromContainers')
//           const uploadConfig = getBaseConfig()
//           uploadConfig.hasError = false
//           uploadConfig.filePath = `${mockDataPath}/metric-file-4.1.xlsm`
//           uploadConfig.headers = {
//             referer: 'http://localhost:30000/land/register-land-task-list'
//           }
//           await uploadFile(uploadConfig)
//           expect(spy).toHaveBeenCalledTimes(1)
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
//           const spy = jest.spyOn(azureStorage, 'deleteBlobFromContainers')
//           const uploadConfig = getBaseConfig()
//           uploadConfig.hasError = false
//           uploadConfig.filePath = `${mockDataPath}/metric-file-4.1-feb24.xlsm`
//           uploadConfig.headers = {
//             referer: 'http://localhost:30000/land/register-land-task-list'
//           }
//           await uploadFile(uploadConfig)
//           expect(spy).toHaveBeenCalledTimes(1)
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
//           config.filePath = `${mockDataPath}/metric-file.xlsx`
//           config.generateHandleEventsError = true
//           config.hasError = true
//           await uploadFile(config)
//           setImmediate(() => {
//             done()
//           })
//         } catch (err) {
//           done(err)
//         }
//       })
//     })

//     it('should return error if valid spreadsheet is not a valid metric', (done) => {
//       jest.isolateModules(async () => {
//         try {
//           jest.mock('../../../utils/azure-storage.js')
//           const spy = jest.spyOn(azureStorage, 'deleteBlobFromContainers')
//           const config = getBaseConfig()
//           config.filePath = `${mockDataPath}/not-metric-file.xlsx`
//           config.hasError = true
//           config.postProcess.errorMessage = constants.uploadErrors.notValidMetric
//           const response = await uploadFile(config)
//           expect(response.result).toContain('The selected file is not a valid Metric')
//           expect(spy).toHaveBeenCalledTimes(1)
//           setImmediate(() => {
//             done()
//           })
//         } catch (err) {
//           done(err)
//         }
//       })
//     })

//     it('should return validation error message if not v4 metric', (done) => {
//       jest.isolateModules(async () => {
//         try {
//           jest.mock('../../../utils/azure-storage.js')
//           const spy = jest.spyOn(azureStorage, 'deleteBlobFromContainers')
//           const config = getBaseConfig()
//           config.filePath = `${mockDataPath}/metric-file.xlsx`
//           config.hasError = true
//           config.postProcess.metricData.validation = {
//             isSupportedVersion: false,
//             isOffsiteDataPresent: false,
//             areOffsiteTotalsCorrect: false
//           }
//           const response = await uploadFile(config)
//           expect(response.result).toContain('The selected file must use the statutory biodiversity metric')
//           expect(spy).toHaveBeenCalledTimes(2)
//           setImmediate(() => {
//             done()
//           })
//         } catch (err) {
//           done(err)
//         }
//       })
//     })
