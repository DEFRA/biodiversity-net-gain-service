import constants from '../../../utils/constants.js'

import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
const url = constants.routes.REGISTERED_LANDOWNER

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
    it('should redirect to Start page if no data applicant data is available in session', async () => {
      const response = await submitGetRequest({ url }, 302, {})
      expect(response.headers.location).toEqual(constants.routes.START)
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
    it('Should continue journey to yes selection made', async () => {
      postOptions.payload.landownerOnly = 'true'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.CHECK_OWNERSHIP_DETAILS)
    })
    it('Should continue journey to no selection made', async () => {
      postOptions.payload.landownerOnly = 'false'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.ADD_LANDOWNERS)
    })
    it('Should continue journey to no selection made', async () => {
      postOptions.payload.landownerOnly = ''
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Select yes if you&#39;re the only registered landowner')
    })
  })
})
