import creditsPurchaseConstants from '../../../utils/credits-purchase-constants.js'
import { submitPostRequest } from '../helpers/server.js'

const url = creditsPurchaseConstants.routes.CREDITS_PURCHASE_INDIVIDUAL_OR_ORG

const individualSignInErrorMessage = `
  You cannot purchase statutory biodiversity credits as an organisation because the Defra account you’re signed into is linked to an individual.
  Register for or sign into a Defra account representing an organisation before continuing this application`

const organisationSignInErrorMessage = `
  You cannot purchase statutory biodiversity credits as an individual because the Defra account you’re signed into is linked to an organisation.
  Register for or sign into a Defra account as yourself before continuing this application`

const creditsIndividualOrOganisation = require('../../credits-purchase/purchasing-individual-organisation.js')

describe(url, () => {
  let viewResult
  let h
  let redisMap
  let contextResult
  let request

  beforeEach(() => {
    h = {
      view: (view, context) => {
        viewResult = view
        contextResult = context
      },
      redirect: (url) => {
        viewResult = url
      }
    }

    redisMap = new Map()

    request = {
      yar: {
        get: (key) => redisMap.get(key),
        set: (key, value) => redisMap.set(key, value),
        clear: (key) => redisMap.delete(key)
      }
    }
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view with individual selected`, async () => {
      jest.isolateModules(async () => {
        redisMap.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_USER_TYPE, creditsPurchaseConstants.applicantTypes.INDIVIDUAL)

        await creditsIndividualOrOganisation.default[0].handler(request, h)

        expect(viewResult).toEqual(creditsPurchaseConstants.views.CREDITS_PURCHASE_INDIVIDUAL_OR_ORG)
        expect(contextResult.userType).toEqual(creditsPurchaseConstants.applicantTypes.INDIVIDUAL)
      })
    })

    it(`should render the ${url.substring(1)} view with organisation selected`, async () => {
      jest.isolateModules(async () => {
        redisMap.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_USER_TYPE, creditsPurchaseConstants.applicantTypes.ORGANISATION)

        await creditsIndividualOrOganisation.default[0].handler(request, h)

        expect(viewResult).toEqual(creditsPurchaseConstants.views.CREDITS_PURCHASE_INDIVIDUAL_OR_ORG)
        expect(contextResult.userType).toEqual(creditsPurchaseConstants.applicantTypes.ORGANISATION)
      })
    })

    it('should render the view with the correct error message when user doesnt select individual or organisation', async () => {
      jest.isolateModules(async () => {
        redisMap.set('errorMessages', ['Select if you are applying as an individual or as part of an organisation'])
        redisMap.set('errorList', [{ text: 'Select if you are applying as an individual or as part of an organisation', href: '#creditsIndividualOrganisation' }])
        redisMap.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_USER_TYPE, '')

        await creditsIndividualOrOganisation.default[0].handler({ yar: redisMap }, h)
        expect(viewResult).toEqual(creditsPurchaseConstants.views.CREDITS_PURCHASE_INDIVIDUAL_OR_ORG)
        expect(contextResult.errorMessages).toEqual(['Select if you are applying as an individual or as part of an organisation'])
        expect(contextResult.err).toEqual([{ text: 'Select if you are applying as an individual or as part of an organisation', href: '#creditsIndividualOrganisation' }])
      })
    })

    it('should render the view with the correct error message when individual is chosen and signed in representing an organisation', async () => {
      jest.isolateModules(async () => {
        redisMap.set('errorMessages', [individualSignInErrorMessage])
        redisMap.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_USER_TYPE, creditsPurchaseConstants.applicantTypes.INDIVIDUAL)

        await creditsIndividualOrOganisation.default[0].handler({ yar: redisMap }, h)
        expect(viewResult).toEqual(creditsPurchaseConstants.views.CREDITS_PURCHASE_INDIVIDUAL_OR_ORG)
        expect(contextResult.errorMessages).toEqual([individualSignInErrorMessage])
      })
    })

    it('should render the view with the correct error message when organisation is chosen and signed in as an individual', async () => {
      jest.isolateModules(async () => {
        redisMap.set('errorMessages', [organisationSignInErrorMessage])
        redisMap.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_USER_TYPE, creditsPurchaseConstants.applicantTypes.ORGANISATION)

        await creditsIndividualOrOganisation.default[0].handler({ yar: redisMap }, h)
        expect(viewResult).toEqual(creditsPurchaseConstants.views.CREDITS_PURCHASE_INDIVIDUAL_OR_ORG)
        expect(contextResult.errorMessages).toEqual([organisationSignInErrorMessage])
      })
    })
  })

  describe('POST', () => {
    const userSignInWithOrganisationLinkedToDefraAccountAuth = {
      strategy: 'session-auth',
      credentials: {
        account: {
          idTokenClaims: {
            firstName: 'John',
            lastName: 'Smith',
            email: 'john.smith@test.com',
            contactId: 'mock contact id',
            enrolmentCount: 2,
            currentRelationshipId: 'mock relationship id',
            relationships: ['mock relationship id:::0:Citizen:0'],
            roles: ['mock relationship id:Standard User:2']
          }
        }
      }
    }
    const organisationAuth = {
      strategy: 'session-auth',
      credentials: {
        account: {
          idTokenClaims: {
            firstName: 'John',
            lastName: 'Smith',
            email: 'john.smith@test.com',
            contactId: 'mock contact id',
            enrolmentCount: 1,
            currentRelationshipId: 'mock relationship id',
            relationships: ['mock relationship id:mock organisation id:mock organisation:0:Employee:0'],
            roles: ['mock relationship id:Standard User:3']
          }
        }
      }
    }
    let postOptions
    beforeEach(async () => {
      postOptions = {
        url,
        payload: {}
      }
    })

    it('should redirect to the check Defra account details page when individual is chosen and signed in as an individual', async () => {
      postOptions.payload.userType = creditsPurchaseConstants.applicantTypes.INDIVIDUAL
      const response = await submitPostRequest(postOptions, 302, null, { expectedNumberOfPostJsonCalls: 1 })
      expect(response.request.response.headers.location).toBe(creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_DEFRA_ACCOUNT_DETAILS)
    })

    it('should redirect to the check Defra account details page when organisation is chosen and signed in representing an organisation', async () => {
      postOptions.payload.userType = creditsPurchaseConstants.applicantTypes.ORGANISATION
      postOptions.auth = organisationAuth
      const response = await submitPostRequest(postOptions, 302, null, { expectedNumberOfPostJsonCalls: 1 })
      expect(response.request.response.headers.location).toBe(creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_DEFRA_ACCOUNT_DETAILS)
    })

    it('should redisplay the credits individual or organisation page when no applicant type is chosen', async () => {
      const res = await submitPostRequest(postOptions, 302, null, { expectedNumberOfPostJsonCalls: 0 })
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_INDIVIDUAL_OR_ORG)
    })

    it('should redirect to the Defra account not linked page when organisation is chosen, the user signed is in as an individual and no organisation is linked to their Defra account', async () => {
      postOptions.payload.userType = creditsPurchaseConstants.applicantTypes.ORGANISATION
      const response = await submitPostRequest(postOptions, 302, null, { expectedNumberOfPostJsonCalls: 1 })
      expect(response.request.response.headers.location).toBe(creditsPurchaseConstants.routes.CREDITS_PURCHASE_DEFRA_ACCOUNT_NOT_LINKED)
    })

    it('should redisplay the credits individual or organisation page when organisation is chosen, the user signed is in as an individual and at least one organisation is linked to their Defra account', async () => {
      postOptions.payload.userType = creditsPurchaseConstants.applicantTypes.ORGANISATION
      postOptions.auth = userSignInWithOrganisationLinkedToDefraAccountAuth
      const response = await submitPostRequest(postOptions, 302, null, { expectedNumberOfPostJsonCalls: 0 })
      expect(response.headers.location).toBe(creditsPurchaseConstants.routes.CREDITS_PURCHASE_INDIVIDUAL_OR_ORG)
    })

    it('should redisplay the credits individual or organisation page when individual is chosen and signed in representing an organisation', async () => {
      postOptions.payload.userType = creditsPurchaseConstants.applicantTypes.INDIVIDUAL
      postOptions.auth = organisationAuth
      const response = await submitPostRequest(postOptions, 302, null, { expectedNumberOfPostJsonCalls: 0 })
      expect(response.headers.location).toBe(creditsPurchaseConstants.routes.CREDITS_PURCHASE_INDIVIDUAL_OR_ORG)
    })
  })
})
