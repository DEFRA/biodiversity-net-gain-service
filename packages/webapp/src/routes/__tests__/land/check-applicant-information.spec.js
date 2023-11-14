import constants from '../../../utils/constants.js'
import checkApplicantInfoDetails from '../../land/check-applicant-information.js'

const url = constants.routes.CHECK_APPLICANT_INFORMATION

describe(url, () => {
  let redisMap

  beforeEach(() => {
    redisMap = new Map()

    redisMap.set(constants.redisKeys.DEFRA_ACCOUNT_DETAILS_CONFIRMED, 'true')
    redisMap.set(constants.redisKeys.UK_ADDRESS, {
      addressLine1: '123 The Street',
      town: 'Townsville',
      postcode: 'AB12 3DE'
    })
    redisMap.set(constants.redisKeys.NON_UK_ADDRESS, {
      addressLine1: '123 Le Street',
      town: 'Paris',
      country: 'France'
    })
    redisMap.set(constants.redisKeys.CLIENTS_NAME, {
      type: 'individual',
      value: {
        firstName: 'Joe',
        middleNames: 'George',
        lastName: 'Smith'
      }
    })
    redisMap.set(constants.redisKeys.CLIENTS_ORGANISATION_NAME, 'Land Company Ltd')
    redisMap.set(constants.redisKeys.CLIENTS_EMAIL_ADDRESS, 'me@me.com')
    redisMap.set(constants.redisKeys.CLIENTS_PHONE_NUMBER, '07000000000')
    redisMap.set(constants.redisKeys.WRITTEN_AUTHORISATION_LOCATION, '/a-location/somewhere/authfile.pdf')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view for non-agent individual landowner with UK address`, async () => {
      let viewResult, contextResult
      const getHandler = checkApplicantInfoDetails[0].handler
      const h = {
        view: (view, context) => {
          viewResult = view
          contextResult = context
        }
      }

      redisMap.set(constants.redisKeys.APPLICANT_DETAILS_IS_AGENT, 'no')
      redisMap.set(constants.redisKeys.IS_ADDRESS_UK, 'yes')
      redisMap.set(constants.redisKeys.LANDOWNER_TYPE, constants.landownerTypes.INDIVIDUAL)

      await getHandler({ yar: redisMap }, h)
      expect(viewResult).toEqual(constants.views.CHECK_APPLICANT_INFORMATION)
      expect(contextResult.actingForClient).toBe(false)
      expect(contextResult.accountDetailsUpToDate).toBe(true)
      expect(contextResult.addressIsUK).toBe(true)
      expect(contextResult.applicantIsIndividual).toBe(true)
      expect(contextResult.applicantAddress).toEqual('123 The Street, Townsville, AB12 3DE')
    })
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view for non-agent organisation landowner with international address`, async () => {
      let viewResult, contextResult
      const getHandler = checkApplicantInfoDetails[0].handler
      const h = {
        view: (view, context) => {
          viewResult = view
          contextResult = context
        }
      }

      redisMap.set(constants.redisKeys.APPLICANT_DETAILS_IS_AGENT, 'no')
      redisMap.set(constants.redisKeys.IS_ADDRESS_UK, 'no')
      redisMap.set(constants.redisKeys.LANDOWNER_TYPE, constants.landownerTypes.ORGANISATION)

      await getHandler({ yar: redisMap }, h)
      expect(viewResult).toEqual(constants.views.CHECK_APPLICANT_INFORMATION)
      expect(contextResult.actingForClient).toBe(false)
      expect(contextResult.accountDetailsUpToDate).toBe(true)
      expect(contextResult.addressIsUK).toBe(false)
      expect(contextResult.applicantIsIndividual).toBe(false)
      expect(contextResult.applicantAddress).toEqual('123 Le Street, Paris, France')
    })
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view for agent representing individual landowner with non-UK address`, async () => {
      let viewResult, contextResult
      const getHandler = checkApplicantInfoDetails[0].handler
      const h = {
        view: (view, context) => {
          viewResult = view
          contextResult = context
        }
      }

      redisMap.set(constants.redisKeys.APPLICANT_DETAILS_IS_AGENT, 'yes')
      redisMap.set(constants.redisKeys.IS_ADDRESS_UK, 'no')
      redisMap.set(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION, constants.landownerTypes.INDIVIDUAL)

      await getHandler({ yar: redisMap }, h)
      expect(viewResult).toEqual(constants.views.CHECK_APPLICANT_INFORMATION)
      expect(contextResult.actingForClient).toBe(true)
      expect(contextResult.accountDetailsUpToDate).toBe(true)
      expect(contextResult.addressIsUK).toBe(false)
      expect(contextResult.clientIsIndividual).toBe(true)
      expect(contextResult.clientAddress).toEqual('123 Le Street, Paris, France')
      expect(contextResult.clientName).toEqual('Joe George Smith')
      expect(contextResult.clientEmail).toEqual('me@me.com')
      expect(contextResult.clientPhone).toEqual('07000000000')
      expect(contextResult.authorisationFile).toEqual('authfile.pdf')
    })
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view for agent representing organisation landowner with UK address`, async () => {
      let viewResult, contextResult
      const getHandler = checkApplicantInfoDetails[0].handler
      const h = {
        view: (view, context) => {
          viewResult = view
          contextResult = context
        }
      }

      redisMap.set(constants.redisKeys.APPLICANT_DETAILS_IS_AGENT, 'yes')
      redisMap.set(constants.redisKeys.IS_ADDRESS_UK, 'yes')
      redisMap.set(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION, constants.landownerTypes.ORGANISATION)

      await getHandler({ yar: redisMap }, h)
      expect(viewResult).toEqual(constants.views.CHECK_APPLICANT_INFORMATION)
      expect(contextResult.actingForClient).toBe(true)
      expect(contextResult.accountDetailsUpToDate).toBe(true)
      expect(contextResult.addressIsUK).toBe(true)
      expect(contextResult.clientIsIndividual).toBe(false)
      expect(contextResult.clientAddress).toEqual('123 The Street, Townsville, AB12 3DE')
      expect(contextResult.clientName).toEqual('Land Company Ltd')
      expect(contextResult.authorisationFile).toEqual('authfile.pdf')
    })
  })

  describe('POST', () => {
    it('Should flow to register task list', async () => {
      const postHandler = checkApplicantInfoDetails[1].handler
      let redirectArgs = ''
      const h = {
        redirect: (...args) => {
          redirectArgs = args
        }
      }

      await postHandler({ yar: redisMap }, h)
      expect(redirectArgs[0]).toEqual(constants.routes.REGISTER_LAND_TASK_LIST)
    })
  })
})
