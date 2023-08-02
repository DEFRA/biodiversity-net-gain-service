import { randomUUID } from 'crypto'
import saveApplicationSession from '../index.mjs'
import { getContext } from '../../.jest/setup.js'

jest.mock('@defra/bng-connectors-lib')
jest.mock('../../Shared/db-queries.js')

const req = {
  body: {
    'email-value': 'test@test.com',
    'application-reference': ''
  }
}

const gainSiteReference = 'BNGREG-JDSJ3-A4LI9'

describe('Save Application Session', () => {
  it('Should Save a valid request\'s session with email, and generate a reference', done => {
    jest.isolateModules(async () => {
      try {
        const applicationSessionId = randomUUID()

        const expectedNotificationMessage = {
          id: applicationSessionId,
          notificationType: 'email'
        }

        const dbQueries = require('../../Shared/db-queries.js')
        dbQueries.createApplicationReference = jest.fn().mockImplementation(() => {
          return {
            rows: [
              {
                fn_create_application_reference: gainSiteReference
              }
            ]
          }
        })
        dbQueries.saveApplicationSession = jest.fn().mockImplementation(() => {
          return {
            rows: [
              {
                application_session_id: applicationSessionId
              }
            ]
          }
        })
        await saveApplicationSession(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(200)
        expect(context.res.body).toEqual(`"${gainSiteReference}"`)
        expect(dbQueries.createApplicationReference.mock.calls).toHaveLength(1)
        expect(dbQueries.saveApplicationSession.mock.calls).toHaveLength(1)
        expect(context.bindings.savedApplicationSessionNotificationQueue).toStrictEqual(expectedNotificationMessage)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('Should save a valid session with email and reference and send a notification', done => {
    jest.isolateModules(async () => {
      try {
        req.body['application-reference'] = gainSiteReference
        const dbQueries = require('../../Shared/db-queries.js')
        const applicationSessionId = randomUUID()

        const expectedNotificationMessage = {
          id: applicationSessionId,
          notificationType: 'email'
        }
        dbQueries.saveApplicationSession = jest.fn().mockImplementation(() => {
          return {
            rows: [
              {
                application_session_id: applicationSessionId
              }
            ]
          }
        })
        await saveApplicationSession(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(200)
        expect(context.res.body).toEqual(`"${gainSiteReference}"`)
        expect(dbQueries.createApplicationReference.mock.calls).toHaveLength(0)
        expect(dbQueries.saveApplicationSession.mock.calls).toHaveLength(1)
        expect(context.bindings.savedApplicationSessionNotificationQueue).toStrictEqual(expectedNotificationMessage)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('Should fail to save a request if email is missing, do no db queries and not send a notificaton', done => {
    jest.isolateModules(async () => {
      try {
        req.body['email-value'] = ''
        const dbQueries = require('../../Shared/db-queries.js')
        await saveApplicationSession(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(400)
        expect(dbQueries.createApplicationReference.mock.calls).toHaveLength(0)
        expect(dbQueries.saveApplicationSession.mock.calls).toHaveLength(0)
        expect(context.bindings.savedApplicationSessionNotificationQueue).toBeUndefined()
        done()
      } catch (err) {
        done(err)
      }
    })
  })
})
