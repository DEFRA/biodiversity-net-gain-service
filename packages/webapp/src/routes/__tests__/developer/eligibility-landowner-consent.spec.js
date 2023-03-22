import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'

const url = '/developer/eligibility-landowner-consent'

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

    it('should redirect to eligibility metric if Yes selected', async () => {
      let viewResult
      const eligibilityLOConsentValue = 'yes'
      const h = {
        redirect: (view, context) => {
          viewResult = view
        }
      }
      postOptions.payload = {
        eligibilityLOConsentValue
      }
      const eligibilityEngland = require('../../developer/eligibility-landowner-consent.js')
      await eligibilityEngland.default[1].handler(postOptions, h)
      expect(viewResult).toBe(constants.routes.DEVELOPER_ELIGIBILITY_METRIC)
    })

    it('should redirect to eligibility metric even if No selected', async () => {
      let viewResult
      const eligibilityLOConsentValue = 'no'
      const h = {
        redirect: (view, context) => {
          viewResult = view
        }
      }
      postOptions.payload = {
        eligibilityLOConsentValue
      }
      const eligibilityEngland = require('../../developer/eligibility-landowner-consent.js')
      await eligibilityEngland.default[1].handler(postOptions, h)
      expect(viewResult).toBe(constants.routes.DEVELOPER_ELIGIBILITY_METRIC)
    })

    it('should redirect to eligibility metric even if I\'m not sure selected', async () => {
      let viewResult
      const eligibilityLOConsentValue = 'not-sure'
      const h = {
        redirect: (view, context) => {
          viewResult = view
        }
      }
      postOptions.payload = {
        eligibilityLOConsentValue
      }
      const eligibilityEngland = require('../../developer/eligibility-landowner-consent.js')
      await eligibilityEngland.default[1].handler(postOptions, h)
      expect(viewResult).toBe(constants.routes.DEVELOPER_ELIGIBILITY_METRIC)
    })

    it('should show error if none of the options selected', async () => {
      postOptions.payload = {
        eligibilityLOConsentValue: undefined
      }
      delete postOptions.yar
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('You need to select an option')
    })
  })
})
