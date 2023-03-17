import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'

const url = '/developer/routing-register'

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
        await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    let redisMap, postOptions
    beforeEach(() => {
      redisMap = new Map()
      postOptions = {
        url,
        payload: {}
      }
    })

    it('should redirect to the routing result if record gain site selected', async() => {
        postOptions.payload.routingRegisterOption = constants.ROUTING_REGISTER_OPTIONS.RECORD
        const res = await submitPostRequest(postOptions)
        expect(res.headers.location).toEqual('/developer/')
    })
    
    it('should redirect to the routing result if register off-site selected', async() => {
        postOptions.payload.routingRegisterOption = constants.ROUTING_REGISTER_OPTIONS.REGISTER
        const res = await submitPostRequest(postOptions)
        expect(res.headers.location).toEqual('/developer/')
    })

    it('should detect if option does not selected', async () => {
      postOptions.payload.routingRegisterOption = undefined
      await submitPostRequest(postOptions, 500)
    })
  })
})
