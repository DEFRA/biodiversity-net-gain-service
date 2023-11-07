import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'

const crypto = require('crypto')
const url = constants.routes.CLIENTS_ORGANISATION_NAME

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

    it('Should continue journey if org name is provided', async () => {
      postOptions.payload.organisationName = 'ABC Organisation'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual('land/isAddressUK')
    })

    it('Should fail journey if no org name is provided', async () => {
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter the organisation name')
    })

    it('Should fail journey if org name is greater than 50 characters', async () => {
      const result = crypto.randomBytes(51).toString('hex')
      postOptions.payload.organisationName = result

      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Organisation name must be 50 characters or fewer')
    })
  })
})
