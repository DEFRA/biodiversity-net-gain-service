import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.COMBINED_CASE_CHANGE_REGISTRATION_METRIC

describe(url, () => {
  let viewResult
  let h
  let redisMap
  let changeRegistrationMetric

  beforeEach(() => {
    h = {
      view: (view) => {
        viewResult = view
      },
      redirect: (view) => {
        viewResult = view
      }
    }

    redisMap = new Map()
    changeRegistrationMetric = require('../../combined-case/change-registration-metric.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    it('should continue journey to upload registration metric page is user confirms to changing the metric', async () => {
      const request = {
        yar: redisMap,
        payload: { changeRegistrationMetric: 'yes' },
        path: changeRegistrationMetric.default[1].path
      }

      await changeRegistrationMetric.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.reusedRoutes.COMBINED_CASE_UPLOAD_METRIC)
    })
  })
  describe('POST', () => {
    it('should continue journey to tasklist if user does not want to change the registration metric', async () => {
      const request = {
        payload: { changeRegistrationMetric: 'no' },
        path: changeRegistrationMetric.default[1].path
      }

      await changeRegistrationMetric.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.COMBINED_CASE_TASK_LIST)
    })
  })
})
