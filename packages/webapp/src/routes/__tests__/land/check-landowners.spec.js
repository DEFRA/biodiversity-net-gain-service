import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
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

    redisMap = new Map()
    redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENTS, [{
      organisationName: 'org1',
      type: 'organisation'
    }, {
      firstName: 'Crishn',
      middleNames: '',
      lastName: 'P',
      type: 'individual'
    }])
    landownersList = require('../../land/check-landowners.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })

    it('should show all landowners that are added', async () => {
      const request = {
        yar: redisMap
      }

      await landownersList.default[0].handler(request, h)

      expect(viewResult).toEqual(constants.views.CHECK_LANDOWNERS)
      expect(resultContext.landOwnerConservationConvents.length).toEqual(2)
    })
  })

  describe('POST', () => {
    it('Should continue journey to HABITAT_PLAN_LEGAL_AGREEMENT if yes is chosen', async () => {
      const request = {
        yar: redisMap,
        payload: { addAnotherLandowner: 'yes' }
      }

      await landownersList.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.HABITAT_PLAN_LEGAL_AGREEMENT)
    })

    it('Should continue journey to LANDOWNER_CONSERVATION_COVENANT_INDIVIDUAL_ORGANISATION if no is chosen', async () => {
      const request = {
        yar: redisMap,
        payload: { addAnotherLandowner: 'no' }
      }

      await landownersList.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.LANDOWNER_CONSERVATION_COVENANT_INDIVIDUAL_ORGANISATION)
    })

    it('Should fail journey if no answer', async () => {
      const request = {
        yar: redisMap,
        payload: {}
      }

      await landownersList.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.CHECK_LANDOWNERS)
      expect(resultContext.err[0]).toEqual({ text: 'Select yes if you have added all landowners or leaseholders', href: '#addAnotherLandowner' })
    })
  })
})
