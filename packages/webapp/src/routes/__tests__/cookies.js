import { submitGetRequest } from './helpers/server.js'
import constants from '../../utils/constants'

const url = constants.routes.COOKIES

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })
})
