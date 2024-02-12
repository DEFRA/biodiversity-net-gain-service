import { submitGetRequest } from '../../routes/__tests__/helpers/server.js'
import constants from '../../utils/constants.js'
import testApplication from '../../__mock-data__/test-application.js'

describe('on-pre-handler', () => {
  it('Should get public assets and not block if wrong journey', async () => {
    const application = JSON.parse(testApplication.dataString)
    application[constants.redisKeys.APPLICATION_TYPE] = constants.applicationTypes.REGISTRATION
    const response = await submitGetRequest({ url: '/public/robots.txt' }, 200, application)
    console.log(response)
  })
  it('Should redirect to registration task list if on wrong journey', async () => {
    const application = JSON.parse(testApplication.dataString)
    application[constants.redisKeys.APPLICATION_TYPE] = constants.applicationTypes.REGISTRATION
    const response = await submitGetRequest({ url: constants.routes.DEVELOPER_UPLOAD_METRIC }, 302, application)
    expect(response.headers.location).toEqual(constants.routes.REGISTER_LAND_TASK_LIST)
  })
  it('Should redirect to developer task list if on wrong journey', async () => {
    const application = JSON.parse(testApplication.dataString)
    application[constants.redisKeys.APPLICATION_TYPE] = constants.applicationTypes.ALLOCATION
    const response = await submitGetRequest({ url: constants.routes.UPLOAD_METRIC }, 302, application)
    expect(response.headers.location).toEqual(constants.routes.DEVELOPER_TASKLIST)
  })
})
