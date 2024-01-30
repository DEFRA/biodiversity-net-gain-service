import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants'

const url = constants.routes.ADD_LEGAL_AGREEMENT_PARTIES

describe(url, () => {
  let viewResult
  let h
  let redisMap
  let resultContext
  let addLegalAgreementParties

  beforeEach(() => {
    h = {
      view: (view, context) => {
        viewResult = view
        resultContext = context
      },
      redirect: (view, context) => {
        viewResult = view
      }
    }

    redisMap = new Map()
    redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_PARTIES, [
      {
        organisationName: 'org1',
        organisationRole: 'Developer',
        organisationOtherRole: 'undefined'
      },
      {
        organisationName: 'org2',
        organisationRole: 'Landowner',
        organisationOtherRole: 'undefined'
      }
    ])

    addLegalAgreementParties = require('../../land/add-legal-agreement-parties.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      const response = await submitGetRequest({ url })
      expect(response.statusCode).toBe(200)
    })
    it(`should render the ${url.substring(1)} view with organisation that use wants to change`, async () => {
      const request = {
        yar: redisMap,
        query: { orgId: '0' }
      }
      await addLegalAgreementParties.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.views.ADD_LEGAL_AGREEMENT_PARTIES)
      expect(resultContext.organisation).toEqual({
        organisationName: 'org1',
        organisationOtherRole: 'undefined',
        organisationRole: 'Developer'
      })
    })

    it(`should render the ${url.substring(1)} view without party details`, async () => {
      const request = {
        yar: redisMap,
        query: {}
      }
      await addLegalAgreementParties.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.views.ADD_LEGAL_AGREEMENT_PARTIES)
    })
  })

  describe('POST', () => {
    it('should add legal party to legal agreement and redirect to LEGAL_PARTY_LIST page', async () => {
      const request = {
        yar: redisMap,
        payload: {
          organisationName: 'org3',
          organisationOtherRole: 'undefined',
          organisationRole: 'Role3'
        },
        query: {}
      }

      await addLegalAgreementParties.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.LEGAL_PARTY_LIST)
    })

    it('should edit legal party to legal agreement and redirect to LEGAL_PARTY_LIST page by using orgId', async () => {
      const request = {
        yar: redisMap,
        payload: {
          organisationName: 'org3',
          organisationOtherRole: 'undefined',
          organisationRole: 'Role3'
        },
        query: { orgId: '0' }
      }

      await addLegalAgreementParties.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.LEGAL_PARTY_LIST)
    })

    it('should fail to add legal party to legal agreement without organisation name', async () => {
      const request = {
        yar: redisMap,
        payload: {
          organisationName: '',
          organisationOtherRole: 'undefined',
          organisationRole: 'Role3'
        },
        query: {}
      }

      await addLegalAgreementParties.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.ADD_LEGAL_AGREEMENT_PARTIES)
      expect(resultContext.organisationNameErr).toEqual({ text: 'Enter the name of the legal party', href: '#organisationName' })
    })
    it('should fail to add legal party to legal agreement with organisation name length > 50', async () => {
      const longOrganisationName = 'x'.repeat(51)
      const request = {
        yar: redisMap,
        payload: {
          organisationName: longOrganisationName,
          organisationRole: 'Developer',
          organisationOtherRole: ''
        },
        query: {}
      }
      await addLegalAgreementParties.default[1].handler(request, h)
      expect(viewResult).toEqual(constants.views.ADD_LEGAL_AGREEMENT_PARTIES)
      expect(resultContext.organisationNameErr).toEqual({
        text: 'Organisation name must be 50 characters or fewer',
        href: 'organisationNameId'
      })
    })

    it('should fail to add legal party to legal agreement without organisation role', async () => {
      const request = {
        yar: redisMap,
        payload: {
          organisationName: 'org3',
          organisationOtherRole: 'undefined',
          organisationRole: undefined
        },
        query: {}
      }

      await addLegalAgreementParties.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.ADD_LEGAL_AGREEMENT_PARTIES)
      expect(resultContext.organisationRoleErr).toEqual({ text: 'Select the role', href: '#localAuthorityRole' })
    })

    it('should fail to add legal party to legal agreement without organisation name and organisation role', async () => {
      const request = {
        yar: redisMap,
        payload: {
          organisationName: '',
          organisationOtherRole: 'undefined',
          organisationRole: undefined
        },
        query: {}
      }

      await addLegalAgreementParties.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.ADD_LEGAL_AGREEMENT_PARTIES)
      expect(resultContext.organisationNameErr).toEqual({ text: 'Enter the name of the legal party', href: '#organisationName' })
      expect(resultContext.organisationRoleErr).toEqual({ text: 'Select the role', href: '#localAuthorityRole' })
    })

    it('should fail to add legal party to legal agreement without organisation other role', async () => {
      const request = {
        yar: redisMap,
        payload: {
          organisationName: 'Test',
          organisationOtherRole: '',
          organisationRole: 'Other'
        },
        query: {}
      }

      await addLegalAgreementParties.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.ADD_LEGAL_AGREEMENT_PARTIES)
      expect(resultContext.organisationOtherRoleErr).toEqual({ text: 'Enter the role of the legal party', href: '#organisationOtherRole' })
    })
  })
})
