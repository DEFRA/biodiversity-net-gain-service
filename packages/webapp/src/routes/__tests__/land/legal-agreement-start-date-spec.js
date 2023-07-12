import Session from '../../../__mocks__/session.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants'
import legalAgreementStartDate from '../../land/legal-agreement-start-date'

const url = constants.routes.LEGAL_AGREEMENT_START_DATE

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
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
    it('should fail to add a legal agreement start date if less than the minimum date', async () => {
      postOptions.payload['legalAgreementStartDate-day'] = '20'
      postOptions.payload['legalAgreementStartDate-month'] = '01'
      postOptions.payload['legalAgreementStartDate-year'] = '2020'

      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Start date must be after 29 January 2020')
    })
    it('Ensure page uses referrer if is set on post', done => {
      jest.isolateModules(async () => {
        try {
          const postHandler = legalAgreementStartDate[1].handler
          const session = new Session()
          session.set(constants.redisKeys.REFERER, '/land/check-and-submit')
          const payload = {
            'legalAgreementStartDate-day': '01',
            'legalAgreementStartDate-month': '12',
            'legalAgreementStartDate-year': '2022'
          }
          let viewArgs = ''
          let redirectArgs = ''
          const h = {
            view: (...args) => {
              viewArgs = args
            },
            redirect: (...args) => {
              redirectArgs = args
            }
          }

          await postHandler({ payload, yar: session }, h)
          expect(viewArgs).toEqual('')
          expect(redirectArgs[0]).toEqual('/land/check-and-submit')
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
