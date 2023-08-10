import { randomUUID } from 'crypto'
import saveApplicationSession from '../index.mjs'
import { getContext } from '../../.jest/setup.js'

jest.mock('@defra/bng-connectors-lib')
jest.mock('../../Shared/db-queries.js')

const gainSiteReference = 'BNGREG-JDSJ3-A4LI9'

describe('Save Application Session', () => {
  it('Should generate a registration reference and notification when notifications are enabled and a valid request\'s session is saved using a contact ID and application type', done => {
    jest.isolateModules(async () => {
      process.env.SEND_NOTIFICATION_WHEN_APPLICATION_SESSION_SAVED = 'true'
      try {
        const applicationSessionId = randomUUID()

        const req = {
          body: {
            'contact-id': 'mock-contact-id',
            'application-type': 'Registration',
            'application-reference': ''
          }
        }

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
  it('Should save a valid session with contact ID, application type and reference. A notification should not be sent by default', done => {
    jest.isolateModules(async () => {
      try {
        const req = {
          body: {
            'contact-id': 'mock-contact-id',
            'application-type': 'Registration',
            'application-reference': ''
          }
        }
        req.body['application-reference'] = gainSiteReference
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
        expect(context.res.body).toEqual(`"${gainSiteReference}"`)
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
        const req = {
          body: {
            'application-type': 'Registration',
            'application-reference': ''
          }
        }
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
        const req = {
          body: {
            'contact-id': 'mock-contact-id',
            'application-reference': ''
          }
        }
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
it('Should generate an allocation reference and notification when notifications are enabled and a valid request\'s session is saved using a contact ID and application type', done => {
  jest.isolateModules(async () => {
    process.env.SEND_NOTIFICATION_WHEN_APPLICATION_SESSION_SAVED = 'true'
    try {
      const applicationSessionId = randomUUID()

      const req = {
        body: {
          'contact-id': 'mock-contact-id',
          'application-type': 'Allocation',
          'application-reference': ''
        }
      }

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
