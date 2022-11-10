import constants from '../../../utils/constants.js'
import { submitGetRequest } from '../helpers/server.js'
const url = constants.routes.CHECK_LAND_BOUNDARY_DETAILS

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })
  describe('POST', () => {
    it('should flow to register task list', done => {
      jest.isolateModules(async () => {
        try {
          let viewResult
          const redisMap = new Map()
          const checkLandBoundary = require('../../land/check-land-boundary-details')
          const request = {
            yar: redisMap,
            payload: {
              confirmGeospatialLandBoundary: undefined
            }
          }
          const h = {
            redirect: (view, context) => {
              viewResult = view
            }
          }
          await checkLandBoundary.default[1].handler(request, h)
          expect(viewResult).toBe(constants.routes.REGISTER_LAND_TASK_LIST)
          expect(request.yar.get('registrationTaskDetails').taskList.length).toBe(5)
          expect(request.yar.get('registrationTaskDetails').taskList[1].tasks[0].status).toBe('COMPLETED')
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
