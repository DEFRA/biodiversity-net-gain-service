import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.START_REGISTER_GAIN_SITE
const postOptions = {
  url,
  payload: {}
}

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    it('Should redirect to biodiversity gain sites if registration is selected', async () => {
      postOptions.payload.applicationType = 'registration'
      const response = await submitPostRequest(postOptions)
      expect(response.request.response.headers.location).toBe(constants.routes.BIODIVERSITY_GAIN_SITES)
    })

    it('Should redirect to combined case projects if allocation is selected', async () => {
      postOptions.payload.applicationType = 'combined-case'
      const response = await submitPostRequest(postOptions)
      expect(response.request.response.headers.location).toBe(constants.routes.COMBINED_CASE_PROJECTS)
    })

    it('Should return view with error if nothing is selected', async () => {
      postOptions.payload.applicationType = null
      const response = await submitPostRequest(postOptions, 200)
      expect(response.payload).toContain('Select an option to continue')
    })
  })
})
