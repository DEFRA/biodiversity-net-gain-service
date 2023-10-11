import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.LEGAL_PARTY_ADD_TYPE

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

    it('Should continue journey to individual selection made', async () => {
      postOptions.payload.legalAgreementAddType = 'individual'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.ADD_LANDOWNER_INDIVIDUAL)
    })

    it('Should continue journey to organisation selection made', async () => {
      postOptions.payload.legalAgreementAddType = 'organisation'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.ADD_LANDOWNER_ORGANISATION)
    })

    it('Should continue journey to no selection made', async () => {
      postOptions.payload.landownerOnly = ''
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Select legal party type securing the biodiversity gain site')
    })
  })
})
