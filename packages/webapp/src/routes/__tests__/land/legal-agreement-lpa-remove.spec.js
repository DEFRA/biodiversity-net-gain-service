import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.LEGAL_AGREEMENT_LPA_REMOVE

describe(url, () => {
  let viewResult
  let h
  let cacheMap
  let resultContext
  let legalAgreementLpaRemove

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
    cacheMap.set(constants.cacheKeys.LEGAL_AGREEMENT_LPA_LIST, [
      { type: 'organisation', value: 'org1' },
      { type: 'organisation', value: 'org2' },
      { type: 'organisation', value: 'org3' },
      { type: 'organisation', value: 'org4' }
    ])

    legalAgreementLpaRemove = require('../../land/legal-agreement-lpa-remove.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })

    it('should show correct party to be removed', async () => {
      const request = {
        yar: cacheMap,
        query: { id: '0' }
      }

      await legalAgreementLpaRemove.default[0].handler(request, h)

      expect(viewResult).toEqual(constants.views.LEGAL_AGREEMENT_LPA_REMOVE)
      expect(resultContext.lpaToRemove).toEqual('org1')
    })
  })

  describe('POST', () => {
    it('Should continue journey to LEGAL_AGREEMENT_LPA_LIST if yes is chosen and remove 1 legal party', async () => {
      const request = {
        yar: cacheMap,
        payload: { lpaRemove: 'yes' },
        query: { orgId: '1' }
      }

      await legalAgreementLpaRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.LEGAL_AGREEMENT_LPA_LIST)
      expect(cacheMap.get(constants.cacheKeys.LEGAL_AGREEMENT_LPA_LIST).length).toEqual(3)
    })

    it('Should continue journey to LEGAL_AGREEMENT_LPA_LIST if no is chosen', async () => {
      const request = {
        yar: cacheMap,
        payload: { lpaRemove: 'no' },
        query: { orgId: '1' }
      }

      await legalAgreementLpaRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.LEGAL_AGREEMENT_LPA_LIST)
      expect(cacheMap.get(constants.cacheKeys.LEGAL_AGREEMENT_LPA_LIST).length).toEqual(4)
    })

    it('Should fail journey if no answer', async () => {
      const request = {
        yar: cacheMap,
        payload: { },
        query: { orgId: '1' }
      }

      await legalAgreementLpaRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.LEGAL_AGREEMENT_LPA_REMOVE)
      expect(resultContext.err[0]).toEqual({ text: 'Select yes if you want to remove legal agreement lpa', href: '#lpaRemove' })
    })
  })
})
