import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.REMOVE_LOCAL_PLANNING_AUTHORITY

describe(url, () => {
  let viewResult
  let h
  let cacheMap
  let resultContext
  let localPlanningAuthorityRemove

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
    cacheMap.set(constants.cacheKeys.PLANNING_AUTHORTITY_LIST, ['Planning Authority 1', 'Planning Authority 2'])

    localPlanningAuthorityRemove = require('../../land/remove-local-planning-authority.js')
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
    it('should show correct local planning authority to be removed', async () => {
      const request = {
        yar: cacheMap,
        query: { id: '0' }
      }

      await localPlanningAuthorityRemove.default[0].handler(request, h)

      expect(resultContext.planningAuthToRemove).toEqual(
        'Planning Authority 1'
      )
    })
  })

  describe('POST', () => {
    it('Should continue journey to CHECK_PLANNING_AUTHORITIES if yes is chosen and remove 1 local planning authority', async () => {
      const request = {
        yar: cacheMap,
        payload: { planningAuthToRemove: 'yes' },
        query: { id: '1' }
      }

      await localPlanningAuthorityRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.CHECK_PLANNING_AUTHORITIES)
      expect(cacheMap.get(constants.cacheKeys.PLANNING_AUTHORTITY_LIST).length).toEqual(1)
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
    it('Should continue journey to CHECK_PLANNING_AUTHORITIES if no is chosen', async () => {
      const request = {
        yar: cacheMap,
        payload: { planningAuthToRemove: 'no' },
        query: { id: '1' }
      }

      await localPlanningAuthorityRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.CHECK_PLANNING_AUTHORITIES)
      expect(cacheMap.get(constants.cacheKeys.PLANNING_AUTHORTITY_LIST).length).toEqual(2)
    })

    it('Should fail journey if no answer', async () => {
      const request = {
        yar: cacheMap,
        payload: { },
        query: { id: '0' }
      }

      await localPlanningAuthorityRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.REMOVE_LOCAL_PLANNING_AUTHORITY)

      expect(resultContext.err[0]).toEqual({ text: 'Select yes if you want to remove Planning Authority 1 as a local planning authority', href: '#planningAuthToRemove' })
    })
  })
})
