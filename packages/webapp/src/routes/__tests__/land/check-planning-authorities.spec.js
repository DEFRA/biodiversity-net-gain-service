import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.CHECK_PLANNING_AUTHORITIES

describe(url, () => {
  let viewResult
  let h
  let redisMap
  let resultContext
  let localPlanningAuthorities

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

    localPlanningAuthorities = require('../../land/check-planning-authorities.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })

    it('should show all local planning authorities that are added', async () => {
      const request = {
        yar: redisMap
      }

      await localPlanningAuthorities.default[0].handler(request, h)

      expect(viewResult).toEqual(constants.views.CHECK_PLANNING_AUTHORITIES)
      expect(resultContext.lpaList.length).toEqual(2)
    })

    it('should redirect to NEED_ADD_ALL_PLANNING_AUTHORITIES when planning authority list is empty', async () => {
      const request = {
        yar: redisMap.set(constants.redisKeys.PLANNING_AUTHORTITY_LIST, [])
      }

      await localPlanningAuthorities.default[0].handler(request, h)

      expect(viewResult).toEqual(constants.routes.NEED_ADD_ALL_PLANNING_AUTHORITIES)
    })
  })

  describe('POST', () => {
    it('Should continue journey to ADD_PLANNING_AUTHORITY if yes is chosen', async () => {
      const request = {
        yar: redisMap,
        payload: { addAnotherPlanningAuthority: 'yes' }
      }

      await localPlanningAuthorities.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.NEED_ADD_ALL_LANDOWNERS_CONSERVATION_COVENANT)
    })

    it('Should continue journey to ADD_PLANNING_AUTHORITY if no is chosen', async () => {
      const request = {
        yar: redisMap,
        payload: { addAnotherplanningAuthority: 'no' }
      }

      await localPlanningAuthorities.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.ADD_PLANNING_AUTHORITY)
    })

    it('Should fail journey if no answer', async () => {
      const request = {
        yar: redisMap,
        payload: {}
      }

      await localPlanningAuthorities.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.CHECK_PLANNING_AUTHORITIES)
      expect(resultContext.err[0]).toEqual({ text: 'Select yes if you have added all local planning authorities', href: '#addAnotherLocalPlanningAuthority' })
    })
  })
})
