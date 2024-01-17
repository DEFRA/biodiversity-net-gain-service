import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.ANY_OTHER_LANDOWNERS

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
    it('Should continue journey to LANDOWNER_CONSERVATION_COVENANT_INDIVIDUAL_ORGANISATION if yes is chosen', async () => {
      postOptions.payload.anyOtherLOValue = 'yes'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.LANDOWNER_CONSERVATION_COVENANT_INDIVIDUAL_ORGANISATION)
    })

    it('Should continue journey to HABITAT_PLAN_LEGAL_AGREEMENT if no is chosen', async () => {
      postOptions.payload.anyOtherLOValue = 'no'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.HABITAT_PLAN_LEGAL_AGREEMENT)
    })

    it('Should fail journey if no answer', async () => {
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Select yes if there are any other landowners or leaseholders')
    })
  })
})
