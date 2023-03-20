import constants from '../../../utils/constants.js'
import { submitGetRequest } from '../helpers/server.js'

const url = constants.routes.DEVELOPER_ELIGIBILITY_ENGLAND

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    let postOptions
    const redisMap = new Map()
    beforeEach(() => {
      postOptions = {
        url,
        yar: redisMap,
        payload: {}
      }
    })

    it('should redirect to eligibility landowner consent if Yes selected', async () => {
      let viewResult
      const eligibilityEngValue = 'yes'
      const h = {
        redirect: (view, context) => {
          viewResult = view
        }
      }
      postOptions.payload = {
        eligibilityEngValue
      }
      const eligibilityEngland = require('../../developer/eligibility-england.js')
      await eligibilityEngland.default[1].handler(postOptions, h)
      expect(viewResult).toBe(constants.routes.DEVELOPER_ELIGIBILITY_LO_CONSENT)
      expect(redisMap.get(constants.redisKeys.DEVELOPER_ELIGIBILITY_ENGLAND_VALUE)).toEqual(eligibilityEngValue)
    })

    it('should redirect to eligibility landowner consent if No selected', async () => {
      let viewResult
      const eligibilityEngValue = 'no'
      const h = {
        redirect: (view, context) => {
          viewResult = view
        }
      }
      postOptions.payload = {
        eligibilityEngValue
      }
      const eligibilityEngland = require('../../developer/eligibility-england.js')
      await eligibilityEngland.default[1].handler(postOptions, h)
      expect(viewResult).toBe(constants.routes.DEVELOPER_ELIGIBILITY_NO)
      expect(redisMap.get(constants.redisKeys.DEVELOPER_ELIGIBILITY_ENGLAND_VALUE)).toEqual(eligibilityEngValue)
    })

    it('should redirect to eligibility landowner consent if I\'m not sure selected', async () => {
      let viewResult
      const eligibilityEngValue = 'not-sure'
      const h = {
        redirect: (view, context) => {
          viewResult = view
        }
      }
      postOptions.payload = {
        eligibilityEngValue
      }
      const eligibilityEngland = require('../../developer/eligibility-england.js')
      await eligibilityEngland.default[1].handler(postOptions, h)
      expect(viewResult).toBe(constants.routes.DEVELOPER_ELIGIBILITY_NO)
      expect(redisMap.get(constants.redisKeys.DEVELOPER_ELIGIBILITY_ENGLAND_VALUE)).toEqual(eligibilityEngValue)
    })

    it('should show error if none of the options selected', async () => {
      postOptions.payload = {
        eligibilityEngValue: undefined
      }
      delete postOptions.yar
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('You need to select an option')
    })
  })
})
