import constants from '../../../utils/constants.js'

import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
const url = constants.routes.ADD_LANDOWNERS

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
    it('Should continue journey if owners names added', async () => {
      postOptions.payload.landowners = ['John Smith', 'Jane Doe']
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.LANDOWNER_CONSENT)
    })
    it('Should continue journey if owners names added and last is blank', async () => {
      postOptions.payload.landowners = ['John Smith', 'Jane Doe', '']
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.LANDOWNER_CONSENT)
    })
    it('Should stop journey if no owners', async () => {
      postOptions.payload.landowners = undefined
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter the full name of the landowner')
    })
    it('Should stop journey if no owners', async () => {
      postOptions.payload.landowners = []
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter the full name of the landowner')
    })
    it('Should stop journey if owner name is blank', async () => {
      postOptions.payload.landowners = ['']
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter the full name of the landowner')
    })
    it('Should stop journey if a name is blank, but not last', async () => {
      postOptions.payload.landowners = ['test0', '', 'test3']
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter the full name of the landowner')
    })
  })
})
