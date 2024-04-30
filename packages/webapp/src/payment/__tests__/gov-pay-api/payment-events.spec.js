import { get } from '../../gov-pay-api/base.js'
import { formatDate } from '../../../utils/helpers.js'
import { PAYMENT_API_KEY, PAYMENT_API_URL } from '../../../utils/config.js'
import paymentEvents from '../../gov-pay-api/payment-events.js'

jest.mock('../../gov-pay-api/base.js')
jest.mock('../../../utils/helpers.js')

describe('paymentEvents', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call get with the correct URL and token', async () => {
    const id = 'paymentId'
    const expectedUrl = `${PAYMENT_API_URL}/${id}/events`

    get.mockResolvedValue({})

    await paymentEvents(id)

    expect(get).toHaveBeenCalledWith(expectedUrl, PAYMENT_API_KEY)
  })

  it('should call formatDate with the correct parameters', async () => {
    const id = 'paymentId'
    const eventsResponse = { events: [{ updated: '2022-01-01T12:00:00Z' }] }

    get.mockResolvedValue(eventsResponse)

    await paymentEvents(id)

    expect(formatDate).toHaveBeenCalledWith(eventsResponse.events, 'updated')
  })

  it('should return the formatted events', async () => {
    const id = 'paymentId'
    const eventsResponse = { events: [{ updated: '2022-01-01T12:00:00Z' }] }
    const formattedEvents = [{ updated: '01-01-2022' }]

    get.mockResolvedValue(eventsResponse)

    formatDate.mockReturnValue(formattedEvents)

    const result = await paymentEvents(id)

    expect(result).toEqual(formattedEvents)
  })
})
