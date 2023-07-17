import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.LEGAL_PARTY_REMOVE

describe('url', () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    let viewResult
    let h
    let redisMap
    let resultContext

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
          organisationName: 'kiran',
          organisationRole: 'Developer',
          organisationOtherRole: 'undefined'
        },
        {
          organisationName: 'kiran',
          organisationRole: 'Landowner',
          organisationOtherRole: 'undefined'
        }
      ])
    })

    it('Should continue journey to LEGAL_PARTY_LIST if yes is chosen and remove 1 legal party', async () => {
      const request = {
        yar: redisMap,
        payload: { legalPartyRemove: 'yes' },
        query: { orgId: '1' }
      }

      const legalPartyRemove = require('../../land/legal-party-remove.js')
      await legalPartyRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.LEGAL_PARTY_LIST)
      expect(redisMap.get(constants.redisKeys.LEGAL_AGREEMENT_PARTIES).length).toEqual(1)
    })

    it('Should continue journey to LEGAL_PARTY_LIST if no is chosen', async () => {
      const request = {
        yar: redisMap,
        payload: { legalPartyRemove: 'no' },
        query: { orgId: '1' }
      }

      const legalPartyRemove = require('../../land/legal-party-remove.js')
      await legalPartyRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.LEGAL_PARTY_LIST)
      expect(redisMap.get(constants.redisKeys.LEGAL_AGREEMENT_PARTIES).length).toEqual(2)
    })

    it('Should fail journey if no answer', async () => {
      const request = {
        yar: redisMap,
        payload: { },
        query: { orgId: '1' }
      }

      const legalPartyRemove = require('../../land/legal-party-remove.js')
      await legalPartyRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.LEGAL_PARTY_REMOVE)
      expect(resultContext.err[0]).toEqual({ text: 'Select yes if you want to remove legal party', href: '#legalPartyRemove' })
    })
  })
})
