import buildSignalRMessage from '../build-signalr-message'

const mockData = {
  mock: 'data'
}

const mockSignalRConfig = mockData
const mockSignalRArguments = [mockData]

describe('SignalR configuration and arguments', () => {
  it('should combine to produce a SignalR message', async () => {
    const expectedSignalRMessage = mockData
    expectedSignalRMessage.arguments = mockSignalRArguments

    const signalRMessage = buildSignalRMessage(mockSignalRConfig, mockSignalRArguments)
    expect(signalRMessage).toStrictEqual(expectedSignalRMessage)
  })
})
