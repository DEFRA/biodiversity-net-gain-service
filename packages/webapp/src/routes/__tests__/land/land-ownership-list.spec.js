import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.LAND_OWNERSHIP_LIST

describe(url, () => {
  let viewResult
  let h
  let redisMap
  let resultContext
  let landOwnershipProofs

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
      {
        location: 'mock-location-1',
        fileSize: 2499,
        fileType: 'pdf'
      },
      {
        location: 'mock-location-2',
        fileSize: 1499,
        fileType: 'doc'
      }
    ])

    landOwnershipProofs = require('../../land/land-ownership-list.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })

    it('should show all land ownership proofs that are added', async () => {
      const request = {
        yar: redisMap
      }

      await landOwnershipProofs.default[0].handler(request, h)

      expect(viewResult).toEqual(constants.views.LAND_OWNERSHIP_LIST)
      expect(resultContext.landOwnershipProofs.length).toEqual(2)
    })
  })

  describe('POST', () => {
    it('should continue journey to register task list if yes is chosen', async () => {
      const request = {
        yar: redisMap,
        payload: { addAnotherOwnershipProof: 'yes' }
      }

      await landOwnershipProofs.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.REGISTER_LAND_TASK_LIST)
    })

    it('should continue journey to upload ownership proof if no is chosen', async () => {
      const request = {
        yar: redisMap,
        payload: { addAnotherOwnershipProof: 'no' }
      }

      await landOwnershipProofs.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.UPLOAD_LAND_OWNERSHIP)
    })

    it('Should fail journey if no answer', async () => {
      const request = {
        yar: redisMap,
        payload: {}
      }

      await landOwnershipProofs.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.LAND_OWNERSHIP_LIST)
      expect(resultContext.err[0]).toEqual({ text: 'Select yes if you have added all proof of land ownership files', href: '#add-another-op-yes' })
    })
  })
})
