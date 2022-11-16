import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.CORRECT_EMAIL

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
      redisMap.set(constants.redisKeys.EMAIL_VALUE, 'test@satoshi.com')
      const request = {
        yar: redisMap
      }
      const correctEmail = require('../../land/correct-email')
      await correctEmail.default[0].handler(request, h)
      expect(viewResult).toBe(constants.views.CORRECT_EMAIL)
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
      const correctEmail = require('../../land/correct-email')
      await correctEmail.default[1].handler(request, h)
      expect(viewResult).toBe(constants.routes.CHECK_YOUR_DETAILS)
      expect(redisMap.get(constants.redisKeys.CONFIRM_EMAIL)).toEqual('yes')
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
      const correctEmail = require('../../land/correct-email')
      await correctEmail.default[1].handler(request, h)
      expect(viewResult).toBe(constants.routes.CHECK_AND_SUBMIT)
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
      const correctEmail = require('../../land/correct-email')
      await correctEmail.default[1].handler(request, h)
      expect(viewResult).toBe(constants.views.CORRECT_EMAIL)
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
      const correctEmail = require('../../land/correct-email')
      await correctEmail.default[1].handler(request, h)
      expect(redisMap.get(constants.redisKeys.CONFIRM_EMAIL)).toEqual('no')
      expect(redisMap.get(constants.redisKeys.EMAIL_VALUE)).toEqual('satoshio@bitcoin.com')
      expect(viewResult).toBe(constants.routes.CHECK_YOUR_DETAILS)
    })
  })
})
