import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.CHECK_DEFRA_ACCOUNT_DETAILS

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
    it('Should continue the journey when acting as an agent and Defra account details are confirmed', async () => {
      postOptions.payload.defraAccountDetailsConfirmed = 'true'
      const sessionData = {}
      sessionData[constants.redisKeys.APPLICATION_TYPE] = constants.applicationTypes.REGISTRATION
      sessionData[constants.redisKeys.IS_AGENT] = constants.APPLICANT_IS_AGENT.YES
      const res = await submitPostRequest(postOptions, 302, sessionData)
      expect(res.headers.location).toEqual(constants.routes.CLIENT_INDIVIDUAL_ORGANISATION)
    })
    it('Should continue the journey when not acting as an agent and Defra account details are confirmed', async () => {
      postOptions.auth = {
        strategy: 'session-auth',
        credentials: {
          account: {
            idTokenClaims: {
              firstName: 'John',
              lastName: 'Smith',
              email: 'john.smith@test.com',
              contactId: 'mock contact id',
              enrolmentCount: 1,
              currentRelationshipId: 'mock relationship id',
              relationships: ['mock relationship id:mock organisation id:mock organisation:0:Employee:0'],
              roles: ['mock relationship id:Standard User:3']
            }
          }
        }
      }
      postOptions.payload.defraAccountDetailsConfirmed = 'true'
      const sessionData = {}
      sessionData[constants.redisKeys.APPLICATION_TYPE] = constants.applicationTypes.REGISTRATION
      sessionData[constants.redisKeys.IS_AGENT] = constants.APPLICANT_IS_AGENT.NO
      const res = await submitPostRequest(postOptions, 302, sessionData)
      expect(res.headers.location).toEqual(constants.routes.IS_ADDRESS_UK)
    })
    it('Should stop the journey when Defra account details are unconfirmed', async () => {
      const sessionData = {}
      sessionData[constants.redisKeys.APPLICATION_TYPE] = constants.applicationTypes.REGISTRATION
      const res = await submitPostRequest(postOptions, 200, sessionData)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('You must confirm your Defra account details are up to date')
    })
  })
})
