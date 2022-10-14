import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants'

const url = '/land/legal-agreement-start-date'

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      const response = await submitGetRequest({ url })
      expect(response.statusCode).toBe(200)
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

    it('should add a legal agreement start date', async () => {
      postOptions.payload['legalAgreementStartDate-day'] = '01'
      postOptions.payload['legalAgreementStartDate-month'] = '01'
      postOptions.payload['legalAgreementStartDate-year'] = '1971'

      const response = await submitPostRequest(postOptions)
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/land/check-legal-agreement-details')
    })

    it('should add a legal agreement start date and back to referrer', async () => {
      const h = {
        view: jest.fn()
      }
      const redisMap = new Map()
      redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_START_DATE_KEY, '22-10-2022')
      const request = {
        yar: redisMap,
        info: {
          referrer: 'http://localhost:3000/land/check-legal-agreement-details'
        }
      }
      const legalAgreementParties = require('../../land/legal-agreement-start-date')
      await legalAgreementParties.default[0].handler(request, h)
      postOptions.payload['legalAgreementStartDate-day'] = '01'
      postOptions.payload['legalAgreementStartDate-month'] = '01'
      postOptions.payload['legalAgreementStartDate-year'] = '1971'

      const response = await submitPostRequest(postOptions)
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/land/check-legal-agreement-details')
    })

    it('should add a legal agreement start date and back to referrer', async () => {
      const h = {
        view: jest.fn()
      }
      const redisMap = new Map()
      redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_START_DATE_KEY, '22-10-2022')
      const request = {
        yar: redisMap,
        info: {
          referrer: 'check-legal-agreement-details'
        }
      }
      const legalAgreementParties = require('../../land/legal-agreement-start-date')
      await legalAgreementParties.default[0].handler(request, h)
      postOptions.payload['legalAgreementStartDate-day'] = '01'
      postOptions.payload['legalAgreementStartDate-month'] = '01'
      postOptions.payload['legalAgreementStartDate-year'] = '1971'

      const response = await submitPostRequest(postOptions)
      expect(response.statusCode).toBe(302)
    })

    it('should fail to add a legal agreement start date with empty dates', async () => {
      postOptions.payload['legalAgreementStartDate-day'] = ''
      postOptions.payload['legalAgreementStartDate-month'] = ''
      postOptions.payload['legalAgreementStartDate-year'] = ''

      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })

    it('should fail to add a legal agreement start date with empty day', async () => {
      postOptions.payload['legalAgreementStartDate-day'] = ''
      postOptions.payload['legalAgreementStartDate-month'] = '01'
      postOptions.payload['legalAgreementStartDate-year'] = '2022'

      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })

    it('should fail to add a legal agreement start date with empty month', async () => {
      postOptions.payload['legalAgreementStartDate-day'] = '01'
      postOptions.payload['legalAgreementStartDate-month'] = ''
      postOptions.payload['legalAgreementStartDate-year'] = '2022'

      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })

    it('should fail to add a legal agreement start date with empty year', async () => {
      postOptions.payload['legalAgreementStartDate-day'] = '01'
      postOptions.payload['legalAgreementStartDate-month'] = '01'
      postOptions.payload['legalAgreementStartDate-year'] = ''

      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })

    it('should fail to add a legal agreement start date with empty day', async () => {
      postOptions.payload['legalAgreementStartDate-day'] = ''
      postOptions.payload['legalAgreementStartDate-month'] = '01'
      postOptions.payload['legalAgreementStartDate-year'] = '2022'

      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
    })

    it('should fail to add a legal agreement start date with empty month', async () => {
      postOptions.payload['legalAgreementStartDate-day'] = '01'
      postOptions.payload['legalAgreementStartDate-month'] = ''
      postOptions.payload['legalAgreementStartDate-year'] = '2022'

      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
    })

    it('should fail to add a legal agreement start date with empty year', async () => {
      postOptions.payload['legalAgreementStartDate-day'] = '01'
      postOptions.payload['legalAgreementStartDate-month'] = '01'
      postOptions.payload['legalAgreementStartDate-year'] = ''

      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
    })

    it('should fail to add a legal agreement start date with empty day', async () => {
      postOptions.payload['legalAgreementStartDate-day'] = ''
      postOptions.payload['legalAgreementStartDate-month'] = '01'
      postOptions.payload['legalAgreementStartDate-year'] = '2022'

      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
    })

    it('should fail to add a legal agreement start date with empty month', async () => {
      postOptions.payload['legalAgreementStartDate-day'] = '01'
      postOptions.payload['legalAgreementStartDate-month'] = ''
      postOptions.payload['legalAgreementStartDate-year'] = '2022'

      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
    })

    it('should fail to add a legal agreement start date with empty year', async () => {
      postOptions.payload['legalAgreementStartDate-day'] = '01'
      postOptions.payload['legalAgreementStartDate-month'] = '01'
      postOptions.payload['legalAgreementStartDate-year'] = ''

      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
    })

    it('should fail to add a legal agreement start date with empty day', async () => {
      postOptions.payload['legalAgreementStartDate-day'] = ''
      postOptions.payload['legalAgreementStartDate-month'] = '01'
      postOptions.payload['legalAgreementStartDate-year'] = '2022'

      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
    })

    it('should fail to add a legal agreement start date with empty month', async () => {
      postOptions.payload['legalAgreementStartDate-day'] = '01'
      postOptions.payload['legalAgreementStartDate-month'] = ''
      postOptions.payload['legalAgreementStartDate-year'] = '2022'

      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
    })

    it('should fail to add a legal agreement start date with empty year', async () => {
      postOptions.payload['legalAgreementStartDate-day'] = '01'
      postOptions.payload['legalAgreementStartDate-month'] = '01'
      postOptions.payload['legalAgreementStartDate-year'] = ''

      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
    })

    it('should fail to add a legal agreement start date with invalid dates', async () => {
      postOptions.payload['legalAgreementStartDate-day'] = 'xx'
      postOptions.payload['legalAgreementStartDate-month'] = 'zz'
      postOptions.payload['legalAgreementStartDate-year'] = 'cc'

      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })

    it('should fail to add a legal agreement start date with wrong day', async () => {
      postOptions.payload['legalAgreementStartDate-day'] = 'x1'
      postOptions.payload['legalAgreementStartDate-month'] = '11'
      postOptions.payload['legalAgreementStartDate-year'] = '2020'

      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })

    it('should fail to add a legal agreement start date with wrong month', async () => {
      postOptions.payload['legalAgreementStartDate-day'] = '11'
      postOptions.payload['legalAgreementStartDate-month'] = '23'
      postOptions.payload['legalAgreementStartDate-year'] = '2020'

      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })

    it('should fail to add a legal agreement start date with wrong year', async () => {
      postOptions.payload['legalAgreementStartDate-day'] = '11'
      postOptions.payload['legalAgreementStartDate-month'] = '23'
      postOptions.payload['legalAgreementStartDate-year'] = '2a20'

      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })
  })
})
