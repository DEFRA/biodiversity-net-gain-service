import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants'
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
    it('should stop journey if invalid date', async () => {
      postOptions.payload['managementMonitoringStartDate-day'] = '31'
      postOptions.payload['managementMonitoringStartDate-month'] = '11'
      postOptions.payload['managementMonitoringStartDate-year'] = '2022'
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Start date must be a real date')
    })
    it('should stop journey if invalid date', async () => {
      postOptions.payload['managementMonitoringStartDate-day'] = '29'
      postOptions.payload['managementMonitoringStartDate-month'] = '02'
      postOptions.payload['managementMonitoringStartDate-year'] = '2022'
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Start date must be a real date')
    })
    it('Tests date from session', done => {
      jest.isolateModules(async () => {
        try {
          let viewResult, contextResult
          const managementMonitoringStartDate = require('../../land/management-monitoring-start-date.js')
          const request = {
            yar: {
              get: () => new Date('2022-11-30').toISOString()
            },
            info: {
              referrer: ''
            }
          }
          const h = {
            view: (view, context) => {
              viewResult = view
              contextResult = context
            }
          }
          await managementMonitoringStartDate.default[0].handler(request, h)
          expect(viewResult).toEqual('land/management-monitoring-start-date')
          expect(contextResult.day).toEqual('30')
          expect(contextResult.month).toEqual('11')
          expect(contextResult.year).toEqual('2022')
          done()
        } catch (err) {
          done(err)
        }
      })
    })
    it('Date must be equal or later than habitat works start date', done => {
      jest.isolateModules(async () => {
        try {
          let viewResult, contextResult
          const managementMonitoringStartDate = require('../../land/management-monitoring-start-date')
          const redisMap = new Map()
          redisMap.set(constants.redisKeys.MANAGEMENT_PLAN_KEY, constants.routes.LEGAL_AGREEMENT_SUMMARY)
          const request = {
            yar: {
              get: () => new Date('2022-12-02').toISOString()
            },
            payload: {
              'managementMonitoringStartDate-day': '01',
              'managementMonitoringStartDate-month': '12',
              'managementMonitoringStartDate-year': '2022'
            }
          }
          const h = {
            view: (view, context) => {
              viewResult = view
              contextResult = context
            }
          }
          await managementMonitoringStartDate.default[1].handler(request, h)
          expect(viewResult).toEqual('land/management-monitoring-start-date')
          expect(contextResult.err[0].text).toEqual('Start date of the 30 year management and monitoring period must be the same as or after the date the habitat enhancement works begin')
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
