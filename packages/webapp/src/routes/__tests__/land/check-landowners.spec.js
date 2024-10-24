import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
import { SessionMap } from '../../../utils/sessionMap.js'
const url = constants.routes.CHECK_LANDOWNERS

describe(url, () => {
  let viewResult
  let h
  let redisMap
  let resultContext
  let landownersList

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
    redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS, [{
      organisationName: 'org1',
      type: 'organisation',
      emailAddress: 'me@me.com'
    }, {
      firstName: 'Crishn',
      lastName: 'P',
      emailAddress: 'me@me.com',
      type: 'individual'
    }])
    landownersList = require('../../land/check-landowners.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
    it('should format individual landowner names and email addresses correctly', async () => {
      redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS, [{
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john.doe@example.com',
        type: 'individual'
      }])

      const request = {
        yar: redisMap
      }

      await landownersList.default[0].handler(request, h)
      const expectedText = 'John Doe (john.doe@example.com)'
      expect(resultContext.landOwnerConservationConvenantsWithAction[0].key.text).toEqual(expectedText)
    })
    it('should format orgainization landowner names and email addresses correctly', async () => {
      redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS, [{
        organisationName: 'org1',
        emailAddress: 'org1@example.com',
        type: 'organisation'
      }])

      const request = {
        yar: redisMap
      }

      await landownersList.default[0].handler(request, h)
      const expectedText = 'org1 (org1@example.com)'
      expect(resultContext.landOwnerConservationConvenantsWithAction[0].key.text).toEqual(expectedText)
    })
    it('should show all landowners that are added', async () => {
      const request = {
        yar: redisMap
      }

      await landownersList.default[0].handler(request, h)

      expect(viewResult).toEqual(constants.views.CHECK_LANDOWNERS)
      expect(resultContext.landOwnerConservationConvenants.length).toEqual(2)
    })
    it('Should continue journey to NEED_ADD_ALL_LANDOWNERS if all landowners removed', async () => {
      redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS, [])
      const request = {
        yar: redisMap,
        query: { id: '0' }
      }
      await landownersList.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.routes.NEED_ADD_ALL_LANDOWNERS)
    })
  })

  describe('POST', () => {
    it('Should continue journey to HABITAT_PLAN_LEGAL_AGREEMENT if yes is chosen', async () => {
      const request = {
        yar: redisMap,
        payload: { addAnotherLandowner: 'yes' },
        path: landownersList.default[1].path
      }

      await landownersList.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.HABITAT_PLAN_LEGAL_AGREEMENT)
    })

    it('Should continue journey to LANDOWNER_INDIVIDUAL_ORGANISATION if no is chosen', async () => {
      const request = {
        yar: redisMap,
        payload: { addAnotherLandowner: 'no' },
        path: landownersList.default[1].path
      }

      await landownersList.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.LANDOWNER_INDIVIDUAL_ORGANISATION)
    })

    it('Should fail journey if no answer', async () => {
      const request = {
        yar: redisMap,
        payload: {},
        path: landownersList.default[1].path
      }

      await landownersList.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.CHECK_LANDOWNERS)
      expect(resultContext.err[0]).toEqual({ text: 'Select yes if you have added all landowners or leaseholders', href: '#addAnotherLandowner' })
    })
  })
})
