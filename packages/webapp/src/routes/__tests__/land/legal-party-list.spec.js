import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.LEGAL_PARTY_LIST

describe('url', () => {
  let viewResult
  let h
  let redisMap
  let resultContext
  let legalPartyList

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

    legalPartyList = require('../../land/legal-party-list.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      const response = await submitGetRequest({ url })
      expect(response.statusCode).toBe(200)
    })

    it('should show all legal parties that are added', async () => {
      const request = {
        yar: redisMap
      }

      await legalPartyList.default[0].handler(request, h)

      expect(viewResult).toEqual(constants.views.LEGAL_PARTY_LIST)
      expect(resultContext.legalAgreementParties.length).toEqual(2)
    })
  })

  describe('POST', () => {
    it('Should continue journey to ADD_LEGAL_AGREEMENT_PARTIES if yes is chosen', async () => {
      const request = {
        yar: redisMap,
        payload: { addAnotherLegalParty: 'yes' }
      }

      await legalPartyList.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.ADD_LEGAL_AGREEMENT_PARTIES)
    })

    it('Should continue journey to LEGAL_AGREEMENT_START_DATE if no is chosen', async () => {
      const request = {
        yar: redisMap,
        payload: { addAnotherLegalParty: 'no' }
      }

      await legalPartyList.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.LEGAL_AGREEMENT_START_DATE)
    })

    it('Should fail journey if no answer', async () => {
      const request = {
        yar: redisMap,
        payload: {}
      }

      await legalPartyList.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.LEGAL_PARTY_LIST)
      expect(resultContext.err[0]).toEqual({ text: 'Select yes if you need to add another legal party', href: '#addAnotherLegalParty' })
    })
  })
})
