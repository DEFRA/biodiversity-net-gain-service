import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
import { SessionMap } from '../../../utils/sessionMap.js'
const url = constants.routes.LANDOWNER_INDIVIDUAL_ORGANISATION

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

    redisMap = new SessionMap()
    redisMap.set(constants.redisKeys.APPLICATION_TYPE, constants.applicationTypes.REGISTRATION)
    landOwnerConservation = require('../../land/landowner-individual-organisation.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    it('Should continue journey to ADD_LANDOWNER_INDIVIDUAL if individualOrOrganisation is individual', async () => {
      const request = {
        yar: redisMap,
        payload: { individualOrOrganisation: 'individual' },
        path: landOwnerConservation.default[1].path
      }

      await landOwnerConservation.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.ADD_LANDOWNER_INDIVIDUAL)
    })
    it('Should continue journey to ADD_LANDOWNER_ORGANISATION if individualOrOrganisation is organisation', async () => {
      const request = {
        yar: redisMap,
        payload: { individualOrOrganisation: 'organisation' },
        path: landOwnerConservation.default[1].path
      }

      await landOwnerConservation.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.ADD_LANDOWNER_ORGANISATION)
    })

    it('Should fail journey if no answer', async () => {
      const request = {
        yar: redisMap,
        payload: {},
        path: landOwnerConservation.default[1].path
      }

      await landOwnerConservation.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.LANDOWNER_INDIVIDUAL_ORGANISATION)
      expect(resultContext.err[0]).toEqual({ text: 'Select if the landowner or leaseholder is an individual or organisation', href: '#individualOrOrganisation' })
    })
  })
})
