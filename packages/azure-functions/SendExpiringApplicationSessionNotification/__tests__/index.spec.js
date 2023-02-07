import { getContext } from '../../.jest/setup.js'
import { randomUUID } from 'crypto'
import sendExpiringApplicationSessionNotification from '../index.mjs'

jest.mock('../../Shared/process-application-session-notification-message.js')
jest.mock('notifications-node-client')

describe('Sending a notification for an expiring application session', () => {
  it('Should delegate to a shared notification processing function ', async () => {
    const processApplicationSessionNotificationMessage = require('../../Shared/process-application-session-notification-message.js')
    jest.spyOn(processApplicationSessionNotificationMessage, 'default')

    const mockMessage = {
      id: randomUUID(),
      notificationType: 'email'
    }

    await sendExpiringApplicationSessionNotification(getContext(), mockMessage)
    expect(processApplicationSessionNotificationMessage.default).toHaveBeenCalledTimes(1)
  })
})
