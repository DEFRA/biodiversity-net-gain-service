import { post } from '../../gov-pay-api/base.js'
import { PAYMENT_API_KEY, PAYMENT_API_URL } from '../../../utils/config.js'
import createPayment from '../../gov-pay-api/payment-create.js'

jest.mock('../../gov-pay-api/base.js')

describe('createPayment', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call post with the correct URL, data, and token', async () => {
    const payload = {
      amount: 100,
      reference: 'payment_reference',
      description: 'Payment for goods',
      cardholder_name: 'John Doe',
      email: 'john.doe@example.com',
      return_url: 'http://example.com/payment-return'
    }
    const expectedPayment = {
      amount: payload.amount,
      reference: payload.reference,
      description: payload.description,
      prefilled_cardholder_details: {
        cardholder_name: payload.cardholder_name
      },
      email: payload.email,
      return_url: payload.return_url,
      language: 'en'
    }
    const responseData = { success: true }

    post.mockResolvedValue(responseData)

    await createPayment(payload)

    expect(post).toHaveBeenCalledWith(PAYMENT_API_URL, expectedPayment, PAYMENT_API_KEY)
  })

  it('should return the response from post', async () => {
    const payload = {
      amount: 100,
      reference: 'payment_reference',
      description: 'Payment for goods',
      cardholder_name: 'John Doe',
      email: 'john.doe@example.com',
      return_url: 'http://example.com/payment-return'
    }
    const responseData = { success: true }

    post.mockResolvedValue(responseData)

    const result = await createPayment(payload)

    expect(result).toEqual(responseData)
  })

  it('should throw error if post fails', async () => {
    const payload = {
      amount: 100,
      reference: 'payment_reference',
      description: 'Payment for goods',
      cardholder_name: 'John Doe',
      email: 'john.doe@example.com',
      return_url: 'http://example.com/payment-return'
    }
    const errorMessage = 'Failed to create payment'

    post.mockRejectedValue(new Error(errorMessage))

    await expect(createPayment(payload)).rejects.toThrow(errorMessage)
  })
})
