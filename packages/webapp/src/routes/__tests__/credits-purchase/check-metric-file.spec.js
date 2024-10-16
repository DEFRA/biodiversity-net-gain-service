import creditsPurchaseConstants from '../../../utils/credits-purchase-constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'

const url = creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_UPLOAD_METRIC
const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/metric-file'
const mockFileLocation = `${mockDataPath}/metric-file.xlsx`

describe(url, () => {
  describe('GET', () => {
    let viewResult, contextResult
    const redisMap = new Map()
    it(`should render the ${url.substring(1)} view`, async () => {
      const checkMetricFile = require('../../credits-purchase/check-metric-file.js')
      redisMap.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_LOCATION, mockFileLocation)
      const request = {
        yar: redisMap
      }
      const h = {
        view: (view, context) => {
          viewResult = view
          contextResult = context
        }
      }
      await checkMetricFile.default[0].handler(request, h)
      expect(viewResult).toEqual(creditsPurchaseConstants.views.CREDITS_PURCHASE_CHECK_UPLOAD_METRIC)
      expect(contextResult.filename).toEqual('metric-file.xlsx')
    })

    it(`should render the ${url.substring(1)} without file info`, async () => {
      const checkMetricFile = require('../../credits-purchase/check-metric-file.js')
      redisMap.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_LOCATION, null)
      const request = {
        yar: redisMap
      }
      const h = {
        view: (view, context) => {
          viewResult = view
          contextResult = context
        }
      }
      await checkMetricFile.default[0].handler(request, h)
      expect(viewResult).toEqual(creditsPurchaseConstants.views.CREDITS_PURCHASE_CHECK_UPLOAD_METRIC)
      expect(contextResult.filename).toEqual('')
    })

    it('should render the view with the correct error message when user doesnt select yes or no', async () => {
      const sessionData = {
        errors: [
          {
            text: 'Select yes if this is the statutory biodiversity metric file your local planning authority reviewed with your biodiversity net gain statement',
            href: '#check-upload-correct-yes'
          }
        ],
        checkUploadMetric: ''
      }

      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Select yes if this is the statutory biodiversity metric file your local planning authority reviewed with your biodiversity net gain statement')
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

    it('should allow an alternative metric file to be uploaded ', (done) => {
      jest.isolateModules(async () => {
        try {
          let viewResult
          const checkMetricFile = require('../../credits-purchase/check-metric-file.js')
          redisMap.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_LOCATION, mockFileLocation)
          postOptions.payload.checkUploadMetric = creditsPurchaseConstants.creditsCheckUploadMetric.NO
          const request = {
            yar: redisMap,
            payload: {
              checkUploadMetric: creditsPurchaseConstants.creditsCheckUploadMetric.NO
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
          await checkMetricFile.default[1].handler(request, h)
          expect(viewResult).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_UPLOAD_METRIC)
          expect(spy).toHaveBeenCalledWith({
            containerName: 'customer-uploads',
            blobName: mockFileLocation
          })
          expect(spy).toHaveBeenCalledTimes(1)
          done()
        } catch (err) {
          done(err)
        }
      })
    })

    it('should allow confirmation that the correct metric file has been uploaded', async () => {
      postOptions.payload.checkUploadMetric = creditsPurchaseConstants.creditsCheckUploadMetric.YES
      await submitPostRequest(postOptions)
    })
    it('should not continue journey if user doesnt select an option', async () => {
      const res = await submitPostRequest(postOptions, 302)
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_UPLOAD_METRIC)
    })
  })
})
