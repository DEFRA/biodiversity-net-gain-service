import wreck from '@hapi/wreck'
import getWithAuth, { resetTokenCache } from '../get-with-auth.js'
import { BACKEND_API } from '../config'

jest.mock('@hapi/wreck')

describe('getWithAuth', () => {
  const mockUrl = 'https://mock-url.com/api/data'

  beforeEach(() => {
    jest.clearAllMocks()
    resetTokenCache()
  })

  it("should reuse the cached token if it hasn't expired", async () => {
    BACKEND_API.USE_OAUTH = true

    resetTokenCache({
      token: 'cached-token',
      expiration: Math.floor(Date.now() / 1000) + 3600
    })

    wreck.get.mockImplementation(() => {
      return Promise.resolve({
        payload: { data: 'mock-data' }
      })
    })

    const result = await getWithAuth(mockUrl)

    expect(wreck.post).not.toHaveBeenCalled()
    expect(wreck.get).toHaveBeenCalledWith(mockUrl, expect.objectContaining({
      headers: expect.objectContaining({
        Authorization: 'Bearer cached-token'
      })
    }))
    expect(result).toEqual({ data: 'mock-data' })
  })

  it('should fetch a new token if none is cached', async () => {
    BACKEND_API.USE_OAUTH = true

    const mockToken = 'new-token'
    wreck.post.mockImplementation(() => {
      return Promise.resolve({
        payload: {
          access_token: mockToken,
          expires_in: 3600
        }
      })
    })

    wreck.get.mockImplementation(() => {
      return Promise.resolve({
        payload: { data: 'mock-data' }
      })
    })

    const result = await getWithAuth(mockUrl)

    expect(wreck.post).toHaveBeenCalled()
    expect(wreck.get).toHaveBeenCalledWith(mockUrl, expect.objectContaining({
      headers: expect.objectContaining({
        Authorization: `Bearer ${mockToken}`
      })
    }))
    expect(result).toEqual({ data: 'mock-data' })
  })

  it('should use subscription key header when USE_OAUTH is false', async () => {
    BACKEND_API.USE_OAUTH = false
    BACKEND_API.SUBSCRIPTION_KEY = 'mock-subscription-key'

    wreck.get.mockImplementation(() => {
      return Promise.resolve({
        payload: { data: 'mock-data' }
      })
    })

    await getWithAuth(mockUrl)

    expect(wreck.get).toHaveBeenCalledWith(mockUrl, expect.objectContaining({
      headers: expect.objectContaining({
        'Ocp-Apim-Subscription-Key': 'mock-subscription-key'
      })
    }))
  })
})
