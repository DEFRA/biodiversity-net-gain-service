import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.CLIENTS_NAME

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

    it('Should continue journey if first and last name are provided', async () => {
      postOptions.payload.firstName = 'Tom'
      postOptions.payload.lastName = 'Smith'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.IS_ADDRESS_UK)
    })

    it('Should fail journey if no first name and no last name are provided', async () => {
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter the first name of the landowner or leaseholder')
      expect(res.payload).toContain('Enter the last name of the landowner or leaseholder')
    })

    it('Should fail journey if no first name is provided', async () => {
      postOptions.payload.lastName = 'Smith'

      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter the first name of the landowner or leaseholder')
    })

    it('Should fail journey if no last name is provided', async () => {
      postOptions.payload.firstName = 'Tom'

      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter the last name of the landowner or leaseholder')
    })

    it('Should fail journey if first name is over 50 characters', async () => {
      postOptions.payload.firstName = 'SmithSmithSmithSmithSmithSmithSmithSmithSmithSmithSmith'
      postOptions.payload.lastName = 'Smith'

      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('First name must be 50 characters or fewer')
    })

    it('Should fail journey if first name is over 50 characters and last name is empty', async () => {
      postOptions.payload.firstName = 'SmithSmithSmithSmithSmithSmithSmithSmithSmithSmithSmith'

      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('First name must be 50 characters or fewer')
      expect(res.payload).toContain('Enter the last name of the landowner or leaseholder')
    })
  })
})
