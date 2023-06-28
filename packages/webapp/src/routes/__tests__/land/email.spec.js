import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.EMAIL

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view with session email if set`, async () => {
      const response = await submitGetRequest({ url })
      expect(response.payload).toContain('<input class="govuk-input" id="emailAddress" name="emailAddress" type="text" spellcheck="false" value="test@test.com" autocomplete="emailAddress">')
    })
    it(`should render the ${url.substring(1)} view with account email if no session email`, async () => {
      const response = await submitGetRequest({ url }, 200, {})
      expect(response.payload).toContain('<input class="govuk-input" id="emailAddress" name="emailAddress" type="text" spellcheck="false" value="john.smith@test.com" autocomplete="emailAddress">')
    })
    it('Should render email page with an input email set', async () => {
      let viewResult, resultContext
      const h = {
        view: (view, context) => {
          viewResult = view
          resultContext = context
        }
      }
      const redisMap = new Map()
      redisMap.set(constants.redisKeys.EMAIL_VALUE, 'test@satoshi.com')
      const request = {
        yar: redisMap
      }
      const email = require('../../land/email')
      await email.default[0].handler(request, h)
      expect(viewResult).toBe(constants.views.EMAIL)
      expect(resultContext.emailAddress).toEqual('test@satoshi.com')
    })
  })
  describe('POST', () => {
    it('Should return an error if empty email is provided', async () => {
      let viewResult, resultContext
      const h = {
        view: (view, context) => {
          viewResult = view
          resultContext = context
        }
      }
      const redisMap = new Map()
      const request = {
        yar: redisMap,
        payload: {
          emailAddress: undefined
        }
      }
      const email = require('../../land/email')
      await email.default[1].handler(request, h)
      expect(viewResult).toBe(constants.views.EMAIL)
      expect(resultContext.err[0]).toEqual({
        text: 'Enter your email address',
        href: '#emailAddress'
      })
    })
    it('Should return an error if email length is greater than 254', async () => {
      let viewResult, resultContext
      const h = {
        view: (view, context) => {
          viewResult = view
          resultContext = context
        }
      }
      const redisMap = new Map()
      const request = {
        yar: redisMap,
        payload: {
          emailAddress: 'xukoacbbaaqmchxncpsryiaqrrmvzjsdpnoxrqwwbplaoxtdldrwcxdhjepqysbalzwqblyzfgrwkknnkwhrhdywtwgspvncdyrhkyzfndaczinuxebnmkmerwiwsevkmhhmwcmgwzueiwineoijzgoqddbspqniqztcbkxslujrnjonlaqrunodlsiwhscsohzxsvixxoguznzkxxcmtavqgvezpqujacbkbssdjmkjbmydnnekmdlpubkwfpowzphgxxywvxwziycmrcneqatlndzjbkgjmqfszqzhfqgpcizmmaqxwvtihaefqaveyecpxszzqcpaiuxktelxrpcmjnklwyrrcwqufrzbrlufdbcztkjjeaux@hqhyxspwaslntpdcdlesrvxjezwibncvekseucepxroszlqkffwasic.net'
        }
      }
      const email = require('../../land/email')
      await email.default[1].handler(request, h)
      expect(viewResult).toBe(constants.views.EMAIL)
      expect(resultContext.err[0]).toEqual({
        text: 'Email address must be 254 characters or less',
        href: '#emailAddress'
      })
    })
    it('Should return an error if email format is invalid', async () => {
      let viewResult, resultContext
      const h = {
        view: (view, context) => {
          viewResult = view
          resultContext = context
        }
      }
      const redisMap = new Map()
      const request = {
        yar: redisMap,
        payload: {
          emailAddress: 'name-example.com'
        }
      }
      const email = require('../../land/email')
      await email.default[1].handler(request, h)
      expect(viewResult).toBe(constants.views.EMAIL)
      expect(resultContext.err[0]).toEqual({
        text: 'Enter an email address in the correct format, like name@example.com',
        href: '#emailAddress'
      })
    })
    it('Should proceed with the flow when a valid email is entered', async () => {
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
          emailAddress: 'name@example.com'
        }
      }
      const email = require('../../land/email')
      await email.default[1].handler(request, h)
      expect(viewResult).toBe(constants.routes.CORRECT_EMAIL)
      expect(redisMap.get(constants.redisKeys.EMAIL_VALUE)).toBe('name@example.com')
    })
  })
})
