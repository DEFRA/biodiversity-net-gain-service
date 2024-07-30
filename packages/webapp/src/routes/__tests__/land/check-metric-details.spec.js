import constants from '../../../utils/constants.js'
import checkMetricDetails from '../../land/check-metric-details.js'
import applicationSession from '../../../__mocks__/application-session.js'
import { submitGetRequest } from '../helpers/server.js'
const url = constants.routes.CHECK_METRIC_DETAILS
const combinedCaseUrl = constants.reusedRoutes.COMBINED_CASE_CHECK_METRIC_DETAILS

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })

    it(`should render the ${combinedCaseUrl.substring(1)} view`, async () => {
      await submitGetRequest({ url: combinedCaseUrl })
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
      expect(viewArgs[1]).toEqual({ filename: 'new-metric-4.0.xlsm', urlPath: '/land' })
    })
    it('should redirect to REGISTER_LAND_TASK_LIST view if mandatory data missing', done => {
      jest.isolateModules(async () => {
        try {
          const getHandler = checkMetricDetails[0].handler
          const redisMap = new Map()
          redisMap.set(constants.redisKeys.METRIC_LOCATION, undefined)
          let redirectArgs = ''
          const request = {
            yar: redisMap
          }
          const h = {
            redirect: (...args) => {
              redirectArgs = args
            }
          }
          await getHandler(request, h)
          expect(redirectArgs).toEqual([constants.routes.REGISTER_LAND_TASK_LIST])
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
  describe('POST', () => {
    it('Should flow to register task list', async () => {
      const session = applicationSession()
      session.values[constants.redisKeys.APPLICATION_TYPE] = constants.applicationTypes.REGISTRATION

      const postHandler = checkMetricDetails[1].handler
      let redirectArgs = ''
      const h = {
        redirect: (...args) => {
          redirectArgs = args
        }
      }
      await postHandler({ yar: session, path: checkMetricDetails[1].path }, h)
      expect(redirectArgs[0]).toEqual(constants.routes.REGISTER_LAND_TASK_LIST)
    })
  })
})
