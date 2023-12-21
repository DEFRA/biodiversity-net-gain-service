import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.CHANGE_APPLYING_INDIVIDUAL_ORGANISATION

describe(url, () => {
  let viewResult
  let h
  let redisMap
  let resultContext
  let changeApplyingIndividualOrganisation

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
    changeApplyingIndividualOrganisation = require('../../land/change-applying-individual-organisation.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    it('Should continue journey to APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION if user confirms to changing legal agreement', async () => {
      const request = {
        yar: redisMap,
        payload: { changeApplyingIndividualOrganisation: 'yes' }
      }

      await changeApplyingIndividualOrganisation.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION)
    })
    it('Should continue journey to CHECK_APPLICANT_INFORMATION if user does not want to change applying as individual or organisation', async () => {
      const request = {
        yar: redisMap,
        payload: { changeApplyingIndividualOrganisation: 'no' }
      }

      await changeApplyingIndividualOrganisation.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.CHECK_APPLICANT_INFORMATION)
    })

    it('Should fail journey if no answer', async () => {
      const request = {
        yar: redisMap,
        payload: {}
      }

      await changeApplyingIndividualOrganisation.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.CHANGE_APPLYING_INDIVIDUAL_ORGANISATION)
      expect(resultContext.err[0]).toEqual({ text: 'Select yes if you want to change whether you’re applying as an individual or an organisation', href: '#changeApplyingIndividualOrganisation' })
    })
  })
})
