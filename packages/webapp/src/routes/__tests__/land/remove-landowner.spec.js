import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.REMOVE_LANDOWNER

describe(url, () => {
  let viewResult
  let h
  let redisMap
  let resultContext
  let landownerRemove

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
    redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS, [{
      organisationName: 'org1',
      type: 'organisation'
    }, {
      firstName: 'Crishn',
      middleNames: '',
      lastName: 'P',
      type: 'individual'
    }])

    landownerRemove = require('../../land/remove-landowner.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })

    it('should show correct organisation landowner to be removed.', async () => {
      const request = {
        yar: redisMap,
        query: { id: '0' }
      }

      await landownerRemove.default[0].handler(request, h)

      expect(resultContext.landownerToRemoveText).toEqual(
        'org1'
      )
    })
    it('should show correct individual landowner to be removed.', async () => {
      const request = {
        yar: redisMap,
        query: { id: '1' }
      }

      await landownerRemove.default[0].handler(request, h)

      expect(resultContext.landownerToRemoveText).toEqual(
        'Crishn P'
      )
    })
    it('Should continue journey to NEED_ADD_ALL_LANDOWNERS_CONSERVATION_COVENANT if all landowners removed', async () => {
      redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS, [])
      const request = {
        yar: redisMap,
        query: { id: '0' }
      }
      await landownerRemove.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.routes.NEED_ADD_ALL_LANDOWNERS_CONSERVATION_COVENANT)
    })
  })

  describe('POST', () => {
    it('Should continue journey to CHECK_LANDOWNERS if yes is chosen and remove 1 landowner individual', async () => {
      const request = {
        yar: redisMap,
        payload: { landownerToRemove: 'yes' },
        query: { id: '1' }
      }

      await landownerRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.CHECK_LANDOWNERS)
      expect(redisMap.get(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS).length).toEqual(1)
    })
    it('Should continue journey to CHECK_LANDOWNERS if yes is chosen and remove 1 landowner organisation', async () => {
      const request = {
        yar: redisMap,
        payload: { landownerToRemove: 'yes' },
        query: { id: '0' }
      }

      await landownerRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.CHECK_LANDOWNERS)
      expect(redisMap.get(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS).length).toEqual(1)
    })
    it('Should continue journey to CHECK_LANDOWNERS if no is chosen', async () => {
      const request = {
        yar: redisMap,
        payload: { landownerToRemove: 'no' },
        query: { id: '1' }
      }

      await landownerRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.CHECK_LANDOWNERS)
      expect(redisMap.get(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS).length).toEqual(2)
    })

    it('Should fail journey if no answer for individual', async () => {
      const request = {
        yar: redisMap,
        payload: { },
        query: { id: '1' }
      }

      await landownerRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.REMOVE_LANDOWNER)

      expect(resultContext.err[0]).toEqual({ text: 'Select yes if you want to remove landowner or leaseholder', href: '#legalPartyBodyToRemove' })
    })
    it('Should fail journey if no answer for organisation', async () => {
      const request = {
        yar: redisMap,
        payload: { },
        query: { id: '0' }
      }

      await landownerRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.REMOVE_LANDOWNER)

      expect(resultContext.err[0]).toEqual({ text: 'Select yes if you want to remove landowner or leaseholder', href: '#legalPartyBodyToRemove' })
    })
    it('Should continue journey to NEED_ADD_ALL_LANDOWNERS_CONSERVATION_COVENANT if all landowners are removed', async () => {
      let request = {
        yar: redisMap,
        payload: { landownerToRemove: 'yes' },
        query: { id: '0' }
      }
      await landownerRemove.default[1].handler(request, h)
      request = {
        yar: redisMap,
        payload: { landownerToRemove: 'yes' },
        query: { id: '0' }
      }
      await landownerRemove.default[1].handler(request, h)
      expect(viewResult).toEqual(constants.routes.NEED_ADD_ALL_LANDOWNERS_CONSERVATION_COVENANT)
      expect(redisMap.get(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS).length).toEqual(0)
    })
  })
})
