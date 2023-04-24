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
          contextResult = {
            ...context,
            offSiteHabitats: {
              items: '',
              total: 0
            },
            offSiteHedgerows: {
              items: '',
              total: 0
            }
          }
        }
      }
      await confirmOffsiteGainOptions.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.views.DEVELOPER_CONFIRM_OFF_SITE_GAIN)
      expect(contextResult).toBeDefined()
    })
  })

  describe('POST', () => {
    jest.mock('@defra/bng-connectors-lib')
    let redisMap, confirmOffsiteGainOptions
    beforeEach(() => {
      redisMap = new Map()
      confirmOffsiteGainOptions = require('../../developer/confirm-off-site-gain.js')
    })

    it('should redirect to legal agreement upload screen if selected Yes', (done) => {
      jest.isolateModules(async () => {
        try {
          let viewResult
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

    it('should show an error if none of the options are selected', (done) => {
      jest.isolateModules(async () => {
        try {
          let viewResult, resultContext
          const confirmOffsiteGain = undefined
          redisMap.set(constants.redisKeys.METRIC_FILE_CHECKED, confirmOffsiteGain)
          const request = {
            yar: redisMap,
            payload: {
              confirmOffsiteGain
            }
          }
          const h = {
            redirect: (view, context) => {
              viewResult = view
              resultContext = context
            },
            view: (view, context) => {
              viewResult = view
              resultContext = context
            }
          }
          await confirmOffsiteGainOptions.default[1].handler(request, h)
          expect(viewResult).toEqual('developer/confirm-off-site-gain')
          expect(resultContext.err[0]).toEqual({
            href: '#offsite-details-checked-yes',
            text: 'Select yes if this is the correct file'
          })
          done()
        } catch (err) {
          done(err)
        }
      })
    })

    it('should show an error if no any options are selected and required field\'s value is invalid', (done) => {
      jest.isolateModules(async () => {
        try {
          const _mockMetricData = {
            d1OffSiteHabitatBaseline: [
              {
                'Broad habitat': 'Rocky shore ',
                'Area (hectares)': NaN,
                'Total habitat units': 0,
                Condition: 'Fairly Good'
              }
            ]
          }
          const { viewResult, resultContext } = await processConfirmOffSiteGain(_mockMetricData)
          expect(viewResult).toEqual('developer/confirm-off-site-gain')
          expect(resultContext.err[0]).toEqual({
            href: '#offsite-details-checked-yes',
            text: 'Select yes if this is the correct file'
          })
          done()
        } catch (err) {
          done(err)
        }
      })
    })
    it('should show an error if no any options are selected and required field\'s value is valid', (done) => {
      jest.isolateModules(async () => {
        try {
          const _mockMetricData = {
            d1OffSiteHabitatBaseline: [
              {
                'Broad habitat': 'Rocky shore',
                'Area (hectares)': 15.5,
                'Total habitat units': 20,
                Condition: 'Fairly Good'
              }
            ]
          }
          const { viewResult, resultContext } = await processConfirmOffSiteGain(_mockMetricData)
          expect(viewResult).toEqual('developer/confirm-off-site-gain')
          expect(resultContext.err[0]).toEqual({
            href: '#offsite-details-checked-yes',
            text: 'Select yes if this is the correct file'
          })
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})

const processConfirmOffSiteGain = async (_mockMetricData) => {
  let viewResult, resultContext
  const confirmOffsiteGainOptions = require('../../developer/confirm-off-site-gain.js')
  const redisMap = new Map()
  const confirmOffsiteGain = undefined
  redisMap.set(constants.redisKeys.METRIC_FILE_CHECKED, confirmOffsiteGain)
  redisMap.set(constants.redisKeys.DEVELOPER_METRIC_DATA, _mockMetricData)
  const request = {
    yar: redisMap,
    payload: {
      confirmOffsiteGain
    }
  }
  const h = {
    redirect: (view, context) => {
      viewResult = view
      resultContext = context
    },
    view: (view, context) => {
      viewResult = view
      resultContext = context
    }
  }
  await confirmOffsiteGainOptions.default[1].handler(request, h)

  return { viewResult, resultContext }
}
