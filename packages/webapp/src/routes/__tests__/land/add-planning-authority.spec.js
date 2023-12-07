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
    redisMap.set(constants.redisKeys.PLANNING_AUTHORTITY_LIST, ['Planning Authority 1', 'Planning Authority 2'])
    redisMap.set(constants.redisKeys.REF_LPA_NAMES, ['Northumberland LPA', 'Middlesbrough LPA', 'Planning Authority 3'])

    addPlanningAuthority = require('../../land/add-planning-authority.js')
  })

  describe('GET', () => {
    jest.mock('../../../utils/get-lpas.js')

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
    it('should render ADD_PLANNING_AUTHORITY view with localPlanningAuthority data to change', async () => {
      const request = {
        yar: redisMap,
        query: { id: '0' }
      }

      await addPlanningAuthority.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.views.ADD_PLANNING_AUTHORITY)
      expect(resultContext.localPlanningAuthority).toEqual('Planning Authority 1')
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

    it('Should continue journey if localPlanningAuthority name is provided', async () => {
      postOptions.payload = { localPlanningAuthority: 'Planning Authority 1' }
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.CHECK_PLANNING_AUTHORITIES)
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
    it('should edit planning authority and redirect to CHECK_PLANNING_AUTHORITIES page by using id', async () => {
      const request = {
        yar: redisMap,
        payload: { localPlanningAuthority: 'Planning Authority 3' },
        query: { id: '0' }
      }

      await addPlanningAuthority.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.CHECK_PLANNING_AUTHORITIES)
      expect(redisMap.get('planning-authority-list').length).toEqual(2)
    })

    it('Should show error message if no lpa name is provided', async () => {
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter a local planning authority')
    })

    it('Should show error message if invalid lpa is provided', async () => {
      const request = {
        yar: redisMap,
        payload: { localPlanningAuthority: 'Invalid lpa' },
        query: { id: '0' }
      }

      await addPlanningAuthority.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.ADD_PLANNING_AUTHORITY)
      expect(resultContext.localPlanningAuthorityNameErr[0].text).toEqual('Enter a valid local planning authority')
    })
  })
})
