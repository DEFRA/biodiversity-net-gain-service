import { post } from '../../gov-pay-api/base.js'
const { PAYMENT_API_URL, PAYMENT_API_KEY } = require('../../../utils/config.js')
const cancelPayment = require('../../gov-pay-api/payment-cancel.js')

jest.mock('../../gov-pay-api/base.js')

describe('cancelPayment', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call post with the correct URL, data, and token', async () => {
    const id = 'paymentId'
    const expectedUrl = `${PAYMENT_API_URL}/${id}/cancel`
    const expectedData = {}
    const expectedToken = PAYMENT_API_KEY
    const responseData = { success: true }

    post.mockResolvedValue(responseData)

    await cancelPayment(id)

    expect(post).toHaveBeenCalledWith(expectedUrl, expectedData, expectedToken)
  })

  it('should return the response from post', async () => {
    const id = 'paymentId'
    const responseData = { success: true }

    post.mockResolvedValue(responseData)

    const result = await cancelPayment(id)

    expect(result).toEqual(responseData)
  })

  it('should throw error if post fails', async () => {
    const id = 'paymentId'
    const errorMessage = 'Failed to cancel payment'

    post.mockRejectedValue(new Error(errorMessage))

    await expect(cancelPayment(id)).rejects.toThrow(errorMessage)
  })
})
