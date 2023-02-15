import constants from '../../../utils/constants.js'

const url = '/developer/confirm-off-site-gain'

const mockMetricData = {
  offSiteHabitatBaseline: [
    [
      {
        classes: 'govuk-!-width-two-thirds',
        html: '<span class=\'govuk-body-m govuk-!-display-block govuk-!-margin-top-0 govuk-!-margin-bottom-0\'>undefined</span> <span class=\'govuk-body-s govuk-!-display-block govuk-!-margin-top-0 govuk-!-margin-bottom-0\'>undefined</span>'
      },
      {
        text: undefined
      }
    ],
    [
      {
        classes: 'govuk-!-width-two-thirds',
        text: 'Total area'
      }
    ]
  ],
  offSiteHedgeBaseline: [
    [
      {
        classes: 'govuk-!-width-two-thirds',
        html: '<span class=\'govuk-body-m govuk-!-display-block govuk-!-margin-top-0 govuk-!-margin-bottom-0\'>undefined</span>'
      },
      { text: undefined }
    ],
    [
      { classes: 'govuk-!-width-two-thirds', text: 'Total length' },
      { text: NaN }
    ]
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
      expect(contextResult.offSiteHabitatTableContent).toBeDefined()
      expect(contextResult.offSiteHedgerowTableContent).toBeDefined()
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
          expect(viewResult).toEqual('/developer/legal-agreement-upload')
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

    it('should show error if selected of the options selected', (done) => {
      jest.isolateModules(async () => {
        try {
          let viewResult
          const checkMetricFile = require('../../developer/confirm-off-site-gain.js')
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
          await checkMetricFile.default[1].handler(request, h)
          expect(viewResult).toEqual('developer/confirm-off-site-gain')
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
