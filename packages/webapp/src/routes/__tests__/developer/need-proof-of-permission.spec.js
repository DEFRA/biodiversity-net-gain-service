import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.DEVELOPER_NEED_PROOF_OF_PERMISSION

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view with details for an individual`, async () => {
      const mockIndividualClientName = {
        type: 'individual',
        value: {
          firstName: 'Some',
          middleNames: '',
          lastName: 'Individual'
        }
      }
      const sessionData = {}
      sessionData[constants.redisKeys.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION] = constants.individualOrOrganisationTypes.INDIVIDUAL
      sessionData[constants.redisKeys.DEVELOPER_CLIENTS_NAME] = mockIndividualClientName
      const response = await submitGetRequest({ url }, 200, sessionData)
      expect(response.payload).toContain(mockIndividualClientName.value.firstName + ' ' + mockIndividualClientName.value.lastName)
    })
    it(`should render the ${url.substring(1)} view with details for a client organisation`, async () => {
      const mockClientOrganisationName = 'Some Organisation'
      const sessionData = {}
      sessionData[constants.redisKeys.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION] = constants.individualOrOrganisationTypes.ORGANISATION
      sessionData[constants.redisKeys.DEVELOPER_CLIENTS_ORGANISATION_NAME] = mockClientOrganisationName
      const response = await submitGetRequest({ url }, 200, sessionData)
      expect(response.payload).toContain(mockClientOrganisationName)
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
    it('Should continue journey to DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION on continue', async () => {
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION)
    })
  })
})
