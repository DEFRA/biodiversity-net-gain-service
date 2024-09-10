import { submitGetRequest } from '../../routes/__tests__/helpers/server.js'
import constants from '../../utils/constants.js'
import testApplication from '../../__mock-data__/test-application.js'

describe('section-id-handler', () => {
  const forwardedUrl = response => {
    if (!response.headers.location) return {}
    const { pathname, hash } = new URL(response.headers.location)
    return { pathname, hash }
  }

  it('Should not redirect if path includes /public/', async () => {
    const application = JSON.parse(testApplication.dataString)
    const response = await submitGetRequest({ url: '/public/robots.txt' }, 200, application)
    expect(forwardedUrl(response).pathname).toBeUndefined()
  })

  it('Should store journey-start-section-id query param, remove it from url, and forward to the resulting page with no hash defined', async () => {
    const application = JSON.parse(testApplication.dataString)
    const response = await submitGetRequest({ url: `${constants.reusedRoutes.COMBINED_CASE_CHECK_PLANNING_DECISION_NOTICE_FILE}?journey-start-section-id=test-section-id` }, 302, application)
    expect(application[constants.redisKeys.JOURNEY_START_SECTION_ID]).toEqual('test-section-id')
    expect(forwardedUrl(response).pathname).toEqual(constants.reusedRoutes.COMBINED_CASE_CHECK_PLANNING_DECISION_NOTICE_FILE)
    expect(forwardedUrl(response).hash).toBeFalsy()
  })

  it('Should not redirect if journey-start-section-id is not present', async () => {
    const application = JSON.parse(testApplication.dataString)
    const response = await submitGetRequest({ url: constants.reusedRoutes.COMBINED_CASE_CHECK_PLANNING_DECISION_NOTICE_FILE }, 200, application)
    expect(forwardedUrl(response).pathname).toBeUndefined()
  })

  it('Should redirect to url with hash and clear the value of JOURNEY_START_SECTION_ID if the path is combined case check and submit, and journey-start-section-id is present', async () => {
    const application = JSON.parse(testApplication.dataString)
    application[constants.redisKeys.JOURNEY_START_SECTION_ID] = 'test-section-id'
    const response = await submitGetRequest({ url: constants.routes.COMBINED_CASE_CHECK_AND_SUBMIT }, 302, application)
    expect(forwardedUrl(response).pathname).toEqual(constants.routes.COMBINED_CASE_CHECK_AND_SUBMIT)
    expect(forwardedUrl(response).hash).toEqual('#test-section-id')
    expect(application[constants.redisKeys.JOURNEY_START_SECTION_ID]).toBeUndefined()
  })

  it('Should not redirect if path is not combined case check and submit', async () => {
    const application = JSON.parse(testApplication.dataString)
    application[constants.redisKeys.JOURNEY_START_SECTION_ID] = 'test-section-id'
    const response = await submitGetRequest({ url: constants.reusedRoutes.COMBINED_CASE_CHECK_PLANNING_DECISION_NOTICE_FILE }, 200, application)
    expect(forwardedUrl(response).pathname).toBeUndefined()
  })
})
