import { addRedirectViewUsed } from '../redirect-view-handler.js'

describe('addRedirectViewUsed', () => {
  it('should set request.redirectViewUsed to true and call the handler', async () => {
    const request = {}
    const h = {}

    const mockHandler = jest.fn()
    const wrappedHandler = addRedirectViewUsed(mockHandler)

    await wrappedHandler(request, h)

    expect(request.redirectViewUsed).toBe(true)
    expect(mockHandler).toHaveBeenCalledWith(request, h)
  })

  it('should return the result of the handler', async () => {
    const request = {}
    const h = {}

    const response = 'foo bar response'
    const mockHandler = jest.fn().mockResolvedValue(response)
    const wrappedHandler = addRedirectViewUsed(mockHandler)

    const result = await wrappedHandler(request, h)
    expect(result).toBe(response)
  })
})
