import { get, post } from '../../gov-pay-api/base.js'
import { formatDate } from '../../../utils/helpers.js'
import { PAYMENT_API_KEY, PAYMENT_API_URL } from '../../../utils/config.js'
import { viewPaymentRefunds, refundPayment } from '../../gov-pay-api/payment-refund.js'

jest.mock('../../gov-pay-api/base.js')
jest.mock('../../../utils/helpers.js')

describe('viewPaymentRefunds', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call get with the correct URL and token', async () => {
    const id = 'paymentId'
    const expectedUrl = `${PAYMENT_API_URL}/${id}/refunds`

    get.mockResolvedValue({ _embedded: { refunds: [] } })

    await viewPaymentRefunds(id)

    expect(get).toHaveBeenCalledWith(expectedUrl, PAYMENT_API_KEY)
  })

  it('should call formatDate with the correct parameters', async () => {
    const id = 'paymentId'
    const refundResponse = { _embedded: { refunds: [{ created_date: '2022-01-01T12:00:00Z' }] } }

    get.mockResolvedValue(refundResponse)

    await viewPaymentRefunds(id)

    expect(formatDate).toHaveBeenCalledWith(refundResponse._embedded.refunds, 'created_date')
  })

  it('should return the formatted refunds', async () => {
    const id = 'paymentId'
    const refundResponse = { _embedded: { refunds: [{ created_date: '2022-01-01T12:00:00Z' }] } }
    const formattedRefunds = [{ created_date: '01-01-2022' }]

    get.mockResolvedValue(refundResponse)

    formatDate.mockReturnValue(formattedRefunds)

    const result = await viewPaymentRefunds(id)

    expect(result).toEqual(formattedRefunds)
  })
})

describe('refundPayment', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call post with the correct URL, payload, and token', async () => {
    const id = 'paymentId'
    const refundAmount = '100'
    const refundAvailable = '50'
    const expectedUrl = `${PAYMENT_API_URL}/${id}/refunds`
    const expectedPayload = {
      amount: parseInt(refundAmount),
      refund_amount_available: parseInt(refundAvailable)
    }

    post.mockResolvedValue({})

    await refundPayment(id, refundAmount, refundAvailable)

    expect(post).toHaveBeenCalledWith(expectedUrl, expectedPayload, PAYMENT_API_KEY)
  })

  it('should return the response from post', async () => {
    const id = 'paymentId'
    const refundAmount = '100'
    const refundAvailable = '50'
    const responseData = { success: true }

    post.mockResolvedValue(responseData)

    const result = await refundPayment(id, refundAmount, refundAvailable)

    expect(result).toEqual(responseData)
  })
})
