import Session from '../../../__mocks__/session.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
import legalAgreementEndDate from '../../land/legal-agreement-end-date.js'

const url = constants.routes.LEGAL_AGREEMENT_END_DATE

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })

    it(`should render the ${url.substring(1)} view date selected`, async () => {
      const redisMap = new Map()
      jest.isolateModules(async () => {
        redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_END_DATE_KEY, '2020-03-11T00:00:00.000Z')
        let viewResult, contextResult
        const legalAgreementDetails = require('../../land/legal-agreement-end-date.js')
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
        expect(viewResult).toEqual(constants.views.LEGAL_AGREEMENT_END_DATE)
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

    it('should add a legal agreement end date', async () => {
      postOptions.payload['legalAgreementEndDate-day'] = '01'
      postOptions.payload['legalAgreementEndDate-month'] = '01'
      postOptions.payload['legalAgreementEndDate-year'] = '2023'
      postOptions.payload.legalAgreementEndDateOption = 'yes'
      const response = await submitPostRequest(postOptions)
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/land/check-legal-agreement-details')
    })

    it('should fail to add a legal agreement end date with empty dates', async () => {
      postOptions.payload['legalAgreementEndDate-day'] = ''
      postOptions.payload['legalAgreementEndDate-month'] = ''
      postOptions.payload['legalAgreementEndDate-year'] = ''
      postOptions.payload.legalAgreementEndDateOption = 'yes'
      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })

    it('should fail to add a legal agreement end date with empty day', async () => {
      postOptions.payload['legalAgreementEndDate-day'] = ''
      postOptions.payload['legalAgreementEndDate-month'] = '01'
      postOptions.payload['legalAgreementEndDate-year'] = '2022'
      postOptions.payload.legalAgreementEndDateOption = 'yes'
      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })

    it('should fail to add a legal agreement end date with empty month', async () => {
      postOptions.payload['legalAgreementEndDate-day'] = '01'
      postOptions.payload['legalAgreementEndDate-month'] = ''
      postOptions.payload['legalAgreementEndDate-year'] = '2022'
      postOptions.payload.legalAgreementEndDateOption = 'yes'
      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })

    it('should fail to add a legal agreement end date with empty year', async () => {
      postOptions.payload['legalAgreementEndDate-day'] = '01'
      postOptions.payload['legalAgreementEndDate-month'] = '01'
      postOptions.payload['legalAgreementEndDate-year'] = ''
      postOptions.payload.legalAgreementEndDateOption = 'yes'
      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })

    it('should fail to add a legal agreement end date with invalid dates', async () => {
      postOptions.payload['legalAgreementEndDate-day'] = 'xx'
      postOptions.payload['legalAgreementEndDate-month'] = 'zz'
      postOptions.payload['legalAgreementEndDate-year'] = 'cc'
      postOptions.payload.legalAgreementEndDateOption = 'yes'
      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })

    it('should fail to add a legal agreement end date with wrong day', async () => {
      postOptions.payload['legalAgreementEndDate-day'] = 'x1'
      postOptions.payload['legalAgreementEndDate-month'] = '11'
      postOptions.payload['legalAgreementEndDate-year'] = '2020'
      postOptions.payload.legalAgreementEndDateOption = 'yes'
      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })

    it('should fail to add a legal agreement end date with wrong month', async () => {
      postOptions.payload['legalAgreementEndDate-day'] = '11'
      postOptions.payload['legalAgreementEndDate-month'] = '23'
      postOptions.payload['legalAgreementEndDate-year'] = '2020'
      postOptions.payload.legalAgreementEndDateOption = 'yes'
      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })

    it('should fail to add a legal agreement end date with wrong year', async () => {
      postOptions.payload['legalAgreementEndDate-day'] = '11'
      postOptions.payload['legalAgreementEndDate-month'] = '23'
      postOptions.payload['legalAgreementEndDate-year'] = '2a20'
      postOptions.payload.legalAgreementEndDateOption = 'yes'
      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })
    it('Ensure page uses referrer if is set on post', done => {
      jest.isolateModules(async () => {
        try {
          const postHandler = legalAgreementEndDate[1].handler
          const session = new Session()
          session.set(constants.redisKeys.REFERER, '/land/check-and-submit')
          const payload = {
            'legalAgreementEndDate-day': '01',
            'legalAgreementEndDate-month': '12',
            'legalAgreementEndDate-year': '2022',
            legalAgreementEndDateOption: 'yes'
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
