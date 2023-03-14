import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.DEVELOPER_DETAILS_EMAIL
const hrefId = '#emailAddress'

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      const response = await submitGetRequest({ url })
      expect(response.statusCode).toBe(200)
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
      redisMap.set(constants.redisKeys.DEVELOPER_EMAIL_VALUE, 'test@satoshi.com')
      const request = {
        yar: redisMap
      }
      const email = require('../../developer/details-email')
      await email.default[0].handler(request, h)
      expect(viewResult).toBe(constants.views.DEVELOPER_DETAILS_EMAIL)
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
      const email = require('../../developer/details-email')
      await email.default[1].handler(request, h)
      expect(viewResult).toBe(constants.views.DEVELOPER_DETAILS_EMAIL)
      expect(resultContext.err[0]).toEqual({
        text: 'Enter your email address',
        href: hrefId
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
      const email = require('../../developer/details-email')
      await email.default[1].handler(request, h)
      expect(viewResult).toBe(constants.views.DEVELOPER_DETAILS_EMAIL)
      expect(resultContext.err[0]).toEqual({
        text: 'Email address must be 254 characters or less',
        href: hrefId
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
      const email = require('../../developer/details-email')
      await email.default[1].handler(request, h)
      expect(viewResult).toBe(constants.views.DEVELOPER_DETAILS_EMAIL)
      expect(resultContext.err[0]).toEqual({
        text: 'Enter an email address in the correct format, like name@example.com',
        href: hrefId
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
      const email = require('../../developer/details-email')
      await email.default[1].handler(request, h)
      expect(viewResult).toBe(constants.routes.DEVELOPER_DETAILS_EMAIL_CONFIRM)
      expect(redisMap.get(constants.redisKeys.DEVELOPER_EMAIL_VALUE)).toBe('name@example.com')
    })
  })
})
