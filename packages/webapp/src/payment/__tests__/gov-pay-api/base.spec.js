import { get, post } from '../../gov-pay-api/base.js'

jest.mock('@hapi/wreck', () => ({
  __esModule: true,
  default: {
    defaults: jest.fn(),
    get: jest.fn(),
    post: jest.fn()
  }
}))

describe('get function', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch data successfully', async () => {
    const url = 'http://example.com'
    const token = 'yourToken'
    const responsePayload = { result: 'success' }

    require('@hapi/wreck').default.get.mockResolvedValue({ payload: responsePayload })

    const result = await get(url, token)

    expect(result).toEqual(responsePayload)
    expect(require('@hapi/wreck').default.get).toHaveBeenCalledWith(url, {
      headers: { Authorization: `Bearer ${token}` },
      json: true
    })
  })

  it('should throw error when fetching data fails', async () => {
    const url = 'http://example.com'
    const token = 'yourToken'
    const errorMessage = 'Failed to fetch data'

    require('@hapi/wreck').default.get.mockRejectedValue(new Error(errorMessage))

    await expect(get(url, token)).rejects.toThrow(`Error fetching data: ${errorMessage}`)
  })
})

describe('post function', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should post data successfully', async () => {
    const url = 'http://example.com'
    const token = 'yourToken'
    const data = { message: 'hello' }
    const responsePayload = { result: 'success' }

    require('@hapi/wreck').default.post.mockResolvedValue({ payload: responsePayload })

    const result = await post(url, data, token)

    expect(result).toEqual(responsePayload)
    expect(require('@hapi/wreck').default.post).toHaveBeenCalledWith(url, {
      payload: data,
      headers: { Authorization: `Bearer ${token}` },
      json: true
    })
  })

  it('should throw error when posting data fails', async () => {
    const url = 'http://example.com'
    const token = 'yourToken'
    const data = { message: 'hello' }
    const errorMessage = 'Failed to post data'

    require('@hapi/wreck').default.post.mockRejectedValue(new Error(errorMessage))

    await expect(post(url, data, token)).rejects.toThrow(`Error posting data: ${errorMessage}`)
  })
})
