import moment from 'moment'
import { get } from '../../gov-pay-api/base.js'
import { viewPaymentRefunds } from '../../gov-pay-api/payment-refund.js'
import paymentEvents from '../../gov-pay-api/payment-events.js'
import { PAYMENT_API_KEY, PAYMENT_API_URL } from '../../../utils/config.js'
import { paymentDetails, fullPaymentDetails } from '../../gov-pay-api/payment-details.js'

jest.mock('moment') // Mock the moment module
jest.mock('../../gov-pay-api/base.js')
jest.mock('../../gov-pay-api/payment-refund.js')
jest.mock('../../gov-pay-api/payment-events.js')

describe('paymentDetails', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call get with the correct URL and token', async () => {
    const id = 'paymentId'
    const expectedUrl = `${PAYMENT_API_URL}/${id}`

    get.mockResolvedValue({})

    await paymentDetails(id)

    expect(get).toHaveBeenCalledWith(expectedUrl, PAYMENT_API_KEY)
  })

  it('should return the response from get', async () => {
    const id = 'paymentId'
    const responseData = { success: true }

    get.mockResolvedValue(responseData)

    const result = await paymentDetails(id)

    expect(result).toEqual(responseData)
  })
})

describe('fullPaymentDetails', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call get, viewPaymentRefunds, and paymentEvents with the correct parameters', async () => {
    const id = 'paymentId'
    const paymentResponse = { created_date: '2022-01-01T12:00:00Z' }
    const formattedDate = '01-01-2022 12:00:00'
    const refundResponse = { refunds: [] }
    const eventsResponse = { events: [] }

    get.mockResolvedValue(paymentResponse)
    viewPaymentRefunds.mockResolvedValue(refundResponse)
    paymentEvents.mockResolvedValue(eventsResponse)
    moment.mockReturnValue({ format: jest.fn().mockReturnValue(formattedDate) })

    await fullPaymentDetails(id)

    expect(get).toHaveBeenCalledWith(`${PAYMENT_API_URL}/${id}`, PAYMENT_API_KEY)
    expect(viewPaymentRefunds).toHaveBeenCalledWith(id)
    expect(paymentEvents).toHaveBeenCalledWith(id)
  })

  it('should return the combined responses from get, viewPaymentRefunds, and paymentEvents', async () => {
    const id = 'paymentId'
    const paymentResponse = { created_date: '2022-01-01T12:00:00Z' }
    const refundResponse = { refunds: [] }
    const eventsResponse = { events: [] }

    get.mockResolvedValue(paymentResponse)
    viewPaymentRefunds.mockResolvedValue(refundResponse)
    paymentEvents.mockResolvedValue(eventsResponse)
    moment.mockReturnValue({ format: jest.fn().mockReturnValue('01-01-2022 12:00:00') })

    const result = await fullPaymentDetails(id)

    expect(result).toEqual({
      payment: { ...paymentResponse, date: '01-01-2022 12:00:00' },
      events: eventsResponse,
      refunds: refundResponse
    })
  })
})
