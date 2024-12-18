import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
import checkApplicantInfoDetails from '../../land/check-applicant-information.js'

const url = constants.routes.CHECK_APPLICANT_INFORMATION

describe(url, () => {
  let redisMap

  beforeEach(() => {
    redisMap = new Map()

    redisMap.set(constants.redisKeys.DEFRA_ACCOUNT_DETAILS_CONFIRMED, 'true')
    redisMap.set(constants.redisKeys.IS_ADDRESS_UK_KEY, 'yes')
    redisMap.set(constants.redisKeys.UK_ADDRESS_KEY, {
      addressLine1: '123 The Street',
      town: 'Townsville',
      postcode: 'AB12 3DE'
    })
    redisMap.set(constants.redisKeys.NON_UK_ADDRESS_KEY, {
      addressLine1: '123 Le Street',
      town: 'Paris',
      country: 'France'
    })
    redisMap.set(constants.redisKeys.CLIENTS_NAME_KEY, {
      type: 'individual',
      value: {
        firstName: 'Joe',
        lastName: 'Smith'
      }
    })
    redisMap.set(constants.redisKeys.IS_AGENT, 'yes')
    redisMap.set(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY, constants.individualOrOrganisationTypes.INDIVIDUAL)
    redisMap.set(constants.redisKeys.CLIENTS_ORGANISATION_NAME_KEY, 'Land Company Ltd')
    redisMap.set(constants.redisKeys.CLIENTS_EMAIL_ADDRESS_KEY, 'me@me.com')
    redisMap.set(constants.redisKeys.CLIENTS_PHONE_NUMBER_KEY, '07000000000')
    redisMap.set(constants.redisKeys.WRITTEN_AUTHORISATION_LOCATION, '/a-location/somewhere/authfile.pdf')
    redisMap.set(constants.redisKeys.WRITTEN_AUTHORISATION_FILE_SIZE, 7515)
    redisMap.set(constants.redisKeys.WRITTEN_AUTHORISATION_FILE_TYPE, 'application/pdf')
    redisMap.set(constants.redisKeys.WRITTEN_AUTHORISATION_CHECKED, 'yes')
    redisMap.set(constants.redisKeys.APPLICATION_TYPE, constants.applicationTypes.REGISTRATION)
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
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

      redisMap.set(constants.redisKeys.IS_AGENT, 'no')
      redisMap.set(constants.redisKeys.IS_ADDRESS_UK_KEY, 'yes')
      redisMap.set(constants.redisKeys.LANDOWNER_TYPE, constants.individualOrOrganisationTypes.INDIVIDUAL)

      await getHandler({ yar: redisMap }, h)
      expect(viewResult).toEqual(constants.views.CHECK_APPLICANT_INFORMATION)
      expect(contextResult.actingForClient).toBe(false)
      expect(contextResult.accountDetailsUpToDate).toBe(true)
      expect(contextResult.addressIsUK).toBe(true)
      expect(contextResult.applicantIsIndividual).toBe(true)
      expect(contextResult.applicantAddress).toEqual('123 The Street<br>Townsville<br>AB12 3DE')
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

      redisMap.set(constants.redisKeys.IS_AGENT, 'no')
      redisMap.set(constants.redisKeys.IS_ADDRESS_UK_KEY, 'no')
      redisMap.set(constants.redisKeys.LANDOWNER_TYPE, constants.individualOrOrganisationTypes.ORGANISATION)

      await getHandler({ yar: redisMap }, h)
      expect(viewResult).toEqual(constants.views.CHECK_APPLICANT_INFORMATION)
      expect(contextResult.actingForClient).toBe(false)
      expect(contextResult.accountDetailsUpToDate).toBe(true)
      expect(contextResult.addressIsUK).toBe(false)
      expect(contextResult.applicantIsIndividual).toBe(false)
      expect(contextResult.applicantAddress).toEqual('123 Le Street<br>Paris<br>France')
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

      redisMap.set(constants.redisKeys.IS_AGENT, 'yes')
      redisMap.set(constants.redisKeys.IS_ADDRESS_UK_KEY, 'no')
      redisMap.set(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY, constants.individualOrOrganisationTypes.INDIVIDUAL)

      await getHandler({ yar: redisMap }, h)
      expect(viewResult).toEqual(constants.views.CHECK_APPLICANT_INFORMATION)
      expect(contextResult.actingForClient).toBe(true)
      expect(contextResult.accountDetailsUpToDate).toBe(true)
      expect(contextResult.addressIsUK).toBe(false)
      expect(contextResult.clientIsIndividual).toBe(true)
      expect(contextResult.clientAddress).toEqual('123 Le Street<br>Paris<br>France')
      expect(contextResult.clientName).toEqual('Joe Smith')
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

      redisMap.set(constants.redisKeys.IS_AGENT, 'yes')
      redisMap.set(constants.redisKeys.IS_ADDRESS_UK_KEY, 'yes')
      redisMap.set(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY, constants.individualOrOrganisationTypes.ORGANISATION)

      await getHandler({ yar: redisMap }, h)
      expect(viewResult).toEqual(constants.views.CHECK_APPLICANT_INFORMATION)
      expect(contextResult.actingForClient).toBe(true)
      expect(contextResult.accountDetailsUpToDate).toBe(true)
      expect(contextResult.addressIsUK).toBe(true)
      expect(contextResult.clientIsIndividual).toBe(false)
      expect(contextResult.clientAddress).toEqual('123 The Street<br>Townsville<br>AB12 3DE')
      expect(contextResult.clientName).toEqual('Land Company Ltd')
      expect(contextResult.authorisationFile).toEqual('authfile.pdf')
    })
  })
  describe('GET', () => {
    it('should redirect to REGISTER_LAND_TASK_LIST view if mandatory data missing', done => {
      jest.isolateModules(async () => {
        try {
          redisMap.set(constants.redisKeys.WRITTEN_AUTHORISATION_LOCATION, undefined)
          let redirectArgs = ''
          const request = {
            yar: redisMap
          }
          const h = {
            redirect: (...args) => {
              redirectArgs = args
            }
          }
          await checkApplicantInfoDetails[0].handler(request, h)
          expect(redirectArgs).toEqual([constants.routes.REGISTER_LAND_TASK_LIST])
          done()
        } catch (err) {
          done(err)
        }
      })
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

      await postHandler({ yar: redisMap, path: checkApplicantInfoDetails[1].path }, h)
      expect(redirectArgs[0]).toEqual(constants.routes.REGISTER_LAND_TASK_LIST)
    })
  })
})
