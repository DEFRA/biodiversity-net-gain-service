import { randomUUID } from 'crypto'
import { getContext, getTimer } from '../../.jest/setup.js'
import getExpiringApplicationSessions from '../index.mjs'

jest.mock('@defra/bng-connectors-lib')
jest.mock('../../Shared/db-queries.js')

describe('Expiring application session functionality', () => {
  it('Should get a list of expiring application sessions and attempt to send a notification for each of them', async () => {
    const context = getContext()
    const timer = getTimer()
    const expectedOutgoingMessages = []
    const expiringApplicationSessions = [
      {
        application_session_id: randomUUID()
      },
      {
        application_session_id: randomUUID()
      }
    ]
    for (const expringApplicationSession of expiringApplicationSessions) {
      expectedOutgoingMessages.push({
        id: expringApplicationSession.application_session_id,
        notificationType: 'email'
      })
    }
    const dbQueries = require('../../Shared/db-queries.js')
    dbQueries.getExpiringApplicationSessions = jest.fn().mockImplementation(() => {
      return {
        rows: expiringApplicationSessions
      }
    })
    await getExpiringApplicationSessions(context, timer)
    expect(dbQueries.getExpiringApplicationSessions.mock.calls).toHaveLength(1)
    expect(context.bindings.expiringApplicationSessionNotificationQueue).toStrictEqual(expectedOutgoingMessages)
  })
  it('Should not attempt to send any notifications if no sessions are expiring', async () => {
    const context = getContext()
    const timer = getTimer()
    const expectedOutgoingMessages = []
    const dbQueries = require('../../Shared/db-queries.js')

    dbQueries.getExpiringApplicationSessions = jest.fn().mockImplementation(() => {
      return {
        rows: []
      }
    })
    await getExpiringApplicationSessions(context, timer)
    expect(dbQueries.getExpiringApplicationSessions.mock.calls).toHaveLength(1)
    expect(context.bindings.expiringApplicationSessionNotificationQueue).toStrictEqual(expectedOutgoingMessages)
  })
})
