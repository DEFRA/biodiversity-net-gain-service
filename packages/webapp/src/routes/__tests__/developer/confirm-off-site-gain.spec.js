import constants from '../../../utils/constants.js'

const url = '/developer/confirm-off-site-gain'

const mockMetricData = {
  d1: [
    {
      'Broad habitat': 'Grassland',
      'Habitat type': 'Traditional orchards',
      'Area (hectares)': 5,
      'Total habitat units': 10,
      Condition: 'Fairly Good'
    }
  ],
  e1: [
    {
      'Hedgerow type': 'Native Species-rich native hedgerow with trees - associated with bank or ditch',
      'Length (km)': 5.5,
      'Total hedgerow units': 5
    }
  ]
}

describe(url, () => {
  describe('GET', () => {
    let viewResult, contextResult
    const redisMap = new Map()
    it(`should render the ${url.substring(1)} view`, async () => {
      const checkMetricFile = require('../../developer/confirm-off-site-gain.js')
      redisMap.set(constants.redisKeys.DEVELOPER_METRIC_DATA, mockMetricData)
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
      expect(viewResult).toEqual(constants.views.DEVELOPER_CONFIRM_OFF_SITE_GAIN)
      expect(contextResult.offSiteHabitats.items).toEqual(mockMetricData.d1)
      expect(contextResult.offSiteHabitats.total).toEqual(5)
      expect(contextResult.offSiteHedgerows.items).toEqual(mockMetricData.e1)
      expect(contextResult.offSiteHedgerows.total).toEqual(5.5)
    })

    it('should return 0 if empty metric got from extraction', async () => {
      const checkMetricFile = require('../../developer/confirm-off-site-gain.js')
      redisMap.set(constants.redisKeys.DEVELOPER_METRIC_DATA, { d1: [{ dummy: '' }], e1: [{ dummy: '' }] })
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
      expect(viewResult).toEqual(constants.views.DEVELOPER_CONFIRM_OFF_SITE_GAIN)
      expect(contextResult.offSiteHabitats.total).toEqual(0)
      expect(contextResult.offSiteHedgerows.total).toEqual(0)
    })
  })

  describe('POST', () => {
    jest.mock('@defra/bng-connectors-lib')
    let redisMap
    beforeEach(() => {
      redisMap = new Map()
    })

    it('should redirect to legal agreement upload screen if selected Yes', (done) => {
      jest.isolateModules(async () => {
        try {
          let viewResult
          const checkMetricFile = require('../../developer/confirm-off-site-gain.js')
          const confirmOffsiteGain = 'yes'
          redisMap.set(constants.redisKeys.METRIC_FILE_CHECKED, confirmOffsiteGain)
          const request = {
            yar: redisMap,
            payload: {
              confirmOffsiteGain
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
          await checkMetricFile.default[1].handler(request, h)
          // Note:  The expected location is temporary and will be replaced with the actual expected location once the associated functionality will be implemented.
          expect(viewResult).toEqual('/#')
          done()
        } catch (err) {
          done(err)
        }
      })
    })

    it('should redirect back to metric upload screen if selected No', (done) => {
      jest.isolateModules(async () => {
        try {
          let viewResult
          const checkMetricFile = require('../../developer/confirm-off-site-gain.js')
          const confirmOffsiteGain = 'no'
          redisMap.set(constants.redisKeys.METRIC_FILE_CHECKED, confirmOffsiteGain)
          const request = {
            yar: redisMap,
            payload: {
              confirmOffsiteGain
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
          await checkMetricFile.default[1].handler(request, h)
          expect(viewResult).toEqual('/developer/upload-metric-file')
          done()
        } catch (err) {
          done(err)
        }
      })
    })

    it('should show error if none of the options selected', (done) => {
      jest.isolateModules(async () => {
        try {
          let viewResult = ''
          const checkMetricFile = require('../../developer/confirm-off-site-gain.js')
          const confirmOffsiteGain = undefined
          redisMap.set(constants.redisKeys.METRIC_FILE_CHECKED, confirmOffsiteGain)
          const request = {
            yar: redisMap,
            payload: {}
          }
          const h = {
            view: (...args) => {
              viewResult = args
            }
          }
          await checkMetricFile.default[1].handler(request, h)
          expect(viewResult[0]).toEqual('developer/confirm-off-site-gain')
          expect(viewResult[1].err[0].text).toEqual('Select yes if this is the correct data')
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
