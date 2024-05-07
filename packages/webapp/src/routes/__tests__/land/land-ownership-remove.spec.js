import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.LAND_OWNERSHIP_REMOVE

describe(url, () => {
  let viewResult
  let h
  let cacheMap
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

    cacheMap = new Map()
    cacheMap.set(constants.cacheKeys.LAND_OWNERSHIP_PROOFS, [{
      fileName: 'file-1.doc',
      location: '800376c7-8652-4906-8848-70a774578dfe/land-ownership/file-1.doc',
      fileSize: 0.01,
      fileType: 'application/msword',
      id: '1'
    },
    {
      fileName: 'file-2.pdf',
      location: '800376c7-8652-4906-8848-70a774578dfe/land-ownership/file-2.pdf',
      fileSize: 0.01,
      fileType: 'application/pdf',
      id: '2'
    }])

    landOwnershipRemove = require('../../land/land-ownership-remove.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url: `${url}?id=0` })
    })

    it('should redirect to land ownership list page if there is no data', async () => {
      cacheMap.clear(constants.cacheKeys.LAND_OWNERSHIP_PROOFS)
      const request = {
        yar: cacheMap,
        query: { id: 'NA' }
      }

      await landOwnershipRemove.default[0].handler(request, h)

      expect(viewResult).toEqual(constants.routes.LAND_OWNERSHIP_PROOF_LIST)
    })

    it('should show correct land ownership proofs to be removed', async () => {
      const request = {
        yar: cacheMap,
        query: { id: '1' }
      }

      await landOwnershipRemove.default[0].handler(request, h)

      expect(viewResult).toEqual(constants.views.LAND_OWNERSHIP_REMOVE)
      expect(resultContext.ownershipProofToRemove).toEqual('file-2.pdf')
    })
  })

  describe('POST', () => {
    it('should continue journey to land ownership list if yes is chosen and more than one proof of land ownership document has been uploaded', async () => {
      const request = {
        yar: cacheMap,
        payload: { ownershipProofToRemove: 'yes' },
        query: { id: '1' }
      }

      await landOwnershipRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.LAND_OWNERSHIP_PROOF_LIST)
      expect(cacheMap.get(constants.cacheKeys.LAND_OWNERSHIP_PROOFS).length).toEqual(1)
    })

    it('should continue journey to upload land ownership proof if yes is chosen and only one proof of land ownership document has been uploaded', async () => {
      cacheMap.clear(constants.cacheKeys.LAND_OWNERSHIP_PROOFS)
      const request = {
        yar: cacheMap,
        payload: { ownershipProofToRemove: 'yes' },
        query: { id: '1' }
      }

      await landOwnershipRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.UPLOAD_LAND_OWNERSHIP)
      expect(cacheMap.get(constants.cacheKeys.LAND_OWNERSHIP_PROOFS)).toBeUndefined()
    })

    it('should continue journey to land ownership list if no is chosen', async () => {
      const request = {
        yar: cacheMap,
        payload: { ownershipProofToRemove: 'no' },
        query: { id: '1' }
      }

      await landOwnershipRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.LAND_OWNERSHIP_PROOF_LIST)
      expect(cacheMap.get(constants.cacheKeys.LAND_OWNERSHIP_PROOFS).length).toEqual(2)
    })

    it('Should fail journey if no answer', async () => {
      const request = {
        yar: cacheMap,
        payload: { },
        query: { id: '1' }
      }

      await landOwnershipRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.LAND_OWNERSHIP_REMOVE)
      expect(resultContext.err[0]).toEqual({ text: 'Select yes if you want to remove file-2.pdf as proof of land ownership', href: '#remove-op-yes' })
    })
  })
})
