import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.ADD_PLANNING_AUTHORITY

describe(url, () => {
  let viewResult
  let h
  let redisMap
  let resultContext
  let addPlanningAuthority

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
    redisMap.set(constants.redisKeys.PLANNING_AUTHORTITY_LIST, ['pa1', 'pa2'])

    addPlanningAuthority = require('../../land/add-planning-authority.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })

    it('should render the organisation view with organisation data to change', async () => {
      const request = {
        yar: redisMap,
        query: { id: '1' }
      }

      await addPlanningAuthority.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.views.ADD_PLANNING_AUTHORITY)
      expect(resultContext.organisationName).toEqual('pa1')
    })
  })
  describe('POST', () => {
    let postOptions
    beforeEach(() => {
      postOptions = {
        url,
        payload: {}
      }
    })
    it('Should continue journey if org name is provided', async () => {
      postOptions.payload.organisationName = 'pa1'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.CHECK_PLANNING_AUTHORITIES)
    })
    it('Should fail journey if no org name is provided', async () => {
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter a local planning authority')
    })
  })
})
