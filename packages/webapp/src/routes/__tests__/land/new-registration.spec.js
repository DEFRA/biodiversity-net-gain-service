import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = `${constants.routes.NEW_REGISTRATION}`

describe(url, () => {
  describe('GET', () => {
    it('should reset the Redis cache and redirect to the register land task list page', async () => {
      const expectedCacheContent = {}
      expectedCacheContent['application-type'] = constants.applicationTypes.REGISTRATION
      const response = await submitGetRequest({ url }, 302)
      expect(response.headers.location).toEqual(constants.routes.REGISTER_LAND_TASK_LIST)
      expect(response.request.yar._store).toEqual(expectedCacheContent)
    })
  })
})
