import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.REMOVE_RESPONSIBLE_BODY

describe(url, () => {
  let viewResult
  let h
  let redisMap
  let resultContext
  let responsibleBodyRemove

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
    redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES, [{
      responsibleBodyName: 'test1'
    },
    {
      responsibleBodyName: 'test2'
    }])

    responsibleBodyRemove = require('../../land/remove-responsible-body.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })

    it('should show correct responsible body to be remove', async () => {
      const request = {
        yar: redisMap,
        query: { id: '0' }
      }

      await responsibleBodyRemove.default[0].handler(request, h)

      expect(viewResult).toEqual(constants.views.REMOVE_RESPONSIBLE_BODY)
      expect(resultContext.legalPartyBodyToRemoveText).toEqual(
        'test1'
      )
    })
  })

  describe('POST', () => {
    it('Should continue journey to CHECK_RESPONSIBLE_BODIES if yes is chosen and remove 1 responsible body', async () => {
      const request = {
        yar: redisMap,
        payload: { legalPartyBodyToRemove: 'yes' },
        query: { id: '1' }
      }

      await responsibleBodyRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.CHECK_RESPONSIBLE_BODIES)
      expect(redisMap.get(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES).length).toEqual(1)
    })

    it('Should continue journey to CHECK_RESPONSIBLE_BODIES if no is chosen', async () => {
      const request = {
        yar: redisMap,
        payload: { legalPartyBodyToRemove: 'no' },
        query: { id: '1' }
      }

      await responsibleBodyRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.CHECK_RESPONSIBLE_BODIES)
      expect(redisMap.get(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES).length).toEqual(2)
    })

    it('Should fail journey if no answer', async () => {
      const request = {
        yar: redisMap,
        payload: { },
        query: { id: '1' }
      }

      await responsibleBodyRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.REMOVE_RESPONSIBLE_BODY)

      expect(resultContext.err[0]).toEqual({ text: 'Select yes if you want to remove responsible body', href: '#legalPartyBodyToRemove' })
    })
    it('Should continue journey to NEED_ADD_ALL_RESPONSIBLE_BODIES if no is chosen', async () => {
      let request = {
        yar: redisMap,
        payload: { legalPartyBodyToRemove: 'yes' },
        query: { id: '0' }
      }
      await responsibleBodyRemove.default[1].handler(request, h)
      request = {
        yar: redisMap,
        payload: { legalPartyBodyToRemove: 'yes' },
        query: { id: '0' }
      }
      await responsibleBodyRemove.default[1].handler(request, h)
      expect(viewResult).toEqual(constants.routes.NEED_ADD_ALL_RESPONSIBLE_BODIES)
      expect(redisMap.get(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES).length).toEqual(0)
    })
  })
})
