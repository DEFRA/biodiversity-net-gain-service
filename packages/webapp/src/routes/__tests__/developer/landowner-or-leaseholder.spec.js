import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.DEVELOPER_LANDOWNER_OR_LEASEHOLDER

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view when acting on behalf of a client`, async () => {
      const sessionData = {}
      sessionData[constants.redisKeys.DEVELOPER_IS_AGENT] = constants.APPLICANT_IS_AGENT.YES
      const response = await submitGetRequest({ url }, 200, sessionData)
      expect(response.payload).toContain('Is your client the landowner or leaseholder?')
    })
    it(`should render the ${url.substring(1)} view when not acting on behalf of a client`, async () => {
      const sessionData = {}
      sessionData[constants.redisKeys.DEVELOPER_IS_AGENT] = constants.APPLICANT_IS_AGENT.NO
      const response = await submitGetRequest({ url }, 200, sessionData)
      expect(response.payload).toContain('Are you the landowner or leaseholder?')
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
    it('Should redirect to client-individual-organisation when acting on behalf of a client and yes is selected', async () => {
      const sessionData = {}
      sessionData[constants.redisKeys.DEVELOPER_IS_AGENT] = constants.APPLICANT_IS_AGENT.YES
      postOptions.payload.landownerOrLeaseholder = constants.DEVELOPER_IS_LANDOWNER_OR_LEASEHOLDER.YES
      const response = await submitPostRequest(postOptions, 302, sessionData)
      expect(response.request.response.headers.location).toBe(constants.routes.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION)
    })
    it('Should redirect to client-individual-organisation when acting on behalf of a client and no is selected', async () => {
      const sessionData = {}
      sessionData[constants.redisKeys.DEVELOPER_IS_AGENT] = constants.APPLICANT_IS_AGENT.YES
      postOptions.payload.landownerOrLeaseholder = constants.DEVELOPER_IS_LANDOWNER_OR_LEASEHOLDER.NO
      const response = await submitPostRequest(postOptions, 302, sessionData)
      expect(response.request.response.headers.location).toBe(constants.routes.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION)
    })
    it('Should redirect to applying-individual-organisation when not acting on behalf of a client and yes is selected', async () => {
      const sessionData = {}
      sessionData[constants.redisKeys.DEVELOPER_IS_AGENT] = constants.APPLICANT_IS_AGENT.NO
      postOptions.payload.landownerOrLeaseholder = constants.DEVELOPER_IS_LANDOWNER_OR_LEASEHOLDER.YES
      const response = await submitPostRequest(postOptions, 302, sessionData)
      expect(response.request.response.headers.location).toBe(constants.routes.DEVELOPER_APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION)
    })
    it('Should redirect to applying-individual-organisation when not acting on behalf of a client and no is selected', async () => {
      const sessionData = {}
      sessionData[constants.redisKeys.DEVELOPER_IS_AGENT] = constants.APPLICANT_IS_AGENT.NO
      postOptions.payload.landownerOrLeaseholder = constants.DEVELOPER_IS_LANDOWNER_OR_LEASEHOLDER.NO
      const response = await submitPostRequest(postOptions, 302, sessionData)
      expect(response.request.response.headers.location).toBe(constants.routes.DEVELOPER_APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION)
    })
    it('Should return view with error if acting on behalf of a client and nothing is selected', async () => {
      const sessionData = {}
      sessionData[constants.redisKeys.DEVELOPER_IS_AGENT] = constants.APPLICANT_IS_AGENT.YES
      const response = await submitPostRequest(postOptions, 200, sessionData)
      expect(response.payload).toContain('Select yes if your client is the landowner or leaseholder')
    })
    it('Should return view with error if not acting on behalf of a client and nothing is selected', async () => {
      const sessionData = {}
      sessionData[constants.redisKeys.DEVELOPER_IS_AGENT] = constants.APPLICANT_IS_AGENT.NO
      const response = await submitPostRequest(postOptions, 200, sessionData)
      expect(response.payload).toContain('Select yes if you are the landowner or leaseholder')
    })
  })
})
