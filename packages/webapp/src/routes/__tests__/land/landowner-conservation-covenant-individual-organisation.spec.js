import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.LANDOWNER_CONSERVATION_COVENANT_INDIVIDUAL_ORGANISATION

describe(url, () => {
  let viewResult
  let h
  let redisMap
  let resultContext
  let landOwnerConservation

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
    landOwnerConservation = require('../../land/landowner-conservation-covenant-individual-organisation.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    it('Should continue journey to ADD_LANDOWNER_INDIVIDUAL_CONSERVATION_COVENANT if individualOrOrganisation is individual', async () => {
      const request = {
        yar: redisMap,
        payload: { individualOrOrganisation: 'individual' }
      }

      await landOwnerConservation.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.ADD_LANDOWNER_INDIVIDUAL_CONSERVATION_COVENANT)
    })
    it('Should continue journey to ADD_LANDOWNER_ORGANISATION_CONSERVATION_COVENANT if individualOrOrganisation is organisation', async () => {
      const request = {
        yar: redisMap,
        payload: { individualOrOrganisation: 'organisation' }
      }

      await landOwnerConservation.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.ADD_LANDOWNER_ORGANISATION_CONSERVATION_COVENANT)
    })

    it('Should fail journey if no answer', async () => {
      const request = {
        yar: redisMap,
        payload: {}
      }

      await landOwnerConservation.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.LANDOWNER_CONSERVATION_COVENANT_INDIVIDUAL_ORGANISATION)
      expect(resultContext.err[0]).toEqual({ text: 'Select if the landowner or leaseholder is an individual or organisation', href: '#individualOrOrganisation' })
    })
  })
})
