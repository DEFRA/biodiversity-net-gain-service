import { getContext } from '../../.jest/setup.js'
import { randomUUID } from 'crypto'
import sendExpiringApplicationSessionNotification from '../index.mjs'

jest.mock('../../Shared/db-queries.js')
jest.mock('../../Shared/process-application-session-notification-message.js')
jest.mock('notifications-node-client')

describe('Sending a notification for an expiring application session', () => {
  it('Should delegate to a shared notification processing function ', async () => {
    const processApplicationSessionNotificationMessage = require('../../Shared/process-application-session-notification-message.js')
    const dbQueries = require('../../Shared/db-queries.js')
    jest.spyOn(processApplicationSessionNotificationMessage, 'default')
    jest.spyOn(dbQueries, 'recordExpiringApplicationSessionNotification')

    const mockMessage = {
      id: randomUUID(),
      notificationType: 'email'
    }

    await sendExpiringApplicationSessionNotification(getContext(), mockMessage)
    expect(processApplicationSessionNotificationMessage.default).toHaveBeenCalledTimes(1)
    expect(dbQueries.recordExpiringApplicationSessionNotification).toHaveBeenCalledTimes(1)
  })
})
