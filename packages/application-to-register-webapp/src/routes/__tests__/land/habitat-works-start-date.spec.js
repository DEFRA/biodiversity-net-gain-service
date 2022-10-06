import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
const url = '/land/habitat-works-start-date'

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
      postOptions.payload['habitatWorksStartDate-day'] = '01'
      postOptions.payload['habitatWorksStartDate-month'] = '01'
      postOptions.payload['habitatWorksStartDate-year'] = '2020'
      await submitPostRequest(postOptions)
    })
    it('should stop journey if missing date', async () => {
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter the start date of the habitat enhancement works')
    })
    it('should stop journey if missing day', async () => {
      postOptions.payload['habitatWorksStartDate-day'] = ''
      postOptions.payload['habitatWorksStartDate-month'] = '01'
      postOptions.payload['habitatWorksStartDate-year'] = '2020'
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Start date must include a day')
    })
    it('should stop journey if missing month', async () => {
      postOptions.payload['habitatWorksStartDate-day'] = '01'
      postOptions.payload['habitatWorksStartDate-month'] = ''
      postOptions.payload['habitatWorksStartDate-year'] = '2020'
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Start date must include a month')
    })
    it('should stop journey if missing year', async () => {
      postOptions.payload['habitatWorksStartDate-day'] = '01'
      postOptions.payload['habitatWorksStartDate-month'] = '01'
      postOptions.payload['habitatWorksStartDate-year'] = ''
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Start date must include a year')
    })
    it('should stop journey if invalid date', async () => {
      postOptions.payload['habitatWorksStartDate-day'] = '40'
      postOptions.payload['habitatWorksStartDate-month'] = '01'
      postOptions.payload['habitatWorksStartDate-year'] = '2020'
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Start date must be a real date')
    })
    it('should stop journey if invalid date', async () => {
      postOptions.payload['habitatWorksStartDate-day'] = '31'
      postOptions.payload['habitatWorksStartDate-month'] = '11'
      postOptions.payload['habitatWorksStartDate-year'] = '2022'
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Start date must be a real date')
    })
    it('should stop journey if invalid date', async () => {
      postOptions.payload['habitatWorksStartDate-day'] = '29'
      postOptions.payload['habitatWorksStartDate-month'] = '02'
      postOptions.payload['habitatWorksStartDate-year'] = '2022'
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Start date must be a real date')
    })
    it('Tests date from session', async () => {
      jest.isolateModules(async () => {
        let viewResult, contextResult
        const habitatWorksStartDate = require('../../land/habitat-works-start-date.js')
        const request = {
          yar: {
            get: () => new Date('2022-11-30').toISOString()
          }
        }
        const h = {
          view: (view, context) => {
            viewResult = view
            contextResult = context
          }
        }
        await habitatWorksStartDate.default[0].handler(request, h)
        expect(viewResult).toEqual('land/habitat-works-start-date')
        expect(contextResult.day).toEqual(30)
        expect(contextResult.month).toEqual(11)
        expect(contextResult.year).toEqual(2022)
      })
    })
  })
})
