import constants from '../../../utils/constants.js'

const url = '/' + constants.routes.DEVELOPER_CONFIRM_OFF_SITE_GAIN

const mockMetricData = {
  offSiteHabitatBaseline: [
    {
      'Broad habitat': 'Rocky shore ',
      'Habitat type': 'Moderate energy littoral rock - on peat, clay or chalk',
      'Area (hectares)': 1,
      'Total habitat units': 'Check Data ⚠',
      Condition: 'Fairly Good'
    },
    { 'Area (hectares)': 1, 'Total habitat units': 1 }
  ],
  offSiteHedgeBaseline: [
    {
      'Hedgerow type': 'Native hedgerow - associated with bank or ditch',
      'Length (km)': 3,
      'Total hedgerow units': 27,
      Condition: 'Good'
    },
    { 'Length (km)': 3, 'Total hedgerow units': 27 }
  ]
}

const getNumOfUnits = (data, field1, field2) => (data || []).reduce((prev, item) => {
  const area = item[field1] && !isNaN(item[field2]) ? item[field2] : 0
  return prev + area
}, 0)

describe(url, () => {
  describe('GET', () => {
    let viewResult, contextResult
    const redisMap = new Map()
    it(`should render the ${url.substring(1)} view`, async () => {
      const confirmOffsiteGainOptions = require('../../developer/confirm-off-site-gain.js')
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
      await confirmOffsiteGainOptions.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.views.DEVELOPER_CONFIRM_OFF_SITE_GAIN)
      expect(contextResult).toBeDefined()
      expect(getNumOfUnits(mockMetricData.offSiteHabitatBaseline, 'Broad habitat', 'Area (hectares)')).toBeDefined()
      expect(getNumOfUnits(mockMetricData.offSiteHedgeBaseline, 'Hedgerow type', 'Length (km)')).toBeDefined()
    })

    it(`should render the ${url.substring(1)} view with proper data`, async () => {
      const confirmOffsiteGainOptions = require('../../developer/confirm-off-site-gain.js')
      const _mockMetricData = {
        d1OffSiteHabitatBaseline: [
          {
            'Broad habitat': 'Rocky shore ',
            'Habitat type': 'Moderate energy littoral rock - on peat, clay or chalk',
            'Area (hectares)': 1,
            'Total habitat units': 0,
            Condition: 'Fairly Good'
          }
        ],
        e1OffSiteHedgeBaseline: [
          {
            'Hedgerow type': 'Native hedgerow - associated with bank or ditch',
            'Length (km)': 3,
            'Total hedgerow units': 27,
            Condition: 'Good'
          }
        ]
      }
      redisMap.set(constants.redisKeys.DEVELOPER_METRIC_DATA, _mockMetricData)

      const request = {
        yar: redisMap
      }
      const h = {
        view: (view, context) => {
          viewResult = view
          contextResult = context
        }
      }
      await confirmOffsiteGainOptions.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.views.DEVELOPER_CONFIRM_OFF_SITE_GAIN)
      expect(contextResult).toBeDefined()
    })

    it(`should render the ${url.substring(1)} view with some insufficient data`, async () => {
      const confirmOffsiteGainOptions = require('../../developer/confirm-off-site-gain.js')
      const _mockMetricData = {
        d1OffSiteHabitatBaseline: [
          {
            'Area (hectares)': 1,
            'Total habitat units': 0
          }
        ],
        e1OffSiteHedgeBaseline: [
          {
            'Length (km)': 3
          }
        ]
      }
      redisMap.set(constants.redisKeys.DEVELOPER_METRIC_DATA, _mockMetricData)

      const request = {
        yar: redisMap
      }
      const h = {
        view: (view, context) => {
          viewResult = view
          contextResult = context
        }
      }
      await confirmOffsiteGainOptions.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.views.DEVELOPER_CONFIRM_OFF_SITE_GAIN)
      expect(contextResult).toBeDefined()
      expect(getNumOfUnits(mockMetricData.offSiteHabitatBaseline, 'Broad habitat', 'Area (hectares)')).toBeDefined()
      expect(getNumOfUnits(mockMetricData.offSiteHedgeBaseline, 'Hedgerow type', 'Length (km)')).toBeDefined()
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
          const confirmOffsiteGainOptions = require('../../developer/confirm-off-site-gain.js')
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
          await confirmOffsiteGainOptions.default[1].handler(request, h)
          expect(viewResult).toEqual('/developer/tasklist')
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
          const confirmOffsiteGainOptions = require('../../developer/confirm-off-site-gain.js')
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
          await confirmOffsiteGainOptions.default[1].handler(request, h)
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
          let viewResult
          const confirmOffsiteGainOptions = require('../../developer/confirm-off-site-gain.js')
          const confirmOffsiteGain = undefined
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
          await confirmOffsiteGainOptions.default[1].handler(request, h)
          expect(viewResult).toEqual('developer/confirm-off-site-gain')
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
