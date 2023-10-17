import Session from '../../../__mocks__/session.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
import legalAgreementEndDate from '../../land/legal-agreement-end-date.js'

const url = constants.routes.ENHANCEMENT_WORKS_START_DATE

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })

    it(`should render the ${url.substring(1)} view date selected`, async () => {
      const redisMap = new Map()
      jest.isolateModules(async () => {
        redisMap.set(constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_KEY, '2020-03-11T00:00:00.000Z')
        let viewResult, contextResult
        const legalAgreementDetails = require('../../land/enhancement-works-start-date.js')
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
        expect(viewResult).toEqual(constants.views.ENHANCEMENT_WORKS_START_DATE)
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

    it('should add an enhancement work start date', async () => {
      postOptions.payload['enhancementWorkStartDate-day'] = '01'
      postOptions.payload['enhancementWorkStartDate-month'] = '01'
      postOptions.payload['enhancementWorkStartDate-year'] = '2023'
      postOptions.payload.enhancementWorkStartDateOption = 'yes'
      const response = await submitPostRequest(postOptions)
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/land/legal-agreement-end-date')
    })

    it('should fail to add an enhancement work start date with empty dates', async () => {
      postOptions.payload['enhancementWorkStartDate-day'] = ''
      postOptions.payload['enhancementWorkStartDate-month'] = ''
      postOptions.payload['enhancementWorkStartDate-year'] = ''
      postOptions.payload.enhancementWorkStartDateOption = 'yes'
      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })

    it('should fail to add an enhancement work start date with empty day', async () => {
      postOptions.payload['enhancementWorkStartDate-day'] = ''
      postOptions.payload['enhancementWorkStartDate-month'] = '01'
      postOptions.payload['enhancementWorkStartDate-year'] = '2022'
      postOptions.payload.enhancementWorkStartDateOption = 'yes'
      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })

    it('should fail to add an enhancement work start date with empty month', async () => {
      postOptions.payload['enhancementWorkStartDate-day'] = '01'
      postOptions.payload['enhancementWorkStartDate-month'] = ''
      postOptions.payload['enhancementWorkStartDate-year'] = '2022'
      postOptions.payload.enhancementWorkStartDateOption = 'yes'
      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })

    it('should fail to add an enhancement work start date with empty year', async () => {
      postOptions.payload['enhancementWorkStartDate-day'] = '01'
      postOptions.payload['enhancementWorkStartDate-month'] = '01'
      postOptions.payload['enhancementWorkStartDate-year'] = ''
      postOptions.payload.enhancementWorkStartDateOption = 'yes'
      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })

    it('should fail to add an enhancement work start date with invalid dates', async () => {
      postOptions.payload['enhancementWorkStartDate-day'] = 'xx'
      postOptions.payload['enhancementWorkStartDate-month'] = 'zz'
      postOptions.payload['enhancementWorkStartDate-year'] = 'cc'
      postOptions.payload.enhancementWorkStartDateOption = 'yes'
      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })

    it('should fail to add an enhancement work start date with wrong day', async () => {
      postOptions.payload['enhancementWorkStartDate-day'] = 'x1'
      postOptions.payload['enhancementWorkStartDate-month'] = '11'
      postOptions.payload['enhancementWorkStartDate-year'] = '2020'
      postOptions.payload.enhancementWorkStartDateOption = 'yes'
      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })

    it('should fail to add an enhancement work start date  with wrong month', async () => {
      postOptions.payload['enhancementWorkStartDate-day'] = '11'
      postOptions.payload['enhancementWorkStartDate-month'] = '23'
      postOptions.payload['enhancementWorkStartDate-year'] = '2020'
      postOptions.payload.enhancementWorkStartDateOption = 'yes'
      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })

    it('should fail to add an enhancement work start date with wrong year', async () => {
      postOptions.payload['enhancementWorkStartDate-day'] = '11'
      postOptions.payload['enhancementWorkStartDate-month'] = '23'
      postOptions.payload['enhancementWorkStartDate-year'] = '2a20'
      postOptions.payload.enhancementWorkStartDateOption = 'yes'
      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })
    it('should fail to add an enhancement work start date in future', async () => {
      const futureDate = new Date()
      futureDate.setFullYear(futureDate.getFullYear() + 1)

      const day = String(futureDate.getDate()).padStart(2, '0')
      const month = String(futureDate.getMonth() + 1).padStart(2, '0')
      const year = futureDate.getFullYear()
      postOptions.payload['enhancementWorkStartDate-day'] = day
      postOptions.payload['enhancementWorkStartDate-month'] = month
      postOptions.payload['enhancementWorkStartDate-year'] = year
      postOptions.payload.enhancementWorkStartDateOption = 'yes'
      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Start date cannot be in the future')
    })
    it('should fail if no option selected and continue', async () => {
      postOptions.payload = {}
      const response = await submitPostRequest(postOptions, 200)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select yes if the habitat enhancement works have started')
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
