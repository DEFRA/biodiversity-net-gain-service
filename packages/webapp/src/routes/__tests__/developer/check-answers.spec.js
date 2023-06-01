import constants from '../../../utils/constants.js'
const url = constants.routes.DEVELOPER_CHECK_ANSWERS
const mockMetricFilePath = 'packages/webapp/src/__mock-data__/uploads/metric-file/metric-file.xlsx'
const mockConsentFilePath = 'packages/webapp/src/__mock-data__/uploads/written-consent/sample.docx'
const mockDevelopmentDetails = {
  startPage: {
    projectName: 'Test Project',
    planningAuthority: 'Test Authority',
    planningApplicationReference: 'Test Application Reference'
  }
}

describe(url, () => {
  const redisMap = new Map()
  beforeEach(() => {
    redisMap.set(constants.redisKeys.DEVELOPER_METRIC_FILE_TYPE, 'mock-metric-file-type')
    redisMap.set(constants.redisKeys.DEVELOPER_CONSENT_FILE_TYPE, 'mock-consent-file-type')
    redisMap.set(constants.redisKeys.DEVELOPER_METRIC_FILE_SIZE, 5 * 1024)
    redisMap.set(constants.redisKeys.DEVELOPER_CONSENT_FILE_SIZE, 2 * 1024)
    redisMap.set(constants.redisKeys.DEVELOPER_METRIC_DATA, mockDevelopmentDetails)
    redisMap.set(constants.redisKeys.DEVELOPER_METRIC_LOCATION, mockMetricFilePath)
    redisMap.set(constants.redisKeys.DEVELOPER_CONSENT_FILE_LOCATION, mockConsentFilePath)
    redisMap.set(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER, '123')
    redisMap.set(constants.redisKeys.DEVELOPER_FULL_NAME, 'Test User')
    redisMap.set(constants.redisKeys.DEVELOPER_EMAIL_VALUE, 'test@example.com')
  })

  describe('GET', () => {
    let viewResult, contextResult
    it(`should render the ${url.substring(1)} view`, async () => {
      const checkAnswerFile = require('../../developer/check-answers.js')

      const request = {
        yar: redisMap
      }
      const h = {
        view: (view, context) => {
          viewResult = view
          contextResult = context
        }
      }
      await checkAnswerFile.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.views.DEVELOPER_CHECK_ANSWERS)
      expect(contextResult.developmentDetails).toEqual({
        projectName: mockDevelopmentDetails.startPage.projectName,
        localAuthority: mockDevelopmentDetails.startPage.planningAuthority,
        planningReference: mockDevelopmentDetails.startPage.planningApplicationReference
      })
    })
  })

  describe('POST', () => {
    jest.mock('@defra/bng-connectors-lib')

    it('should throw error if developer object validation failed', (done) => {
      jest.isolateModules(async () => {
        try {
          let viewResult
          const checkAnswerFile = require('../../developer/check-answers.js')
          const request = {
            yar: redisMap,
            payload: {}
          }
          const h = {
            redirect: (view) => {
              viewResult = view
            },
            view: (view) => {
              viewResult = view
            }
          }
          await checkAnswerFile.default[1].handler(request, h)
          expect(viewResult).toEqual(constants.routes.DEVELOPER_ROUTING_REGISTER)
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
