import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import creditsPurchaseConstants from '../../../utils/credits-purchase-constants.js'

const url = creditsPurchaseConstants.routes.CREDITS_PURCHASE_DATE_OF_BIRTH
const goodDay = '8'
const goodMonth = '11'
const goodYear = '1977'
const goodIsoDate = (new Date(goodYear, goodMonth - 1, goodDay)).toISOString()

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })

    it('should render the view with session data', async () => {
      const sessionData = {}
      sessionData[creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_DATE_OF_BIRTH] = goodIsoDate
      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).toContain(goodDay)
      expect(res.payload).toContain(goodMonth)
      expect(res.payload).toContain(goodYear)
    })

    it('should render the view with the correct error message when no date of birth is entered', async () => {
      const sessionData = {
        errors: [
          {
            text: 'Enter the date of birth, for example 31 3 1980',
            href: '#dob-day'
          }
        ]
      }

      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter the date of birth, for example 31 3 1980')
    })

    it('should render the view with the correct error message when user doesnt enter a day', async () => {
      const sessionData = {
        errors: [
          {
            text: 'Date of birth must include a day',
            href: '#dob-day'
          }
        ]
      }

      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Date of birth must include a day')
    })

    it('should render the view with the correct error message when user doesnt enter a month', async () => {
      const sessionData = {
        errors: [
          {
            text: 'Date of birth must include a month',
            href: '#dob-month'
          }
        ]
      }

      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Date of birth must include a month')
    })

    it('should render the view with the correct error message when user doesnt enter a year', async () => {
      const sessionData = {
        errors: [
          {
            text: 'Date of birth must include a year',
            href: '#dob-year'
          }
        ]
      }

      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Date of birth must include a year')
    })

    it('should render the view with the correct error message when user enters a day that isnt a number', async () => {
      const sessionData = {
        errors: [
          {
            text: 'Date of birth must be a real date',
            href: '#dob-day'
          }
        ]
      }

      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Date of birth must be a real date')
    })

    it('should render the view with the correct error message when user enters a month that isnt a number', async () => {
      const sessionData = {
        errors: [
          {
            text: 'Date of birth must be a real date',
            href: '#dob-month'
          }
        ]
      }

      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Date of birth must be a real date')
    })

    it('should render the view with the correct error message when user enters a year that isnt a number', async () => {
      const sessionData = {
        errors: [
          {
            text: 'Date of birth must be a real date',
            href: '#dob-year'
          }
        ]
      }

      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Date of birth must be a real date')
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

    it('Should continue journey if user enters valid date of birth', async () => {
      postOptions.payload['dob-day'] = goodDay
      postOptions.payload['dob-month'] = goodMonth
      postOptions.payload['dob-year'] = goodYear
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_NATIONALITY)
    })

    it('Should fail journey if user enters nothing', async () => {
      const res = await submitPostRequest(postOptions, 302)
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_DATE_OF_BIRTH)
    })

    it('Should fail journey if user doesnt enter a day', async () => {
      postOptions.payload['dob-month'] = goodMonth
      postOptions.payload['dob-year'] = goodYear
      const res = await submitPostRequest(postOptions, 302)
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_DATE_OF_BIRTH)
    })

    it('Should fail journey if user doesnt enter a month', async () => {
      postOptions.payload['dob-day'] = goodDay
      postOptions.payload['dob-year'] = goodYear
      const res = await submitPostRequest(postOptions, 302)
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_DATE_OF_BIRTH)
    })

    it('Should fail journey if user doesnt enter a year', async () => {
      postOptions.payload['dob-day'] = goodDay
      postOptions.payload['dob-month'] = goodMonth
      const res = await submitPostRequest(postOptions, 302)
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_DATE_OF_BIRTH)
    })

    it('Should fail journey if user enters a day that isnt a number', async () => {
      postOptions.payload['dob-day'] = 'abc'
      postOptions.payload['dob-month'] = goodMonth
      postOptions.payload['dob-year'] = goodYear
      const res = await submitPostRequest(postOptions, 302)
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_DATE_OF_BIRTH)
    })

    it('Should fail journey if user enters a month that isnt a number', async () => {
      postOptions.payload['dob-day'] = goodDay
      postOptions.payload['dob-month'] = 'abc'
      postOptions.payload['dob-year'] = goodYear
      const res = await submitPostRequest(postOptions, 302)
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_DATE_OF_BIRTH)
    })

    it('Should fail journey if user enters a year that isnt a number', async () => {
      postOptions.payload['dob-day'] = goodDay
      postOptions.payload['dob-month'] = goodMonth
      postOptions.payload['dob-year'] = 'abc'
      const res = await submitPostRequest(postOptions, 302)
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_DATE_OF_BIRTH)
    })
  })
})
