import constants from '../../../utils/constants.js'

const url = '/' + constants.routes.DEVELOPER_CONFIRM_OFF_SITE_GAIN

const mockMetricData = {
  d1: [
    {
      'Broad habitat': 'Rocky shore ',
      'Habitat type': 'Moderate energy littoral rock - on peat, clay or chalk',
      'Area (hectares)': 1,
      'Total habitat units': 'Check Data ⚠',
      'Off-site reference': 'AZ12208461',
      Condition: 'Fairly Good'
    },
    { 'Area (hectares)': 1, 'Total habitat units': 1 }
  ],
  e1: [
    {
      'Habitat type': 'Native hedgerow - associated with bank or ditch',
      'Length (km)': 3,
      'Total hedgerow units': 27,
      'Off-site reference': 'AZ12208461',
      Condition: 'Good'
    },
    { 'Length (km)': 3, 'Total hedgerow units': 27 }
  ],
  f1: [
    {
      'Baseline ref': 1,
      'Watercourse type': 'Other rivers and streams',
      'Length (km)': 1,
      'Strategic significance': 'Location ecologically desirable but not in local strategy',
      'Extent of encroachment': 'No Encroachment',
      'Extent of encroachment for both banks': 'Minor/ Minor',
      'Total watercourse units': 6.2700000000000005,
      'Length enhanced': 1,
      'Off-site reference': 1234,
      Condition: 'Poor',
      'Habitat reference Number': 'F1'
    }
  ]
}

describe(url, () => {
  describe('GET', () => {
    let viewResult, contextResult
    const cacheMap = new Map()
    it(`should render the ${url.substring(1)} view`, async () => {
      const confirmOffsiteGainOptions = require('../../developer/confirm-off-site-gain.js')
      cacheMap.set(constants.cacheKeys.DEVELOPER_METRIC_DATA, mockMetricData)
      const request = {
        yar: cacheMap
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
      const _mockMetricData = {
        d1: [
          {
            'Broad habitat': 'Rocky shore ',
            'Habitat type': 'Moderate energy littoral rock - on peat, clay or chalk',
            'Area (hectares)': 1,
            'Total habitat units': 0,
            Condition: 'Fairly Good'
          }
        ],
        e1: [
          {
            'Habitat type': 'Native hedgerow - associated with bank or ditch',
            'Length (km)': 3,
            'Total hedgerow units': 27,
            Condition: 'Good'
          }
        ],
        f1: [
          {
            'Watercourse type': 'Other rivers and streams',
            'Length (km)': 1,
            'Total watercourse units': 6.2700000000000005,
            Condition: 'Poor',
            'Habitat reference Number': 'F1'
          }
        ]
      }

      const mockContextResult = {
        gainSiteNumber: undefined,
        offSiteHabitats: {
          items: [
            {
              'Area (hectares)': 1,
              'Broad habitat': 'Rocky shore ',
              Condition: 'Fairly Good',
              'Habitat type': 'Moderate energy littoral rock - on peat, clay or chalk',
              'Total habitat units': 0
            }
          ],
          total: 1
        },
        offSiteHedgerows: {
          items: [
            {
              Condition: 'Good',
              'Habitat type': 'Native hedgerow - associated with bank or ditch',
              'Length (km)': 3,
              'Total hedgerow units': 27
            }
          ],
          total: 3
        },
        offSiteWatercourses: {
          items: [
            {
              Condition: 'Poor',
              'Watercourse type': 'Other rivers and streams',
              'Length (km)': 1,
              'Total watercourse units': 6.2700000000000005
            }
          ],
          total: 1
        }
      }
      cacheMap.set(constants.cacheKeys.DEVELOPER_METRIC_DATA, _mockMetricData)

      const request = {
        yar: cacheMap
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
      const _mockMetricData = {
        d1: [
          {
            'Area (hectares)': 1,
            'Total habitat units': 0
          }
        ],
        e1: [
          {
            'Length (km)': 3
          }
        ]
      }
      const mockContextResult = {
        gainSiteNumber: undefined,
        offSiteHabitats: {
          items: [{
            'Area (hectares)': 1,
            'Total habitat units': 0
          }],
          total: 0
        },
        offSiteHedgerows: {
          items: [{
            'Length (km)': 3
          }],
          total: 0
        }
      }
      cacheMap.set(constants.cacheKeys.DEVELOPER_METRIC_DATA, _mockMetricData)

      const request = {
        yar: cacheMap
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
    jest.mock('@defra/bng-connectors-lib')
    let cacheMap
    beforeEach(() => {
      cacheMap = new Map()
    })

    it('should redirect to task list page', (done) => {
      jest.isolateModules(async () => {
        try {
          let viewResult
          const confirmOffsiteGainOptions = require('../../developer/confirm-off-site-gain.js')
          const request = {
            yar: cacheMap
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
