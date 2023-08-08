import { randomUUID } from 'crypto'
import saveApplicationSession from '../index.mjs'
import { getContext } from '../../.jest/setup.js'

jest.mock('@defra/bng-connectors-lib')
jest.mock('../../Shared/db-queries.js')

const req = {
  body: {
    'contact-id': 'mock-contact-id',
    'application-type': 'Registration',
    'application-reference': ''
  }
}

describe('Save Application Session', () => {
  it('Should generate a reference and notification when notifications are enabled and a valid request\'s session is saved using a contact ID and application type', done => {
    jest.isolateModules(async () => {
      process.env.SEND_NOTIFICATION_WHEN_APPLICATION_SESSION_SAVED = 'true'
      try {
        const applicationReference = 'mock application reference'
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
                fn_create_application_reference: applicationReference
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
        expect(context.res.body).toEqual(`"${applicationReference}"`)
        expect(dbQueries.createApplicationReference.mock.calls).toHaveLength(1)
        expect(dbQueries.saveApplicationSession.mock.calls).toHaveLength(1)
        expect(context.bindings.savedApplicationSessionNotificationQueue).toStrictEqual(expectedNotificationMessage)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('Should save a valid session with contact ID, application type and reference. A notification should not be sent by default', done => {
    jest.isolateModules(async () => {
      try {
        const applicationReference = 'mock application reference'
        req.body['application-reference'] = applicationReference
        const dbQueries = require('../../Shared/db-queries.js')
        const applicationSessionId = randomUUID()

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
        expect(context.res.body).toEqual(`"${applicationReference}"`)
        expect(dbQueries.createApplicationReference.mock.calls).toHaveLength(0)
        expect(dbQueries.saveApplicationSession.mock.calls).toHaveLength(1)
        expect(context.bindings.savedApplicationSessionNotificationQueue).toBeUndefined()
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('Should fail to save a request if a contact ID is missing, do no db queries and not send a notificaton', done => {
    jest.isolateModules(async () => {
      try {
        req.body['contact-id'] = ''
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
  it('Should fail to save a request if an application type is missing, do no db queries and not send a notificaton', done => {
    jest.isolateModules(async () => {
      try {
        req.body['application-type'] = ''
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
