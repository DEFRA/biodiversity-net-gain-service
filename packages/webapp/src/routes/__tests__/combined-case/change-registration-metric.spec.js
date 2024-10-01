import constants from '../../../utils/constants.js'
import changeRegistrationMetric from '../../combined-case/change-registration-metric.js'
import applicationSession from '../../../__mocks__/application-session.js'
import { submitGetRequest } from '../helpers/server.js'
const url = constants.routes.COMBINED_CASE_CHANGE_REGISTRATION_METRIC

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    it('should continue journey to tasklist if user does not want to change the registration metric', async () => {
      const session = applicationSession()
      const postHandler = changeRegistrationMetric[1].handler
      let redirectArgs = ''
      const h = {
        redirect: (...args) => {
          redirectArgs = args
        }
      }

      await postHandler({ yar: session, payload: { changeRegistrationMetric: 'no' } }, h)
      expect(redirectArgs[0]).toEqual(constants.routes.COMBINED_CASE_TASK_LIST)
    })

    it('should redirect to upload metric if user wants to change the registration metric', async () => {
      const session = applicationSession()
      const postHandler = changeRegistrationMetric[1].handler
      let redirectArgs = ''
      const h = {
        redirect: (...args) => {
          redirectArgs = args
        }
      }

      await postHandler({ yar: session, payload: { changeRegistrationMetric: 'yes' } }, h)
      expect(redirectArgs[0]).toEqual(constants.reusedRoutes.COMBINED_CASE_UPLOAD_METRIC)
    })

    it('should return to check-and-submit if user does not want to change the registration metric', async () => {
      const session = applicationSession()
      session.set(constants.redisKeys.REFERER, constants.routes.COMBINED_CASE_CHECK_AND_SUBMIT)
      const postHandler = changeRegistrationMetric[1].handler
      let redirectArgs = ''
      const h = {
        redirect: (...args) => {
          redirectArgs = args
        }
      }

      const request = {
        yar: session,
        payload: { changeRegistrationMetric: 'no' },
        path: changeRegistrationMetric[1].path
      }

      await postHandler(request, h)
      expect(redirectArgs[0]).toEqual(constants.routes.COMBINED_CASE_CHECK_AND_SUBMIT)
    })
  })
})
