import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.DEVELOPER_EMAIL_ENTRY

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      const response = await submitGetRequest({ url })
      expect(response.statusCode).toBe(200)
    })
  })

  describe('POST', () => {
    it('should return an errors if multiple null/invalid inputs submitted', async () => {
      const emailAddresses = {
        'emailAddresses[]': '',
        'emailAddresses[1]': 'test.com',
        'emailAddresses[2]': 'gkjahkfhknsdfjkhauiwernlkdfngkjbalffdngjkkdskadknkvahdnalkwnfngearmljdfghareuiwrnbkdsgkjasdfnavdfnvlasdhfdgalgnfabdskjhjksdhfk@hsdfgajsdfjjbfjbdkjsdankjnjkasdgflkfgladbjsdbafgeriaytuioagdfjnvcknzjlhdskfkhksdfnkvertpoafdglknkwaeiglknldfaiuwehidfgkj.djkhksdaf'
      }
      const { viewResult, resultContext } = await processEmailAddressesSubmission(emailAddresses)
      expect(viewResult).toBe(constants.views.DEVELOPER_EMAIL_ENTRY)
      expect(resultContext.err).toEqual([{
        href: '#emailAddresses[0]',
        text: 'Enter your email address'
      }, {
        href: '#emailAddresses[1]',
        text: 'Enter an email address in the correct format, like name@example.com'
      }, {
        href: '#emailAddresses[2]',
        text: 'Email address must be 254 characters or less'
      }])
    })
    it('should redirect to the check answer page', async () => {
      const emailAddresses = {
        'emailAddresses[]': 'test@example.com',
        'emailAddresses[1]': 'test1@example.com'
      }
      const { viewResult, yar } = await processEmailAddressesSubmission(emailAddresses)
      expect(viewResult).toBe(constants.routes.DEVELOPER_CHECK_ANSWERS)
      expect(yar.get(constants.redisKeys.DEVELOPER_ADDITIONAL_EMAILS)).toEqual(Object.values(emailAddresses))
    })
  })
})

const processEmailAddressesSubmission = async (emailAddresses) => {
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
    payload: emailAddresses
  }
  const email = require('../../developer/email-entry.js')
  await email.default[1].handler(request, h)
  return { viewResult, resultContext, yar: redisMap }
}
