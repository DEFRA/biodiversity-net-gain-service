import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/credits-purchase-constants.js'
import lojConstants from '../../../utils/loj-constants.js'
const url = constants.routes.CREDITS_PURCHASE_DEVELOPMENT_PROJECT_INFORMATION

describe(url, () => {
  let viewResult
  let h
  let redisMap
  let resultContext
  let developmentProjectInformation

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
    redisMap.set(lojConstants.redisKeys.REF_LPA_NAMES, ['Northumberland LPA', 'Middlesbrough LPA', 'Planning Authority 1', 'Planning Authority 2', 'Planning Authority 3'])

    developmentProjectInformation = require('../../credits-purchase/development-project-information.js')
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
      postOptions.payload = {
        localPlanningAuthority: 'Planning Authority 1',
        planningApplicationRef: 'ref',
        developmentName: 'dev name'
      }
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.CREDITS_PURCHASE_TASK_LIST)
    })

    it('Should show error message if no lpa name is provided', async () => {
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter and select a local planning authority')
    })

    it('Should show error message if invalid lpa is provided', async () => {
      const request = {
        yar: redisMap,
        payload: {
          localPlanningAuthority: ['invalid lpa'],
          planningApplicationRef: 'ref',
          developmentName: 'dev name'
        }
      }

      await developmentProjectInformation.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.CREDITS_PURCHASE_DEVELOPMENT_PROJECT_INFORMATION)
      expect(resultContext.errors.invalidLocalPlanningAuthorityError.text).toEqual('Enter a valid local planning authority')
    })

    it('Should show error message if planningApplicationRef is not provided', async () => {
      const request = {
        yar: redisMap,
        payload: {
          localPlanningAuthority: 'Planning Authority 1',
          planningApplicationRef: undefined,
          developmentName: 'dev name'
        }
      }

      await developmentProjectInformation.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.CREDITS_PURCHASE_DEVELOPMENT_PROJECT_INFORMATION)
      expect(resultContext.errors.planningApplicationRefError.text).toEqual('Enter a planning application reference')
    })

    it('Should show error message if developmentName is not provided', async () => {
      const request = {
        yar: redisMap,
        payload: {
          localPlanningAuthority: 'Planning Authority 1',
          planningApplicationRef: 'ref',
          developmentName: undefined
        }
      }

      await developmentProjectInformation.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.CREDITS_PURCHASE_DEVELOPMENT_PROJECT_INFORMATION)
      expect(resultContext.errors.developmentNameError.text).toEqual('Enter a development reference')
    })
  })
})
