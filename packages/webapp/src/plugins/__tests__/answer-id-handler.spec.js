import { submitGetRequest } from '../../routes/__tests__/helpers/server.js'
import constants from '../../utils/constants.js'
import testApplication from '../../__mock-data__/test-application.js'

describe('answer-id-handler', () => {
  const forwardedUrl = response => {
    if (!response.headers.location) return {}
    const [pathname, hash] = response.headers.location.split('#')
    return { pathname, hash }
  }

  it('Should not redirect if path includes /public/', async () => {
    const application = JSON.parse(testApplication.dataString)
    const response = await submitGetRequest({ url: '/public/robots.txt' }, 200, application)
    expect(forwardedUrl(response).pathname).toBeUndefined()
  })

  it('Should store journey-start-answer-id query param, remove it from url, and forward to the resulting page with no hash defined', async () => {
    const application = JSON.parse(testApplication.dataString)
    const response = await submitGetRequest({ url: `${constants.reusedRoutes.COMBINED_CASE_CHECK_PLANNING_DECISION_NOTICE_FILE}?journey-start-answer-id=test-answer-id` }, 302, application)
    expect(application[constants.redisKeys.JOURNEY_START_ANSWER_ID]).toEqual(['test-answer-id'])
    expect(forwardedUrl(response).pathname).toEqual(constants.reusedRoutes.COMBINED_CASE_CHECK_PLANNING_DECISION_NOTICE_FILE)
    expect(forwardedUrl(response).hash).toBeUndefined()
  })

  it('Should not redirect if journey-start-answer-id is not present', async () => {
    const application = JSON.parse(testApplication.dataString)
    const response = await submitGetRequest({ url: constants.reusedRoutes.COMBINED_CASE_CHECK_PLANNING_DECISION_NOTICE_FILE }, 200, application)
    expect(forwardedUrl(response).pathname).toBeUndefined()
  })

  it('Should redirect to url with hash and remove the value from JOURNEY_START_ANSWER_ID if the path is combined case check and submit, and journey-start-answer-id is present', async () => {
    const application = JSON.parse(testApplication.dataString)
    application[constants.redisKeys.JOURNEY_START_ANSWER_ID] = ['test-answer-id-1', 'test-answer-id-2']
    const response = await submitGetRequest({ url: constants.routes.COMBINED_CASE_CHECK_AND_SUBMIT }, 302, application)
    expect(forwardedUrl(response).pathname).toEqual(constants.routes.COMBINED_CASE_CHECK_AND_SUBMIT)
    expect(forwardedUrl(response).hash).toEqual('test-answer-id-2')
    expect(application[constants.redisKeys.JOURNEY_START_ANSWER_ID]).toEqual(['test-answer-id-1'])
  })

  it('Should clear the value of JOURNEY_START_ANSWER_ID but not redirect if the path is specified in constants.answerIdClearRoutes', async () => {
    const application = JSON.parse(testApplication.dataString)
    application[constants.redisKeys.JOURNEY_START_ANSWER_ID] = 'test-answer-id'
    const response = await submitGetRequest({ url: constants.routes.COMBINED_CASE_PROJECTS }, 200, application, { expectedNumberOfPostJsonCalls: 1 }) // This route makes a postJson call so we need to specify this in our call to submitGetRequest
    expect(forwardedUrl(response).pathname).toBeUndefined()
    expect(application[constants.redisKeys.JOURNEY_START_ANSWER_ID]).toBeUndefined()
  })

  it('Should not redirect if path is not combined case check and submit', async () => {
    const application = JSON.parse(testApplication.dataString)
    application[constants.redisKeys.JOURNEY_START_ANSWER_ID] = 'test-answer-id'
    const response = await submitGetRequest({ url: constants.reusedRoutes.COMBINED_CASE_CHECK_PLANNING_DECISION_NOTICE_FILE }, 200, application)
    expect(forwardedUrl(response).pathname).toBeUndefined()
  })
})
