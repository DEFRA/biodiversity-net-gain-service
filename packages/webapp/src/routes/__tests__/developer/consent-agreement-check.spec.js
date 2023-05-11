import constants from '../../../utils/constants.js'
import { submitPostRequest } from '../helpers/server.js'

const url = '/developer/check-consent-file'
const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/written-consent'
const mockFileLocation = `${mockDataPath}/sample.docx`

describe(url, () => {
  describe('GET', () => {
    let viewResult, contextResult
    const redisMap = new Map()
    it(`should render the ${url.substring(1)} view`, async () => {
      const checkConsentFile = require('../../developer/consent-agreement-check.js')
      redisMap.set(constants.redisKeys.DEVELOPER_CONSENT_FILE_LOCATION, mockFileLocation)
      const request = {
        yar: redisMap
      }
      const h = {
        view: (view, context) => {
          viewResult = view
          contextResult = context
        }
      }
      await checkConsentFile.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.views.DEVELOPER_AGREEMENT_CHECK)
      expect(contextResult.filename).toEqual('sample.docx')
    })
  })

  describe('POST', () => {
    jest.mock('@defra/bng-connectors-lib')
    let redisMap, postOptions
    beforeEach(() => {
      redisMap = new Map()
      postOptions = {
        url,
        payload: {}
      }
    })

    it('should allow an alternative consent file to be uploaded', (done) => {
      jest.isolateModules(async () => {
        try {
          let viewResult
          const checkConsentFile = require('../../developer/consent-agreement-check.js')
          redisMap.set(constants.redisKeys.DEVELOPER_CONSENT_FILE_LOCATION, mockFileLocation)
          postOptions.payload.checkUploadConsent = constants.CHECK_UPLOAD_METRIC_OPTIONS.NO
          const request = {
            yar: redisMap,
            payload: {
              checkUploadConsent: constants.CHECK_UPLOAD_METRIC_OPTIONS.NO
            }
          }
          const h = {
            redirect: (view) => {
              viewResult = view
            },
            view: (view) => {
              viewResult = view
            }
          }
          const { blobStorageConnector } = require('@defra/bng-connectors-lib')
          const spy = jest.spyOn(blobStorageConnector, 'deleteBlobIfExists')
          await checkConsentFile.default[1].handler(request, h)
          expect(viewResult).toEqual(constants.routes.DEVELOPER_CONSENT_AGREEMENT_UPLOAD)
          expect(spy).toHaveBeenCalledWith({
            containerName: 'untrusted',
            blobName: mockFileLocation
          })
          expect(spy).toHaveBeenCalledTimes(2)
          done()
        } catch (err) {
          done(err)
        }
      })
    })

    it('should allow an consent agreement file to be uploaded ', (done) => {
      jest.isolateModules(async () => {
        try {
          let viewResult
          const checkConsentFile = require('../../developer/consent-agreement-check.js')
          redisMap.set(constants.redisKeys.DEVELOPER_CONSENT_FILE_LOCATION, mockFileLocation)
          postOptions.payload.checkUploadConsent = constants.CHECK_UPLOAD_METRIC_OPTIONS.YES
          const request = {
            yar: redisMap,
            payload: {
              checkUploadConsent: constants.CHECK_UPLOAD_METRIC_OPTIONS.YES
            }
          }
          const h = {
            redirect: (view) => {
              viewResult = view
            },
            view: (view) => {
              viewResult = view
            }
          }
          await checkConsentFile.default[1].handler(request, h)
          expect(viewResult).toEqual(constants.routes.DEVELOPER_TASKLIST)
          done()
        } catch (err) {
          done(err)
        }
      })
    })

    it('should allow an alternative consent file to be uploaded on no option selected', (done) => {
      jest.isolateModules(async () => {
        try {
          let viewResult
          const checkConsentFile = require('../../developer/consent-agreement-check.js')
          redisMap.set(constants.redisKeys.DEVELOPER_CONSENT_FILE_LOCATION, mockFileLocation)
          postOptions.payload.checkUploadConsent = undefined
          const request = {
            yar: redisMap,
            payload: {
              checkUploadConsent: undefined
            }
          }
          const h = {
            redirect: (view) => {
              viewResult = view
            },
            view: (view) => {
              viewResult = view
            }
          }
          await checkConsentFile.default[1].handler(request, h)
          expect(viewResult).toEqual(constants.views.DEVELOPER_AGREEMENT_CHECK)
          done()
        } catch (err) {
          done(err)
        }
      })
    })

    it('should detect an invalid response from user', async () => {
      postOptions.payload.checkUploadConsent = 'invalid'
      const response = await submitPostRequest(postOptions, 404)
      expect(response.payload).toContain('Page not found')
    })
  })
})
