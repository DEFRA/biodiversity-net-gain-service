import { getContext } from '../../.jest/setup.js'
import { randomUUID } from 'crypto'
import sendSavedApplicationSessionNotification from '../index.mjs'

jest.mock('../../Shared/process-application-session-notification-message.js')
jest.mock('notifications-node-client')

describe('Sending a notification for a saved application session', () => {
  it('Should delegate to a shared notification processing function ', async () => {
    const processApplicationSessionNotificationMessage = require('../../Shared/process-application-session-notification-message.js')
    jest.spyOn(processApplicationSessionNotificationMessage, 'default')

    const mockMessage = {
      id: randomUUID(),
      notificationType: 'email'
    }

    await sendSavedApplicationSessionNotification(getContext(), mockMessage)
    expect(processApplicationSessionNotificationMessage.default).toHaveBeenCalledTimes(1)
  })
})
