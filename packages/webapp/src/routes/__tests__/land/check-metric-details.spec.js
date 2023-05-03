import constants from '../../../utils/constants.js'
import checkMetricDetails from '../../land/check-metric-details.js'
import applicationSession from '../../../__mocks__/application-session.js'
import { submitGetRequest } from '../helpers/server.js'
const url = constants.routes.CHECK_METRIC_DETAILS

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
    it('should redirect to Start page if no data applicant data is available in session', async () => {
      const response = await submitGetRequest({ url }, 302, {})
      expect(response.headers.location).toEqual(constants.routes.START)
    })
    it(`should render the ${url.substring(1)} view`, async () => {
      const session = applicationSession()
      const getHandler = checkMetricDetails[0].handler
      let viewArgs = ''
      const h = {
        view: (...args) => {
          viewArgs = args
        }
      }

      await getHandler({ yar: session }, h)
      expect(viewArgs[0]).toEqual(constants.views.CHECK_METRIC_DETAILS)
      expect(viewArgs[1]).toEqual({ filename: 'metric-file.xlsx' })
    })
  })
  describe('POST', () => {
    it('Should flow to register task list', async () => {
      const session = applicationSession()
      const postHandler = checkMetricDetails[1].handler
      let redirectArgs = ''
      const h = {
        redirect: (...args) => {
          redirectArgs = args
        }
      }
      await postHandler({ yar: session }, h)
      expect(redirectArgs[0]).toEqual(constants.routes.REGISTER_LAND_TASK_LIST)
      expect(session.get(constants.redisKeys.REGISTRATION_TASK_DETAILS).taskList[2].tasks[0].status).toBe('COMPLETED')
    })
  })
})
