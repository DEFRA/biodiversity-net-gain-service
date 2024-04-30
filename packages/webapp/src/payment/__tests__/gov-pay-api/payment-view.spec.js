import { get } from '../../gov-pay-api/base.js'
const { PAYMENT_API_KEY, PAYMENT_API_URL } = require('../../../utils/config.js')
const viewPayments = require('../../gov-pay-api/payment-view.js')

jest.mock('../../gov-pay-api/base.js')

describe('viewPayments', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call get with the correct URL, query, and token', async () => {
    const query = 'status=success&limit=10'
    const expectedUrl = `${PAYMENT_API_URL}?${query}`

    // Mock the get function from the base.js module
    get.mockResolvedValue({ results: [] })

    // Call the viewPayments function
    await viewPayments(query)

    // Verify that get was called with the correct parameters
    expect(get).toHaveBeenCalledWith(expectedUrl, PAYMENT_API_KEY)
  })

  it('should format dates using moment', async () => {
    const query = 'status=success&limit=10'
    const mockResults = [
      { id: 1, created_date: '2022-01-01T12:00:00Z' },
      { id: 2, created_date: '2022-02-01T12:00:00Z' }
    ]
    const expectedFormattedDates = [
      { id: 1, created_date: '2022-01-01T12:00:00Z', date: '01-01-2022 12:00:00' },
      { id: 2, created_date: '2022-02-01T12:00:00Z', date: '01-02-2022 12:00:00' }
    ]

    get.mockResolvedValue({ results: mockResults })

    const result = await viewPayments(query)

    expect(result.results).toEqual(expectedFormattedDates)
  })

  it('should return the results from get with formatted dates', async () => {
    const query = 'status=success&limit=10'
    const mockResults = [
      { id: 1, created_date: '2022-01-01T12:00:00Z' },
      { id: 2, created_date: '2022-02-01T12:00:00Z' }
    ]

    get.mockResolvedValue({ results: mockResults })

    const result = await viewPayments(query)

    expect(result.results).toEqual([
      { id: 1, date: '01-01-2022 12:00:00', created_date: '2022-01-01T12:00:00Z' }, // moment is mocked to return input date
      { id: 2, date: '01-02-2022 12:00:00', created_date: '2022-02-01T12:00:00Z' } // moment is mocked to return input date
    ])
  })
})
