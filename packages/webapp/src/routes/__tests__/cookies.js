import { submitGetRequest } from './helpers/server.js'
import constants from '../../utils/constants'

const url = constants.routes.COOKIES

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view with link back to referring page`, async () => {
      const referer = '/start'
      const options = {
        method: 'GET',
        headers: {
          referer
        },
        url
      }
      const res = await submitGetRequest(options)
      expect(res.payload).toContain(referer)
    })
  })
})
