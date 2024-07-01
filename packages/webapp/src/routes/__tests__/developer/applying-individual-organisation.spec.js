import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.DEVELOPER_APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION

const individualSignInErrorMessage = `
  You cannot apply as an organisation because the Defra account you’re signed into is linked to an individual.
  Register for or sign into a Defra account representing an organisation before continuing this application`

const organisationSignInErrorMessage = `
  You cannot apply as an individual because the Defra account you’re signed into is linked to an organisation.
  Register for or sign into a Defra account as yourself before continuing this application`

describe(url, () => {
  const redisMap = new Map()
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view without any selection`, async () => {
      await submitGetRequest({ url })
    })

    it(`should render the ${url.substring(1)} view with individual selected`, async () => {
      jest.isolateModules(async () => {
        redisMap.set(constants.redisKeys.DEVELOPER_LANDOWNER_TYPE, constants.individualOrOrganisationTypes.INDIVIDUAL)
        let viewResult, contextResult
        const applicationByIndividualOrOganisation = require('../../developer/applying-individual-organisation.js')
        const request = {
          yar: redisMap
        }
        const h = {
          view: (view, context) => {
            viewResult = view
            contextResult = context
          }
        }
        await applicationByIndividualOrOganisation.default[0].handler(request, h)
        expect(viewResult).toEqual(constants.views.DEVELOPER_APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION)
        expect(contextResult.individualOrOrganisation).toEqual(constants.individualOrOrganisationTypes.INDIVIDUAL)
      })
    })

    it(`should render the ${url.substring(1)} view with organisation selected`, async () => {
      jest.isolateModules(async () => {
        redisMap.set(constants.redisKeys.DEVELOPER_LANDOWNER_TYPE, constants.individualOrOrganisationTypes.ORGANISATION)
        let viewResult, contextResult
        const applicationByIndividualOrOganisation = require('../../developer/applying-individual-organisation.js')
        const request = {
          yar: redisMap
        }
        const h = {
          view: (view, context) => {
            viewResult = view
            contextResult = context
          }
        }
        await applicationByIndividualOrOganisation.default[0].handler(request, h)
        expect(viewResult).toEqual(constants.views.DEVELOPER_APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION)
        expect(contextResult.individualOrOrganisation).toEqual(constants.individualOrOrganisationTypes.ORGANISATION)
      })
    })
  })
  describe('POST', () => {
    const citizenSignInWithOrganisationLinkedToDefraAccountAuth = {
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
      postOptions.payload.individualOrOrganisation = constants.individualOrOrganisationTypes.INDIVIDUAL
      const response = await submitPostRequest(postOptions, 302)
      expect(response.request.response.headers.location).toBe(constants.routes.DEVELOPER_CHECK_DEFRA_ACCOUNT_DETAILS)
    })
    it('should redirect to the check Defra account details page when organisation is chosen and signed in representing an organisation', async () => {
      postOptions.payload.individualOrOrganisation = constants.individualOrOrganisationTypes.ORGANISATION
      postOptions.auth = organisationAuth
      const response = await submitPostRequest(postOptions, 302)
      expect(response.request.response.headers.location).toBe(constants.routes.DEVELOPER_CHECK_DEFRA_ACCOUNT_DETAILS)
    })
    it('should redisplay the applicant type page when no applicant type is chosen', async () => {
      const response = await submitPostRequest(postOptions, 200)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select if you are applying as an individual or as part of an organisation')
    })
    it('should redirect to the Defra account not linked page when organisation is chosen, the user signed is in as an individual and no organisation is linked to their Defra account', async () => {
      postOptions.payload.individualOrOrganisation = constants.individualOrOrganisationTypes.ORGANISATION
      const response = await submitPostRequest(postOptions, 302)
      expect(response.request.response.headers.location).toBe(constants.routes.DEVELOPER_DEFRA_ACCOUNT_NOT_LINKED)
    })
    it('should redisplay the applicant type page when organisation is chosen, the user signed is in as an individual and at least one organisation is linked to their Defra account', async () => {
      postOptions.payload.individualOrOrganisation = constants.individualOrOrganisationTypes.ORGANISATION
      postOptions.auth = citizenSignInWithOrganisationLinkedToDefraAccountAuth
      const response = await submitPostRequest(postOptions, 200)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain(individualSignInErrorMessage)
    })
    it('should redisplay the applicant type page when individual is chosen and signed in representing an organisation', async () => {
      postOptions.payload.individualOrOrganisation = constants.individualOrOrganisationTypes.INDIVIDUAL
      postOptions.auth = organisationAuth
      const response = await submitPostRequest(postOptions, 200)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain(organisationSignInErrorMessage)
    })
  })
})
