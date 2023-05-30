import constants from '../../../utils/constants.js'
const url = constants.routes.DEVELOPER_CHECK_ANSWERS
const mockDevelopmentDetails = {
  startPage: {
    projectName: 'Test Project',
    planningAuthority: 'Test Authority',
    planningApplicationReference: 'Test Application Reference'
  }
}

describe(url, () => {
  describe('GET', () => {
    let viewResult, contextResult
    const redisMap = new Map()
    it(`should render the ${url.substring(1)} view`, async () => {
      const checkAnswerFile = require('../../developer/check-answers.js')

      redisMap.set(constants.redisKeys.DEVELOPER_FULL_NAME, 'Test User')
      redisMap.set(constants.redisKeys.DEVELOPER_EMAIL_VALUE, 'test@example.com')
      redisMap.set(constants.redisKeys.DEVELOPER_METRIC_DATA, mockDevelopmentDetails)
      redisMap.set(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER, '123')
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
    let redisMap
    beforeEach(() => {
      redisMap = new Map()
    })

    it('should throw error if developer object validation failed', (done) => {
      jest.isolateModules(async () => {
        try {
          let viewResult
          const checkAnswerFile = require('../../developer/check-answers.js')
          redisMap.set(constants.redisKeys.DEVELOPER_FULL_NAME, 'Test User')
          redisMap.set(constants.redisKeys.DEVELOPER_EMAIL_VALUE, 'test@example.com')
          redisMap.set(constants.redisKeys.DEVELOPER_METRIC_DATA, mockDevelopmentDetails)
          redisMap.set(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER, '123')
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
