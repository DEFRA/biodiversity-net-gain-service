import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.REMOVE_RESPONSIBLE_BODY

describe(url, () => {
  let viewResult
  let h
  let cacheMap
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

    cacheMap = new Map()
    cacheMap.set(constants.cacheKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES, [{
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
    it('should return an error for empty id in query string', async () => {
      const queryUrl = url + '?id='
      const response = await submitGetRequest({ url: queryUrl }, 400)
      expect(response.statusCode).toBe(400)
    })
    it('should return an error for invalid id in query string', async () => {
      const queryUrl = url + '?id=$'
      const response = await submitGetRequest({ url: queryUrl }, 400)
      expect(response.statusCode).toBe(400)
    })
    it('should show correct responsible body to be removed', async () => {
      const request = {
        yar: cacheMap,
        query: { id: '0' }
      }

      await responsibleBodyRemove.default[0].handler(request, h)

      expect(viewResult).toEqual(constants.views.REMOVE_RESPONSIBLE_BODY)
      expect(resultContext.legalPartyBodyToRemoveText).toEqual(
        'test1'
      )
    })
    it('Should continue journey to NEED_ADD_ALL_RESPONSIBLE_BODIES if all responsible bodies removed', async () => {
      cacheMap.set(constants.cacheKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES, [])
      const request = {
        yar: cacheMap,
        query: { id: '0' }
      }
      await responsibleBodyRemove.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.routes.NEED_ADD_ALL_RESPONSIBLE_BODIES)
    })
  })

  describe('POST', () => {
    it('Should continue journey to CHECK_RESPONSIBLE_BODIES if yes is chosen and remove  responsible body', async () => {
      const request = {
        yar: cacheMap,
        payload: { legalPartyBodyToRemove: 'yes' },
        query: { id: '1' }
      }

      await responsibleBodyRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.CHECK_RESPONSIBLE_BODIES)
      expect(cacheMap.get(constants.cacheKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES).length).toEqual(1)
    })

    it('should return an error for empty id in query string', async () => {
      const queryUrl = url + '?id='
      const response = await submitPostRequest({ url: queryUrl }, 400)
      expect(response.statusCode).toBe(400)
    })
    it('should return an error for invalid id in query string', async () => {
      const queryUrl = url + '?id=$'
      const response = await submitPostRequest({ url: queryUrl }, 400)
      expect(response.statusCode).toBe(400)
    })
    it('Should continue journey to CHECK_RESPONSIBLE_BODIES if no is chosen', async () => {
      const request = {
        yar: cacheMap,
        payload: { legalPartyBodyToRemove: 'no' },
        query: { id: '1' }
      }

      await responsibleBodyRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.CHECK_RESPONSIBLE_BODIES)
      expect(cacheMap.get(constants.cacheKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES).length).toEqual(2)
    })

    it('Should fail journey if no answer', async () => {
      const request = {
        yar: cacheMap,
        payload: { },
        query: { id: '1' }
      }

      await responsibleBodyRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.REMOVE_RESPONSIBLE_BODY)

      expect(resultContext.err[0]).toEqual({ text: 'Select yes if you want to remove responsible body', href: '#legalPartyBodyToRemove' })
    })
    it('Should continue journey to NEED_ADD_ALL_RESPONSIBLE_BODIES if all responsible bodies are removed', async () => {
      let request = {
        yar: cacheMap,
        payload: { legalPartyBodyToRemove: 'yes' },
        query: { id: '0' }
      }
      await responsibleBodyRemove.default[1].handler(request, h)
      request = {
        yar: cacheMap,
        payload: { legalPartyBodyToRemove: 'yes' },
        query: { id: '0' }
      }
      await responsibleBodyRemove.default[1].handler(request, h)
      expect(viewResult).toEqual(constants.routes.NEED_ADD_ALL_RESPONSIBLE_BODIES)
      expect(cacheMap.get(constants.cacheKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES).length).toEqual(0)
    })
  })
})
