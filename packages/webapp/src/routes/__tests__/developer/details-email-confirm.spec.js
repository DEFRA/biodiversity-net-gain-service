import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.DEVELOPER_DETAILS_EMAIL_CONFIRM

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      const response = await submitGetRequest({ url })
      expect(response.statusCode).toBe(200)
    })
    it('Should show email page with a session email set', async () => {
      let viewResult, resultContext
      const h = {
        view: (view, context) => {
          viewResult = view
          resultContext = context
        },
        redirect: (view, context) => {
          viewResult = view
        }
      }
      const redisMap = new Map()
      redisMap.set(constants.redisKeys.DEVELOPER_EMAIL_VALUE, 'test@satoshi.com')
      const request = {
        yar: redisMap
      }
      const correctEmail = require('../../developer/details-email-confirm')
      await correctEmail.default[0].handler(request, h)
      expect(viewResult).toBe(constants.views.DEVELOPER_DETAILS_EMAIL_CONFIRM)
      expect(resultContext.emailAddress).toEqual('test@satoshi.com')
    })
  })
  describe('POST', () => {
    it('Should proceed to check your answer if yes options is provided', async () => {
      let viewResult
      const h = {
        redirect: (view, context) => {
          viewResult = view
        }
      }
      const redisMap = new Map()
      const request = {
        yar: redisMap,
        payload: {
          correctEmail: 'yes'
        }
      }
      const correctEmail = require('../../developer/details-email-confirm')
      await correctEmail.default[1].handler(request, h)
      // Note: This temp location will be change in next ticket
      expect(viewResult).toBe('#')
      expect(redisMap.get(constants.redisKeys.DEVELOPER_CONFIRM_EMAIL)).toEqual('yes')
    })

    it('Should proceed to check and submit if referer is set', async () => {
      let viewResult
      const h = {
        redirect: (view, context) => {
          viewResult = view
        }
      }
      const redisMap = new Map()
      redisMap.set(constants.redisKeys.REFERER, constants.routes.CHECK_AND_SUBMIT)
      const request = {
        yar: redisMap,
        payload: {
          correctEmail: 'yes'
        }
      }
      const correctEmail = require('../../developer/details-email-confirm')
      await correctEmail.default[1].handler(request, h)
      // Note: This temp location will be change in next ticket
      expect(viewResult).toBe('#')
    })

    it('Should not proceed to check your answer if email is invalid', async () => {
      let viewResult, resultContext
      const h = {
        view: (view, context) => {
          viewResult = view
          resultContext = context
        },
        redirect: (view, context) => {
          viewResult = view
        }
      }
      const redisMap = new Map()
      const request = {
        yar: redisMap,
        payload: {
          correctEmail: 'no'
        }
      }
      const correctEmail = require('../../developer/details-email-confirm')
      await correctEmail.default[1].handler(request, h)
      expect(viewResult).toBe(constants.views.DEVELOPER_DETAILS_EMAIL_CONFIRM)
      expect(resultContext).toEqual({
        errorMessage: 'Email address cannot be left blank',
        selected: true
      })
    })
    it('Should not proceed to check your answer if no option and email is valid', async () => {
      let viewResult
      const h = {
        redirect: (view, context) => {
          viewResult = view
        }
      }
      const redisMap = new Map()
      const request = {
        yar: redisMap,
        payload: {
          correctEmail: 'no',
          emailAddress: 'satoshio@bitcoin.com'
        }
      }
      const correctEmail = require('../../developer/details-email-confirm')
      await correctEmail.default[1].handler(request, h)
      expect(redisMap.get(constants.redisKeys.DEVELOPER_CONFIRM_EMAIL)).toEqual('no')
      expect(redisMap.get(constants.redisKeys.DEVELOPER_EMAIL_VALUE)).toEqual('satoshio@bitcoin.com')
      // Note: This temp location will be change in next ticket
      expect(viewResult).toBe('#')
    })
  })
})
