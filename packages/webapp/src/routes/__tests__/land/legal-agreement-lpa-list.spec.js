import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.LEGAL_AGREEMENT_LPA_LIST

describe(url, () => {
  let viewResult
  let h
  let redisMap
  let resultContext
  let legalAgreementLpaList

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
    redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_LPA_LIST, [
      'org1', 'org2', 'org3', 'org4'
    ])

    legalAgreementLpaList = require('../../land/legal-agreement-lpa-list.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })

    it('should show all legal parties that are added', async () => {
      const request = {
        yar: redisMap
      }

      await legalAgreementLpaList.default[0].handler(request, h)

      expect(viewResult).toEqual(constants.views.LEGAL_AGREEMENT_LPA_LIST)
      expect(resultContext.lpaList.length).toEqual(4)
    })
  })

  describe('POST', () => {
    it('Should continue journey to ADD_LEGAL_AGREEMENT_PARTIES if yes is chosen', async () => {
      const request = {
        yar: redisMap,
        payload: { allLpa: 'yes' }
      }

      await legalAgreementLpaList.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.ADD_LEGAL_AGREEMENT_PARTIES)
    })

    it('Should continue journey to LEGAL_AGREEMENT_CONCOV_LANDOWNER_ORG if no is chosen', async () => {
      const request = {
        yar: redisMap,
        payload: { allLpa: 'no' }
      }

      await legalAgreementLpaList.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.LEGAL_PARTY_ADD_TYPE)
    })

    it('Should fail journey if no answer', async () => {
      const request = {
        yar: redisMap,
        payload: {}
      }

      await legalAgreementLpaList.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.LEGAL_AGREEMENT_LPA_LIST)
      expect(resultContext.err[0]).toEqual({ text: 'Select yes if you have added all landowners or leaseholders', href: '#allLpa' })
    })
  })
})
