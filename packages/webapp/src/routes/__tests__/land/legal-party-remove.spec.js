import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.LEGAL_PARTY_REMOVE

describe(url, () => {
  let viewResult
  let h
  let cacheMap
  let resultContext
  let legalPartyRemove

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

    cacheMap = new Map()
    cacheMap.set(constants.cacheKeys.LEGAL_AGREEMENT_PARTIES, [
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

    legalPartyRemove = require('../../land/legal-party-remove.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })

    it('should show correct party to be removed', async () => {
      const request = {
        yar: cacheMap,
        query: { orgId: '0' }
      }

      await legalPartyRemove.default[0].handler(request, h)

      expect(viewResult).toEqual(constants.views.LEGAL_PARTY_REMOVE)
      expect(resultContext.orgToRemove).toEqual({
        organisationName: 'org1',
        organisationRole: 'Developer',
        organisationOtherRole: 'undefined'
      })
    })
  })

  describe('POST', () => {
    it('Should continue journey to LEGAL_PARTY_LIST if yes is chosen and remove 1 legal party', async () => {
      const request = {
        yar: cacheMap,
        payload: { legalPartyRemove: 'yes' },
        query: { orgId: '1' }
      }

      await legalPartyRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.LEGAL_PARTY_LIST)
      expect(cacheMap.get(constants.cacheKeys.LEGAL_AGREEMENT_PARTIES).length).toEqual(1)
    })

    it('Should continue journey to LEGAL_PARTY_LIST if no is chosen', async () => {
      const request = {
        yar: cacheMap,
        payload: { legalPartyRemove: 'no' },
        query: { orgId: '1' }
      }

      await legalPartyRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.LEGAL_PARTY_LIST)
      expect(cacheMap.get(constants.cacheKeys.LEGAL_AGREEMENT_PARTIES).length).toEqual(2)
    })

    it('Should fail journey if no answer', async () => {
      const request = {
        yar: cacheMap,
        payload: { },
        query: { orgId: '1' }
      }

      await legalPartyRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.LEGAL_PARTY_REMOVE)
      expect(resultContext.err[0]).toEqual({ text: 'Select yes if you want to remove legal party', href: '#legalPartyRemove' })
    })
  })
})
