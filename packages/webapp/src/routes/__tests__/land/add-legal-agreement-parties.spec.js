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
    it('should redirect to Start page if no data applicant data is available in session', async () => {
      const response = await submitGetRequest({ url }, 302, {})
      expect(response.headers.location).toEqual(constants.routes.START)
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
      expect(resultContext.err[1]).toEqual({ text: 'Enter the name of the legal party', href: '#organisationName' })
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
      expect(resultContext.err[1]).toEqual({ text: 'Select the role', href: '#organisationRole' })
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
      expect(resultContext.err[1]).toEqual({ text: 'Enter the name of the legal party', href: '#organisationName' })
      expect(resultContext.err[2]).toEqual({ text: 'Select the role', href: '#organisationRole' })
    })
  })
})
