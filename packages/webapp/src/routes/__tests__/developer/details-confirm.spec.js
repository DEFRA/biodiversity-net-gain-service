import constants from '../../../utils/constants'
import { submitPostRequest } from '../helpers/server'
const url = constants.routes.DEVELOPER_DETAILS_CONFIRM

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      let viewResult, resultContext
      const h = {
        view: (view, context) => {
          viewResult = view
          resultContext = context
        }
      }
      const redisMap = new Map()
      redisMap.set(constants.redisKeys.DEVELOPER_FULL_NAME, 'Test User')
      redisMap.set(constants.redisKeys.DEVELOPER_EMAIL_VALUE, 'test@example.com')
      const request = {
        yar: redisMap
      }
      const email = require('../../developer/details-confirm')
      await email.default[0].handler(request, h)
      expect(viewResult).toBe(constants.views.DEVELOPER_DETAILS_CONFIRM)
      expect(resultContext.fullName).toEqual('Test User')
      expect(resultContext.emailAddress).toEqual('test@example.com')
    })
  })
  describe('POST', () => {
    let postOptions
    beforeEach(() => {
      postOptions = {
        url
      }
    })
    it('should redirect to the task list page on continue', async () => {
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.DEVELOPER_TASKLIST)
    })
  })
})
