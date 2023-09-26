import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = `${constants.routes.DEVELOPER_NEW_DEVELOPMENT_PROJECT}`

describe(url, () => {
  describe('GET', () => {
    it('should reset the Redis cache and redirect to the register land task list page', async () => {
      const expectedCacheContent = {}
      expectedCacheContent['application-type'] = constants.applicationTypes.ALLOCATION
      const response = await submitGetRequest({ url }, 302)
      expect(response.headers.location).toEqual(constants.routes.DEVELOPER_TASKLIST)
      expect(response.request.yar._store).toEqual(expectedCacheContent)
    })
  })
})
