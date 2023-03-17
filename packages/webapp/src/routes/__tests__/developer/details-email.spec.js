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
      const { viewResult, resultContext } = await processEmailAddressSubmission(undefined)
      expect(viewResult).toBe(constants.views.DEVELOPER_DETAILS_EMAIL)
      expect(resultContext.err[0]).toEqual({
        text: 'Enter your email address',
        href: hrefId
      })
    })
    it('Should return an error if email length is greater than 254', async () => {
      const { viewResult, resultContext } = await processEmailAddressSubmission('xukoacbbaaqmchxncpsryiaqrrmvzjsdpnoxrqwwbplaoxtdldrwcxdhjepqysbalzwqblyzfgrwkknnkwhrhdywtwgspvncdyrhkyzfndaczinuxebnmkmerwiwsevkmhhmwcmgwzueiwineoijzgoqddbspqniqztcbkxslujrnjonlaqrunodlsiwhscsohzxsvixxoguznzkxxcmtavqgvezpqujacbkbssdjmkjbmydnnekmdlpubkwfpowzphgxxywvxwziycmrcneqatlndzjbkgjmqfszqzhfqgpcizmmaqxwvtihaefqaveyecpxszzqcpaiuxktelxrpcmjnklwyrrcwqufrzbrlufdbcztkjjeaux@hqhyxspwaslntpdcdlesrvxjezwibncvekseucepxroszlqkffwasic.net')
      expect(viewResult).toBe(constants.views.DEVELOPER_DETAILS_EMAIL)
      expect(resultContext.err[0]).toEqual({
        text: 'Email address must be 254 characters or less',
        href: hrefId
      })
    })

    // https://en.wikipedia.org/wiki/Email_address#Domain
    // local part may be up to 64 octets long and the domain may have a maximum of 255 octets.
    // It must match the requirements for a hostname, a list of dot-separated DNS labels, each label being limited to a length of 63 characters
    it('Should return an error if a list of dot-separated DNS labels exceeds 63 chars', async () => {
      const { viewResult, resultContext } = await processEmailAddressSubmission('test@sdsdffsdfsgweewhqhyxspwaslntpdcdlesrvxjezwibncvekseucepxroszlqkffwasic.net')
      expect(viewResult).toBe(constants.views.DEVELOPER_DETAILS_EMAIL)
      expect(resultContext.err[0]).toEqual({
        text: 'Enter a valid email address',
        href: hrefId
      })
    })

    it('Should return an error if local part more than 64 chars', async () => {
      const { viewResult, resultContext } = await processEmailAddressSubmission('sdsdffsdfsgweewhqhyxspwaslntpdcdlesrvxjezwibncvekseucepxroszlqkffwasic@example.com')
      expect(viewResult).toBe(constants.views.DEVELOPER_DETAILS_EMAIL)
      expect(resultContext.err[0]).toEqual({
        text: 'Enter a valid email address',
        href: hrefId
      })
    })

    it('Should return an error if domain part more than 255 chars', async () => {
      const { viewResult, resultContext } = await processEmailAddressSubmission('test@dsfsbfssdsdfsdsdffsdfsgweewhqhyxspwaslntpdcdlesrvxjezwibncvekseucepxroszlqkffwasic.sdfhksdfkskdhkfhzklfllzxclsd.sdfsdhbsidhfhwkeuisdhgfsjldkhfskhdbndsjkhsd.sdhfkjskdkbsdhfknabajshgdjlasfjsgdjflkjskjfhiuewyhsdfhkjsfdhdfkshdkjgfgaklaksdsfasdassdfwera')
      expect(viewResult).toBe(constants.views.DEVELOPER_DETAILS_EMAIL)
      expect(resultContext.err[0]).toEqual({
        text: 'Enter a valid email address',
        href: hrefId
      })
    })

    it('Should return an error if email format is invalid', async () => {
      const { viewResult, resultContext } = await processEmailAddressSubmission('name-example.com')
      expect(viewResult).toBe(constants.views.DEVELOPER_DETAILS_EMAIL)
      expect(resultContext.err[0]).toEqual({
        text: 'Enter an email address in the correct format, like name@example.com',
        href: hrefId
      })
    })
    it('Should proceed with the flow when a valid email is entered', async () => {
      const { viewResult, yar } = await processEmailAddressSubmission('name@example.com')
      expect(viewResult).toBe(constants.routes.DEVELOPER_DETAILS_EMAIL_CONFIRM)
      expect(yar.get(constants.redisKeys.DEVELOPER_EMAIL_VALUE)).toBe('name@example.com')
    })
  })
})

const processEmailAddressSubmission = async (emailAddress) => {
  let viewResult, resultContext
  const h = {
    view: (view, context) => {
      viewResult = view
      resultContext = context
    },
    redirect: (view, context) => {
      viewResult = view
      resultContext = context
    }
  }
  const redisMap = new Map()
  const request = {
    yar: redisMap,
    payload: {
      emailAddress
    }
  }
  const email = require('../../developer/details-email')
  await email.default[1].handler(request, h)
  return { viewResult, resultContext, yar: redisMap }
}
