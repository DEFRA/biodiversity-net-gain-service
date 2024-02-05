import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'

const url = constants.routes.ESTIMATOR_CREDITS_INDIVIDUAL_OR_ORG

const individualSignInErrorMessage = 'Select &#39;individual&#39; if you are purchasing statutory biodiversity credits as an individual'
const organisationSignInErrorMessage = 'Select &#39;organisation&#39; if you are purchasing statutory biodiversity credits as an organisation'

const creditsIndividualOrOganisation = require('../../credits-estimation/credits-individual-or-organisation.js')

describe(url, () => {
  const redisMap = new Map()
  describe('GET', () => {
    let viewResult, contextResult

    const h = {
      view: (view, context) => {
        viewResult = view
        contextResult = context
      }
    }

    it(`should render the ${url.substring(1)} view without any selection`, async () => {
      await submitGetRequest({ url }, 200, { 'estimator-credits-user-type': 'individual' })
    })

    it(`should render the ${url.substring(1)} view with individual selected`, async () => {
      jest.isolateModules(async () => {
        redisMap.set(constants.redisKeys.ESTIMATOR_CREDITS_USER_TYPE, constants.landownerTypes.INDIVIDUAL)

        await creditsIndividualOrOganisation.default[0].handler({ yar: redisMap }, h)
        expect(viewResult).toEqual(constants.views.ESTIMATOR_CREDITS_INDIVIDUAL_OR_ORG)
        expect(contextResult.userType).toEqual(constants.landownerTypes.INDIVIDUAL)
      })
    })

    it(`should render the ${url.substring(1)} view with organisation selected`, async () => {
      jest.isolateModules(async () => {
        redisMap.set(constants.redisKeys.ESTIMATOR_CREDITS_USER_TYPE, constants.landownerTypes.ORGANISATION)

        await creditsIndividualOrOganisation.default[0].handler({ yar: redisMap }, h)
        expect(viewResult).toEqual(constants.views.ESTIMATOR_CREDITS_INDIVIDUAL_OR_ORG)
        expect(contextResult.userType).toEqual(constants.landownerTypes.ORGANISATION)
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
      postOptions.payload.userType = constants.landownerTypes.INDIVIDUAL
      const response = await submitPostRequest(postOptions, 302, null, { expectedNumberOfPostJsonCalls: 0 })
      expect(response.request.response.headers.location).toBe(constants.routes.ESTIMATOR_CREDITS_APPLICANT_CONFIRM)
    })
    it('should redirect to the check Defra account details page when organisation is chosen and signed in representing an organisation', async () => {
      postOptions.payload.userType = constants.landownerTypes.ORGANISATION
      postOptions.auth = organisationAuth
      const response = await submitPostRequest(postOptions, 302, null, { expectedNumberOfPostJsonCalls: 0 })
      expect(response.request.response.headers.location).toBe(constants.routes.ESTIMATOR_CREDITS_APPLICANT_CONFIRM)
    })
    it('should redisplay the credits individual or organisation page when no applicant type is chosen', async () => {
      const response = await submitPostRequest(postOptions, 200)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select if you are applying as an individual or as part of an organisation')
    })
    it('should redirect to the Defra account not linked page when organisation is chosen, the user signed is in as an individual and no organisation is linked to their Defra account', async () => {
      postOptions.payload.userType = constants.landownerTypes.ORGANISATION
      const response = await submitPostRequest(postOptions, 302, null, { expectedNumberOfPostJsonCalls: 0 })
      expect(response.request.response.headers.location).toBe(constants.routes.ESTIMATOR_CREDITS_DEFRA_ACCOUNT_NOT_LINKED)
    })
    it('should redisplay the credits individual or organisation page when organisation is chosen, the user signed is in as an individual and at least one organisation is linked to their Defra account', async () => {
      postOptions.payload.userType = constants.landownerTypes.ORGANISATION
      postOptions.auth = userSignInWithOrganisationLinkedToDefraAccountAuth
      const response = await submitPostRequest(postOptions, 200)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain(individualSignInErrorMessage)
    })
    it('should redisplay the credits individual or organisation page when individual is chosen and signed in representing an organisation', async () => {
      postOptions.payload.userType = constants.landownerTypes.INDIVIDUAL
      postOptions.auth = organisationAuth
      const response = await submitPostRequest(postOptions, 200)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain(organisationSignInErrorMessage)
    })
  })
})
