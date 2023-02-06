import { getContext } from '../../.jest/setup.js'
import processApplicationSessionNotificationMessage from '../process-application-session-notification-message.js'
import { randomUUID } from 'crypto'

jest.mock('../db-queries.js')
jest.mock('../send-email.js')
jest.mock('notifications-node-client')

describe('Message processing for application session notifications', () => {
  it('Should cause an attemot to send a notification for a valid application session using a supported transport', done => {
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
})
