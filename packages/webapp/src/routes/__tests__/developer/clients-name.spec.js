import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.DEVELOPER_CLIENTS_NAME

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

    it('Should continue journey if first and last name are provided for a client who is a landowner or leaseholder', async () => {
      const sessionData = {}
      sessionData[constants.redisKeys.DEVELOPER_LANDOWNER_OR_LEASEHOLDER] = constants.DEVELOPER_IS_LANDOWNER_OR_LEASEHOLDER.YES
      postOptions.payload.firstName = 'Tom'
      postOptions.payload.lastName = 'Smith'
      const res = await submitPostRequest(postOptions, 302, sessionData)
      expect(res.headers.location).toEqual(constants.routes.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION)
    })

    it('Should continue journey if first and last name are provided for a client who is not a landowner or leaseholder', async () => {
      const sessionData = {}
      sessionData[constants.redisKeys.DEVELOPER_LANDOWNER_OR_LEASEHOLDER] = constants.DEVELOPER_IS_LANDOWNER_OR_LEASEHOLDER.NO
      postOptions.payload.firstName = 'Tom'
      postOptions.payload.lastName = 'Smith'
      const res = await submitPostRequest(postOptions, 302, sessionData)
      expect(res.headers.location).toEqual(constants.routes.DEVELOPER_NEED_ADD_PERMISSION)
    })

    it('Should fail journey if no first name and no last name are provided', async () => {
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter first name')
      expect(res.payload).toContain('Enter last name')
    })

    it('Should fail journey if no first name is provided', async () => {
      postOptions.payload.lastName = 'Smith'

      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter first name')
    })

    it('Should fail journey if no last name is provided', async () => {
      postOptions.payload.firstName = 'Tom'

      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter last name')
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
      expect(res.payload).toContain('Enter last name')
    })
  })
})
