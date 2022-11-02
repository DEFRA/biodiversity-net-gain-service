import { getContext } from '../../.jest/setup.js'
import signalRNegotiate from '../index.mjs'

describe('SignalR Negotiation', () => {
  it('should add connection information to the HTTP response body', async () => {
    const mockConnectionInfo = { mock: 'connectionInfo' }
    await signalRNegotiate(getContext(), {}, mockConnectionInfo)
    // The upload function should have been called after the upload function has been removed from the configuration.
    expect(getContext().res.body).toStrictEqual(mockConnectionInfo)
  })
})
