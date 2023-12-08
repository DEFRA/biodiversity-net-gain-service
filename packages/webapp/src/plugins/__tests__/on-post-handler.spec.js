import { submitPostRequest } from '../../routes/__tests__/helpers/server.js'
import constants from '../../utils/constants.js'
import testApplication from '../../__mock-data__/test-application.js'

describe('on-post-handler', () => {
  it('Should not cache organisation ID if already set', async () => {
    // Just need a random route that stores data to session to trigger necessary code
    const postOptions = {
      url: constants.routes.ADD_HECTARES,
      auth: {
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
              relationships: ['mock relationship id:mock-org-id:mock-org-name:0:Citizen:0'],
              roles: ['mock relationship id:Standard User:2']
            }
          }
        }
      },
      payload: {
        hectares: '1'
      }
    }
    const application = JSON.parse(testApplication.dataString)
    application['organisation-id'] = 'mock-organisation-id'
    const response = await submitPostRequest(postOptions, 302, application)
    // expect organisation-id to not have changed
    expect(response.request.yar._store['organisation-id']).toEqual('mock-organisation-id')
  })
  it('Should cache organisation ID if not already set', async () => {
    // Just need a random route that stores data to session to trigger necessary code
    const postOptions = {
      url: constants.routes.ADD_HECTARES,
      auth: {
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
              relationships: ['mock relationship id:mock-org-id:mock-org-name:0:Citizen:0'],
              roles: ['mock relationship id:Standard User:2']
            }
          }
        }
      },
      payload: {
        hectares: '1'
      }
    }
    const application = JSON.parse(testApplication.dataString)
    delete application['organisation-id']
    const response = await submitPostRequest(postOptions, 302, application)
    expect(response.request.yar._store['organisation-id']).toEqual('mock-org-id')
  })
})
