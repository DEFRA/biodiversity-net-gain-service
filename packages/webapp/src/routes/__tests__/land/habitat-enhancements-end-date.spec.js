import Session from '../../../__mocks__/session.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
import habitatEnhancementsEndDate from '../../land/habitat-enhancements-end-date.js'

const url = constants.routes.HABITAT_ENHANCEMENTS_END_DATE

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })

    it(`should render the ${url.substring(1)} view date selected`, async () => {
      const redisMap = new Map()
      jest.isolateModules(async () => {
        redisMap.set(constants.redisKeys.HABITAT_ENHANCEMENTS_END_DATE_KEY, '2020-03-11T00:00:00.000Z')
        let viewResult, contextResult
        const habitatEnhancementsDetails = require('../../land/habitat-enhancements-end-date.js')
        const request = {
          yar: redisMap
        }
        const h = {
          view: (view, context) => {
            viewResult = view
            contextResult = context
          }
        }
        await habitatEnhancementsDetails.default[0].handler(request, h)
        expect(viewResult).toEqual(constants.views.HABITAT_ENHANCEMENTS_END_DATE)
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

    it('should add a habitat enhancement end date', async () => {
      postOptions.payload['habitatEnhancementsEndDate-day'] = '01'
      postOptions.payload['habitatEnhancementsEndDate-month'] = '01'
      postOptions.payload['habitatEnhancementsEndDate-year'] = '2023'
      postOptions.payload.habitatEnhancementsEndDateOption = 'yes'
      const response = await submitPostRequest(postOptions, 302)
      expect(response.request.yar.get(constants.redisKeys.HABITAT_ENHANCEMENTS_END_DATE_KEY)).toEqual('2023-01-01T00:00:00.000Z')
      expect(response.request.yar.get(constants.redisKeys.HABITAT_ENHANCEMENTS_END_DATE_OPTION)).toEqual('yes')
      expect(response.headers.location).toBe(constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS)
    })

    it('Should continue to check page if no option selected with blank date', async () => {
      postOptions.payload.habitatEnhancementsEndDateOption = 'no'
      const response = await submitPostRequest(postOptions, 302)
      expect(response.request.yar.get(constants.redisKeys.HABITAT_ENHANCEMENTS_END_DATE_KEY)).toBeNull()
      expect(response.request.yar.get(constants.redisKeys.HABITAT_ENHANCEMENTS_END_DATE_OPTION)).toEqual('no')
      expect(response.headers.location).toBe(constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS)
    })

    it('should fail to add a habitat enhancement end date with empty dates', async () => {
      postOptions.payload['habitatEnhancementsEndDate-day'] = ''
      postOptions.payload['habitatEnhancementsEndDate-month'] = ''
      postOptions.payload['habitatEnhancementsEndDate-year'] = ''
      postOptions.payload.habitatEnhancementsEndDateOption = 'yes'
      const response = await submitPostRequest(postOptions, 200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })

    it('should fail to add a habitat enhancement end date with empty day', async () => {
      postOptions.payload['habitatEnhancementsEndDate-day'] = ''
      postOptions.payload['habitatEnhancementsEndDate-month'] = '01'
      postOptions.payload['habitatEnhancementsEndDate-year'] = '2022'
      postOptions.payload.habitatEnhancementsEndDateOption = 'yes'
      const response = await submitPostRequest(postOptions, 200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })

    it('should fail to add a habitat enhancement end date with empty month', async () => {
      postOptions.payload['habitatEnhancementsEndDate-day'] = '01'
      postOptions.payload['habitatEnhancementsEndDate-month'] = ''
      postOptions.payload['habitatEnhancementsEndDate-year'] = '2022'
      postOptions.payload.habitatEnhancementsEndDateOption = 'yes'
      const response = await submitPostRequest(postOptions, 200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })

    it('should fail to add a habitat enhancement end date with empty year', async () => {
      postOptions.payload['habitatEnhancementsEndDate-day'] = '01'
      postOptions.payload['habitatEnhancementsEndDate-month'] = '01'
      postOptions.payload['habitatEnhancementsEndDate-year'] = ''
      postOptions.payload.habitatEnhancementsEndDateOption = 'yes'
      const response = await submitPostRequest(postOptions, 200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })

    it('should fail to add a habitat enhancement end date with invalid dates', async () => {
      postOptions.payload['habitatEnhancementsEndDate-day'] = 'xx'
      postOptions.payload['habitatEnhancementsEndDate-month'] = 'zz'
      postOptions.payload['habitatEnhancementsEndDate-year'] = 'cc'
      postOptions.payload.habitatEnhancementsEndDateOption = 'yes'
      const response = await submitPostRequest(postOptions, 200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })

    it('should fail to add a habitat enhancement end date with wrong day', async () => {
      postOptions.payload['habitatEnhancementsEndDate-day'] = 'x1'
      postOptions.payload['habitatEnhancementsEndDate-month'] = '11'
      postOptions.payload['habitatEnhancementsEndDate-year'] = '2020'
      postOptions.payload.habitatEnhancementsEndDateOption = 'yes'
      const response = await submitPostRequest(postOptions, 200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })

    it('should fail to add a habitat enhancement end date with wrong month', async () => {
      postOptions.payload['habitatEnhancementsEndDate-day'] = '11'
      postOptions.payload['habitatEnhancementsEndDate-month'] = '23'
      postOptions.payload['habitatEnhancementsEndDate-year'] = '2020'
      postOptions.payload.habitatEnhancementsEndDateOption = 'yes'
      const response = await submitPostRequest(postOptions, 200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })

    it('should fail to add a habitat enhancement end date with wrong year', async () => {
      postOptions.payload['habitatEnhancementsEndDate-day'] = '11'
      postOptions.payload['habitatEnhancementsEndDate-month'] = '23'
      postOptions.payload['habitatEnhancementsEndDate-year'] = '2a20'
      postOptions.payload.habitatEnhancementsEndDateOption = 'yes'
      const response = await submitPostRequest(postOptions, 200)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
    })
    it('should fail if no option selected and continue', async () => {
      postOptions.payload = {}
      const response = await submitPostRequest(postOptions, 200)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select yes if the requirement to create and maintain habitat enhancements has an end date')
    })
    it('Ensure page uses referrer if is set on post', done => {
      jest.isolateModules(async () => {
        try {
          const postHandler = habitatEnhancementsEndDate[1].handler
          const session = new Session()
          session.set(constants.redisKeys.REFERER, '/land/check-and-submit')
          const payload = {
            'habitatEnhancementsEndDate-day': '01',
            'habitatEnhancementsEndDate-month': '12',
            'habitatEnhancementsEndDate-year': '2022',
            habitatEnhancementsEndDateOption: 'yes'
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
          expect(redirectArgs[0]).toEqual(constants.routes.CHECK_AND_SUBMIT)
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
