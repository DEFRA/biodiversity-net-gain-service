import { submitGetRequest } from './helpers/server.js'
const url = '/'

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url }, 302)
    })
  })
})
