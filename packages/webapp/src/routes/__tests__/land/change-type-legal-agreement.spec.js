import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.CHANGE_TYPE_LEGAL_AGREEMENT

describe(url, () => {
  let viewResult
  let h
  let redisMap
  let resultContext
  let changeTypeLegalAgreement

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
    changeTypeLegalAgreement = require('../../land/change-type-legal-agreement.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    it('Should continue journey to LEGAL_AGREEMENT_TYPE if user confirms to changing legal agreement', async () => {
      const request = {
        yar: redisMap,
        payload: { changeLegalAgreementType: 'yes' }
      }

      await changeTypeLegalAgreement.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.LEGAL_AGREEMENT_TYPE)
    })
    it('Should continue journey to CHECK_LEGAL_AGREEMENT_DETAILS if user does not want to change legal agreement', async () => {
      const request = {
        yar: redisMap,
        payload: { changeLegalAgreementType: 'no' }
      }

      await changeTypeLegalAgreement.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS)
    })

    it('Should fail journey if no answer', async () => {
      const request = {
        yar: redisMap,
        payload: {}
      }

      await changeTypeLegalAgreement.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.CHANGE_TYPE_LEGAL_AGREEMENT)
      expect(resultContext.err[0]).toEqual({ text: 'Select yes if you want to change the type of legal agreement', href: '#changeLegalTypeAgreement' })
    })
  })
})
