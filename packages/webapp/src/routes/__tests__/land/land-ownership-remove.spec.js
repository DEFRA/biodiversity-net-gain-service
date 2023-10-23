import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.LAND_OWNERSHIP_REMOVE

describe(url, () => {
  let viewResult
  let h
  let redisMap
  let resultContext
  let landOwnershipRemove

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
    redisMap.set(constants.redisKeys.LAND_OWNERSHIP_PROOFS, [
      'mock-file-1',
      'mock-file-2'
    ])

    landOwnershipRemove = require('../../land/land-ownership-remove.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url: `${url}?id=0` })
    })

    it('should redirect to land ownership list page if there are no data', async () => {
      redisMap.clear(constants.redisKeys.LAND_OWNERSHIP_PROOFS)
      const request = {
        yar: redisMap,
        query: { id: 'NA' }
      }

      await landOwnershipRemove.default[0].handler(request, h)

      expect(viewResult).toEqual(constants.routes.LAND_OWNERSHIP_LIST)
    })

    it('should show correct land ownership proofs to be remove', async () => {
      const request = {
        yar: redisMap,
        query: { id: '0' }
      }

      await landOwnershipRemove.default[0].handler(request, h)

      expect(viewResult).toEqual(constants.views.LAND_OWNERSHIP_REMOVE)
      expect(resultContext.ownershipProofToRemove).toEqual('mock-file-1')
    })
  })

  describe('POST', () => {
    it('should continue journey to land ownership list if yes is chosen and more than one files added', async () => {
      const request = {
        yar: redisMap,
        payload: { ownershipProofToRemove: 'yes' },
        query: { id: '1' }
      }

      await landOwnershipRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.LAND_OWNERSHIP_LIST)
      expect(redisMap.get(constants.redisKeys.LAND_OWNERSHIP_PROOFS).length).toEqual(1)
    })

    it('should continue journey to upload land ownership proof if yes is chosen and onle one file added', async () => {
      redisMap.clear(constants.redisKeys.LAND_OWNERSHIP_PROOFS)
      const request = {
        yar: redisMap,
        payload: { ownershipProofToRemove: 'yes' },
        query: { id: '1' }
      }

      await landOwnershipRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.UPLOAD_LAND_OWNERSHIP)
      expect(redisMap.get(constants.redisKeys.LAND_OWNERSHIP_PROOFS)).toBeUndefined()
    })

    it('should continue journey to land ownership list if no is chosen', async () => {
      const request = {
        yar: redisMap,
        payload: { ownershipProofToRemove: 'no' },
        query: { id: '1' }
      }

      await landOwnershipRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.LAND_OWNERSHIP_LIST)
      expect(redisMap.get(constants.redisKeys.LAND_OWNERSHIP_PROOFS).length).toEqual(2)
    })

    it('Should fail journey if no answer', async () => {
      const request = {
        yar: redisMap,
        payload: { },
        query: { id: '1' }
      }

      await landOwnershipRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.LAND_OWNERSHIP_REMOVE)
      expect(resultContext.err[0]).toEqual({ text: 'Select yes if you want to remove mock-file-2 as proof of land ownership', href: '#remove-op-yes' })
    })
  })
})
