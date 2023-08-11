import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'

const url = constants.routes.DEVELOPER_ROUTING_REGISTER

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    let postOptions
    beforeEach(() => {
      postOptions = {
        url,
        payload: {}
      }
    })

    it('should redirect to the routing result if record gain site selected', async () => {
      postOptions.payload.routingRegisterOption = constants.ROUTING_REGISTER_OPTIONS.RECORD
      const res = await submitPostRequest(postOptions, 302, { expectedNumberOfPostJsonCalls: 0 })
      expect(res.headers.location).toEqual(constants.routes.DEVELOPER_ROUTING_RESULT)
    })

    it('should redirect to the routing result if register off-site selected', async () => {
      postOptions.payload.routingRegisterOption = constants.ROUTING_REGISTER_OPTIONS.REGISTER
      const res = await submitPostRequest(postOptions, 302, { expectedNumberOfPostJsonCalls: 0 })
      expect(res.headers.location).toEqual(constants.routes.DEVELOPER_ROUTING_SOLD)
    })

    it('should detect if option is not selected', async () => {
      postOptions.payload = {}
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('You need to select an option')
    })
  })
})
