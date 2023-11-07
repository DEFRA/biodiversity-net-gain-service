import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION

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
        redisMap.set(constants.redisKeys.LANDOWNER_TYPE, constants.landownerTypes.INDIVIDUAL)
        let viewResult, contextResult
        const applicationByIndividualOrOganisation = require('../../land/applying-individual-organisation.js')
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
        expect(viewResult).toEqual(constants.views.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION)
        expect(contextResult.landownerType).toEqual(constants.landownerTypes.INDIVIDUAL)
      })
    })

    it(`should render the ${url.substring(1)} view with organisation selected`, async () => {
      jest.isolateModules(async () => {
        redisMap.set(constants.redisKeys.LANDOWNER_TYPE, constants.landownerTypes.ORGANISATION)
        let viewResult, contextResult
        const applicationByIndividualOrOganisation = require('../../land/applying-individual-organisation.js')
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
        expect(viewResult).toEqual(constants.views.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION)
        expect(contextResult.landownerType).toEqual(constants.landownerTypes.ORGANISATION)
      })
    })
  })
  describe('POST', () => {
    const organisationAuth = {
      strategy: 'session-auth',
      credentials: {
        account: {
          idTokenClaims: {
            firstName: 'John',
            lastName: 'Smith',
            email: 'john.smith@test.com',
            contactId: 'mock contact id',
            currentRelationshipId: 'mock relationship id',
            relationships: ['mock relationship id:mock organisation:0:Employee:0'],
            roles: ['mock relationship id:Standard User:2']
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
      postOptions.payload.landownerType = constants.landownerTypes.INDIVIDUAL
      const response = await submitPostRequest(postOptions, 302)
      expect(response.request.response.headers.location).toBe(constants.routes.CHECK_DEFRA_ACCOUNT_DETAILS)
    })
    it('should redirect to the check Defra account details page when organisation is chosen and signed in representing an organisation', async () => {
      postOptions.payload.landownerType = constants.landownerTypes.ORGANISATION
      postOptions.auth = organisationAuth
      const response = await submitPostRequest(postOptions, 302)
      expect(response.request.response.headers.location).toBe(constants.routes.CHECK_DEFRA_ACCOUNT_DETAILS)
    })
    it('should redisplay the applicant type page when no applicant type is chosen', async () => {
      const response = await submitPostRequest(postOptions, 200)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select if you are applying as an individual or as part of an organisation')
    })
    it('should redisplay the applicant type page when organisation is chosen and signed in as an individual', async () => {
      postOptions.payload.landownerType = constants.landownerTypes.ORGANISATION
      const response = await submitPostRequest(postOptions, 200)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain(individualSignInErrorMessage)
    })
    it('should redisplay the applicant type page when individual is chosen and signed in representing an organisation', async () => {
      postOptions.payload.landownerType = constants.landownerTypes.INDIVIDUAL
      postOptions.auth = organisationAuth
      const response = await submitPostRequest(postOptions, 200)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain(organisationSignInErrorMessage)
    })
  })
})
