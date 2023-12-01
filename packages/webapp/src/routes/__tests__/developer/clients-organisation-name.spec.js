import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'

const crypto = require('crypto')
const url = constants.routes.DEVELOPER_CLIENTS_ORGANISATION_NAME

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

    it('Should continue journey if org name is provided for a client who is a landowner or leaseholder', async () => {
      const sessionData = {}
      sessionData[constants.redisKeys.DEVELOPER_LANDOWNER_OR_LEASEHOLDER] = constants.DEVELOPER_IS_LANDOWNER_OR_LEASEHOLDER.YES
      postOptions.payload.organisationName = 'ABC Organisation'
      const res = await submitPostRequest(postOptions, 302, sessionData)
      expect(res.headers.location).toEqual(constants.routes.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION)
    })

    it('Should continue journey if org name is provided for a client who is not a landowner or leaseholder', async () => {
      const sessionData = {}
      sessionData[constants.redisKeys.DEVELOPER_LANDOWNER_OR_LEASEHOLDER] = constants.DEVELOPER_IS_LANDOWNER_OR_LEASEHOLDER.NO
      postOptions.payload.organisationName = 'ABC Organisation'
      const res = await submitPostRequest(postOptions, 302, sessionData)
      expect(res.headers.location).toEqual(constants.routes.DEVELOPER_NEED_ADD_PERMISSION)
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
