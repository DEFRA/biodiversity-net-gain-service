import constants from '../../../utils/constants.js'

const url = '/' + constants.routes.DEVELOPER_CONFIRM_OFF_SITE_GAIN
const mockGainSiteNumber = 'gainsite123'

const mockMetricData = {
  d2: [
    {
      'Broad habitat': 'Rocky shore ',
      'Habitat type': 'Moderate energy littoral rock - on peat, clay or chalk',
      'Area (hectares)': 1,
      'Total habitat units': 'Check Data ⚠',
      'Off-site reference': mockGainSiteNumber,
      Condition: 'Fairly Good'
    },
    { 'Area (hectares)': 1, 'Total habitat units': 1 }
  ],
  e2: [
    {
      'Habitat type': 'Native hedgerow - associated with bank or ditch',
      'Length (km)': 3,
      'Total hedgerow units': 27,
      'Off-site reference': 1234,
      Condition: 'Good'
    },
    { 'Length (km)': 3, 'Total hedgerow units': 27 }
  ],
  f2: [
    {
      'Baseline ref': 1,
      'Watercourse type': 'Other rivers and streams',
      'Length (km)': 1,
      'Strategic significance': 'Location ecologically desirable but not in local strategy',
      'Extent of encroachment': 'No Encroachment',
      'Extent of encroachment for both banks': 'Minor/ Minor',
      'Total watercourse units': 6.2700000000000005,
      'Length enhanced': 1,
      'Off-site reference': mockGainSiteNumber,
      Condition: 'Poor',
      'Habitat reference Number': 'F1'
    }
  ],
  d3: [],
  e3: [],
  f3: []
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
          contextResult = context
        }
      }
      await confirmOffsiteGainOptions.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.views.DEVELOPER_CONFIRM_OFF_SITE_GAIN)
    })

    it(`should render the ${url.substring(1)} view with proper data`, async () => {
      const confirmOffsiteGainOptions = require('../../developer/confirm-off-site-gain.js')

      const mockContextResult = {
        habitatTypeAndCondition: [
          {
            type: 'Habitat',
            unitKey: 'Area (hectares)',
            unit: 'Area (ha)',
            header: 'Broad habitat',
            description: 'Proposed habitat',
            dataTestId: 'habitatTotal',
            total: 1,
            items: [
              {
                header: 'Rocky shore ',
                condition: 'Fairly Good',
                amount: 1
              }
            ]
          },
          {
            type: 'Watercourse',
            unitKey: 'Length (km)',
            unit: 'Length (km)',
            description: 'Watercourse type',
            dataTestId: 'riverTotal',
            total: 1,
            items: [
              {
                description: 'Other rivers and streams',
                condition: 'Poor',
                amount: 1
              }
            ]
          }
        ],
        uploadMetricFileRoute: '/developer/upload-metric-file'
      }

      redisMap.set(constants.redisKeys.DEVELOPER_METRIC_DATA, mockMetricData)
      redisMap.set(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER, mockGainSiteNumber)

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
      expect(contextResult).toMatchObject(mockContextResult)
    })

    it(`should render the ${url.substring(1)} view with some insufficient data`, async () => {
      const confirmOffsiteGainOptions = require('../../developer/confirm-off-site-gain.js')

      const mockContextResult = {
        habitatTypeAndCondition: [
          {
            type: 'Watercourse',
            unitKey: 'Length (km)',
            unit: 'Length (km)',
            description: 'Watercourse type',
            dataTestId: 'riverTotal',
            total: 1,
            items: [
              {
                description: 'Other rivers and streams',
                condition: 'Poor',
                amount: 1
              }
            ]
          }
        ],
        uploadMetricFileRoute: '/developer/upload-metric-file'
      }

      const mockMetricDataCopy = { ...mockMetricData }
      mockMetricDataCopy.d2 = []

      redisMap.set(constants.redisKeys.DEVELOPER_METRIC_DATA, mockMetricDataCopy)
      redisMap.set(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER, mockGainSiteNumber)

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
      expect(contextResult).toMatchObject(mockContextResult)
    })
  })

  describe('POST', () => {
    let redisMap
    beforeEach(() => {
      redisMap = new Map()
    })

    it('should redirect to task list page', (done) => {
      jest.isolateModules(async () => {
        try {
          let viewResult
          const confirmOffsiteGainOptions = require('../../developer/confirm-off-site-gain.js')
          const request = {
            yar: redisMap
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
  })
})
