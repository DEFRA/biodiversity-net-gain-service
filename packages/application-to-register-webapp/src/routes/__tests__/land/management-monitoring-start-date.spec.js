import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
const url = '/land/management-monitoring-start-date'

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })
  describe('POST', () => {
    let postOptions
    beforeEach(() => {
      postOptions = {
        url,
        payload: {}
      }
    })
    it('should continue journey if valid date is entered', async () => {
      postOptions.payload['managementMonitoringStartDate-day'] = '01'
      postOptions.payload['managementMonitoringStartDate-month'] = '01'
      postOptions.payload['managementMonitoringStartDate-year'] = '2020'
      await submitPostRequest(postOptions)
    })
    it('should stop journey if missing date', async () => {
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter the date the 30 year management and monitoring period will start')
    })
    it('should stop journey if missing day', async () => {
      postOptions.payload['managementMonitoringStartDate-day'] = ''
      postOptions.payload['managementMonitoringStartDate-month'] = '01'
      postOptions.payload['managementMonitoringStartDate-year'] = '2020'
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Start date must include a day')
    })
    it('should stop journey if missing month', async () => {
      postOptions.payload['managementMonitoringStartDate-day'] = '01'
      postOptions.payload['managementMonitoringStartDate-month'] = ''
      postOptions.payload['managementMonitoringStartDate-year'] = '2020'
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Start date must include a month')
    })
    it('should stop journey if missing year', async () => {
      postOptions.payload['managementMonitoringStartDate-day'] = '01'
      postOptions.payload['managementMonitoringStartDate-month'] = '01'
      postOptions.payload['managementMonitoringStartDate-year'] = ''
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Start date must include a year')
    })
    it('should stop journey if invalid date', async () => {
      postOptions.payload['managementMonitoringStartDate-day'] = '40'
      postOptions.payload['managementMonitoringStartDate-month'] = '01'
      postOptions.payload['managementMonitoringStartDate-year'] = '2020'
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Start date must be a real date')
    })
  })
})
