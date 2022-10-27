import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants'

const url = '/land/legal-agreement-start-date'

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      const response = await submitGetRequest({ url })
      expect(response.statusCode).toBe(200)
    })

    it(`should render the ${url.substring(1)} view date selected`, async () => {
      const redisMap = new Map()
      jest.isolateModules(async () => {
        redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_START_DATE_KEY, '2020-03-11T00:00:00.000Z')
        let viewResult, contextResult
        const legalAgreementDetails = require('../../land/legal-agreement-start-date')
        const request = {
          yar: redisMap
        }
        const h = {
          view: (view, context) => {
            viewResult = view
            contextResult = context
          }
        }
        await legalAgreementDetails.default[0].handler(request, h)
        expect(viewResult).toEqual(constants.views.LEGAL_AGREEMENT_START_DATE)
        expect(contextResult.day).toEqual('11')
        expect(contextResult.month).toEqual('03')
        expect(contextResult.year).toEqual('2020')
      })
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
      postOptions.payload['legalAgreementStartDate-year'] = '2023'

      const response = await submitPostRequest(postOptions)
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/land/check-legal-agreement-details')
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
