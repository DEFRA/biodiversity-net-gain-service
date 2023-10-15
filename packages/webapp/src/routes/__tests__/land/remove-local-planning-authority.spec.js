import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.REMOVE_LOCAL_PLANNING_AUTHORITY

describe(url, () => {
  let viewResult
  let h
  let redisMap
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

    redisMap = new Map()
    redisMap.set(constants.redisKeys.PLANNING_AUTHORTITY_LIST, ['Planning Authority 1', 'Planning Authority 2'])

    localPlanningAuthorityRemove = require('../../land/remove-local-planning-authority.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })

    it('should show correct local planning authority to be removed', async () => {
      const request = {
        yar: redisMap,
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
        yar: redisMap,
        payload: { planningAuthToRemove: 'yes' },
        query: { id: '1' }
      }

      await localPlanningAuthorityRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.CHECK_PLANNING_AUTHORITIES)
      expect(redisMap.get(constants.redisKeys.PLANNING_AUTHORTITY_LIST).length).toEqual(1)
    })

    it('Should continue journey to CHECK_PLANNING_AUTHORITIES if no is chosen', async () => {
      const request = {
        yar: redisMap,
        payload: { planningAuthToRemove: 'no' },
        query: { id: '1' }
      }

      await localPlanningAuthorityRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.CHECK_PLANNING_AUTHORITIES)
      expect(redisMap.get(constants.redisKeys.PLANNING_AUTHORTITY_LIST).length).toEqual(2)
    })

    it('Should fail journey if no answer', async () => {
      const request = {
        yar: redisMap,
        payload: { },
        query: { id: '0' }
      }

      await localPlanningAuthorityRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.REMOVE_LOCAL_PLANNING_AUTHORITY)

      expect(resultContext.err[0]).toEqual({ text: 'Select yes if you want to remove Planning Authority 1 as a local planning authority', href: '#planningAuthToRemove' })
    })

    // it('Should continue journey to NEED_ADD_ALL_LANDOWNERS_CONSERVATION_COVENANT if no is chosen', async () => {
    //   let request = {
    //     yar: redisMap,
    //     payload: { planningAuthToRemove: 'yes' },
    //     query: { id: '0' }
    //   }
    //   await localPlanningAuthorityRemove.default[1].handler(request, h)
    //   request = {
    //     yar: redisMap,
    //     payload: { planningAuthToRemove: 'yes' },
    //     query: { id: '0' }
    //   }
    //   await localPlanningAuthorityRemove.default[1].handler(request, h)
    //   expect(viewResult).toEqual(constants.routes.NEED_ADD_ALL_LANDOWNERS_CONSERVATION_COVENANT)
    //   expect(redisMap.get(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENTS).length).toEqual(0)
    // })
  })
})
