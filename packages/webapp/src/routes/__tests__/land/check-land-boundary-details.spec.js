import constants from '../../../utils/constants.js'
import { submitGetRequest } from '../helpers/server.js'

const url = constants.routes.CHECK_LAND_BOUNDARY_DETAILS

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      process.env.ENABLE_ROUTE_SUPPORT_FOR_GEOSPATIAL = 'N'
      const res = await submitGetRequest({ url }, 200)
      expect(res.payload).not.toContain('File type')
    })
    it(`should render the ${url.substring(1)} view if geospatial enabled`, async () => {
      process.env.ENABLE_ROUTE_SUPPORT_FOR_GEOSPATIAL = 'Y'
      const sessionData = {}
      sessionData[`${constants.redisKeys.FULL_NAME}`] = 'Test User'
      sessionData[`${constants.redisKeys.ROLE_KEY}`] = 'test'
      sessionData[`${constants.redisKeys.EMAIL_VALUE}`] = 'test@example.com'
      sessionData[`${constants.redisKeys.LAND_BOUNDARY_UPLOAD_TYPE}`] = 'geospatialData'
      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).toContain('Geospatial file')
    })
    it('should redirect to Start page if no data applicant data is available in session', async () => {
      const response = await submitGetRequest({ url }, 302, {})
      expect(response.headers.location).toEqual(constants.routes.START)
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
