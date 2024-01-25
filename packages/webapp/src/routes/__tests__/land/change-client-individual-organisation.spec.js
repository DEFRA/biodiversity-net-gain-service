import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.CHANGE_CLIENT_INDIVIDUAL_ORGANISATION

describe(url, () => {
  let viewResult
  let h
  let redisMap
  let resultContext
  let changeClientIndividualOrganisation

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
    changeClientIndividualOrganisation = require('../../land/change-client-individual-organisation.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    it('Should continue journey to CLIENT_INDIVIDUAL_ORGANISATION if user confirms to changing individual or organisation', async () => {
      const request = {
        yar: redisMap,
        payload: { changeClientIndividualOrganisation: 'yes' }
      }

      await changeClientIndividualOrganisation.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.CLIENT_INDIVIDUAL_ORGANISATION)
    })
    it('Should continue journey to CHECK_APPLICANT_INFORMATION if user does not want to change if the client is individual or organisation', async () => {
      const request = {
        yar: redisMap,
        payload: { changeClientIndividualOrganisation: 'no' }
      }

      await changeClientIndividualOrganisation.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.CHECK_APPLICANT_INFORMATION)
    })

    it('Should fail journey if no answer', async () => {
      const request = {
        yar: redisMap,
        payload: {}
      }

      await changeClientIndividualOrganisation.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.CHANGE_CLIENT_INDIVIDUAL_ORGANISATION)
      expect(resultContext.err[0]).toEqual({ text: 'Select yes if you want to change whether your client is an individual or organisation', href: '#changeClientIndividualOrganisation' })
    })
  })
})
