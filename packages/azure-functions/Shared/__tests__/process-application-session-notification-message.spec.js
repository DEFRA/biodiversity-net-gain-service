import { getContext } from '../../.jest/setup.js'
import processApplicationSessionNotificationMessage from '../process-application-session-notification-message.js'
import { randomUUID } from 'crypto'

jest.mock('../db-queries.js')
jest.mock('../send-email.js')
jest.mock('notifications-node-client')

describe('Message processing for application session notifications', () => {
  it('Should cause an attempt to send a notification for a valid application session using a supported transport', done => {
    jest.isolateModules(async () => {
      const dbQueries = require('../../Shared/db-queries.js')
      const sendEmail = require('../send-email.js')
      jest.spyOn(sendEmail, 'default')

      process.env.CONTINUE_REGISTRATION_URL = 'mockURL'

      dbQueries.getApplicationSessionById = jest.fn().mockImplementation(() => {
        const applicationSession = {
          fullname: 'mockFullName',
          applicationReference: 'mockRegNumber'
        }
        applicationSession['email-value'] = 'mockEmailAddress'
        return {
          rows: [
            {
              application_session: applicationSession
            }
          ]
        }
      })

      try {
        const context = getContext()

        const config = {
          message: {
            id: randomUUID(),
            notificationType: 'email'
          },
          templateIds: {
            email: 'mockTemplateId'
          }
        }

        await processApplicationSessionNotificationMessage(context, config)
        expect(sendEmail.default).toHaveBeenCalledTimes(1)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('Should not attempt to send a notification for a valid application session using an unsupported transport', done => {
    jest.isolateModules(async () => {
      const dbQueries = require('../../Shared/db-queries.js')
      jest.spyOn(dbQueries, 'getApplicationSessionById')

      try {
        const context = getContext()

        const config = {
          message: {
            id: randomUUID(),
            notificationType: 'sms'
          },
          templateIds: {
            sms: 'mockTemplateId'
          }
        }

        await processApplicationSessionNotificationMessage(context, config)
        expect(dbQueries.getApplicationSessionById).toHaveBeenCalledTimes(0)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('Should ignore an unexpected message', done => {
    jest.isolateModules(async () => {
      const dbQueries = require('../../Shared/db-queries.js')
      const sendEmail = require('../send-email.js')
      jest.spyOn(dbQueries, 'getApplicationSessionById')
      jest.spyOn(sendEmail, 'default')

      try {
        const context = getContext()

        const config = {
          message: {
            id: randomUUID()
          },
          templateIds: {
            email: 'mockTemplateId'
          }
        }

        await processApplicationSessionNotificationMessage(context, config)
        expect(dbQueries.getApplicationSessionById).toHaveBeenCalledTimes(0)
        expect(sendEmail.default).toHaveBeenCalledTimes(0)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('Should ignore a message associated with an unknown application session', done => {
    jest.isolateModules(async () => {
      const dbQueries = require('../../Shared/db-queries.js')
      const sendEmail = require('../send-email.js')
      jest.spyOn(sendEmail, 'default')

      dbQueries.getApplicationSessionById = jest.fn().mockImplementation(() => {})

      try {
        const context = getContext()

        const config = {
          message: {
            id: randomUUID(),
            notificationType: 'email'
          },
          templateIds: {
            email: 'mockTemplateId'
          }
        }
        await processApplicationSessionNotificationMessage(context, config)
        expect(dbQueries.getApplicationSessionById).toHaveBeenCalledTimes(1)
        expect(sendEmail.default).toHaveBeenCalledTimes(0)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('Should propagate a general error thrown when attempting application session retrieval', done => {
    jest.isolateModules(async () => {
      const dbQueries = require('../../Shared/db-queries.js')
      const sendEmail = require('../send-email.js')
      jest.spyOn(dbQueries, 'getApplicationSessionById')
      jest.spyOn(sendEmail, 'default')

      process.env.CONTINUE_REGISTRATION_URL = 'mockURL'

      const expectedError = new Error('Mock error message')
      dbQueries.getApplicationSessionById.mockRejectedValueOnce(expectedError)

      try {
        const context = getContext()

        const config = {
          message: {
            id: randomUUID(),
            notificationType: 'email'
          },
          templateIds: {
            email: 'mockTemplateId'
          }
        }

        await expect(processApplicationSessionNotificationMessage(context, config)).rejects.toEqual(expectedError)
        expect(dbQueries.getApplicationSessionById).toHaveBeenCalledTimes(1)
        expect(sendEmail.default).toHaveBeenCalledTimes(0)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
})
