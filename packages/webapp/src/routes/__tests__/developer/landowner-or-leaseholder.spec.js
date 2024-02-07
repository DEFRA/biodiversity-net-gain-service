import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.DEVELOPER_LANDOWNER_OR_LEASEHOLDER

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
    it('Should continue journey to yes selection made', async () => {
      postOptions.payload.isLandowner = 'yes'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.DEVELOPER_UPLOAD_CONSENT_TO_USE_GAIN_SITE)
    })
    it('Should continue journey to no selection made', async () => {
      postOptions.payload.isLandowner = 'no'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION)
    })
    it('Should continue journey to no selection made', async () => {
      postOptions.payload.isLandowner = ''
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Select yes if you&#39;re the landowner or leaseholder')
    })
  })
})
