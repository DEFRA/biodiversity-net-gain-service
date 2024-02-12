import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants'
const url = constants.routes.CANNOT_VIEW_APPLICATION

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view with a 401 unauthorised HTTP response code`, async () => {
      const response = await submitGetRequest({ url }, 401)
      expect(response.payload).toContain('<p>If you\'re trying to access an application you started, you\'ll need to <a href="/signout">sign into your Defra account</a> to view it.</p>')
    })
    it(`should render the ${url.substring(1)} view with a 401 unauthorised HTTP response code and organisation copy`, async () => {
      const response = await submitGetRequest({ url: `${url}?orgError=true` }, 401)
      expect(response.payload).toContain('<p>You\'ll need to <a href="/signin?reselect=true">choose to represent the individual or organisation associated with this application</a> in your Defra account.</p>')
    })
  })
})
