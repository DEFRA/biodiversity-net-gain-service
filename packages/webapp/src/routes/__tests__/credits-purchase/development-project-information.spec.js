import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/credits-purchase-constants.js'
import lojConstants from '../../../utils/loj-constants.js'

const url = constants.routes.CREDITS_PURCHASE_DEVELOPMENT_PROJECT_INFORMATION

describe(url, () => {
  let redisMap

  beforeEach(() => {
    redisMap = new Map()
    redisMap.set(constants.redisKeys.PLANNING_AUTHORTITY_LIST, ['Planning Authority 1', 'Planning Authority 2'])
    redisMap.set(lojConstants.redisKeys.REF_LPA_NAMES, ['Northumberland LPA', 'Middlesbrough LPA', 'Planning Authority 1', 'Planning Authority 2', 'Planning Authority 3'])
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

    it('should show error message if lpa name not provided', async () => {
      const sessionData = {
        errors: [
          {
            text: 'Enter and select a local planning authority',
            href: '#localPlanningAuthority'
          }
        ]
      }
      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter and select a local planning authority')
    })

    it('should show error message if valid lpa name not provided', async () => {
      const sessionData = {
        errors: [
          {
            text: 'Enter a valid local planning authority',
            href: '#localPlanningAuthority'
          }
        ]
      }
      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter a valid local planning authority')
    })

    it('should show error message if planning application reference not provided', async () => {
      const sessionData = {
        errors: [
          {
            text: 'Enter a planning application reference',
            href: '#planningApplicationRef'
          }
        ]
      }
      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter a planning application reference')
    })

    it('should show error message if development name not provided', async () => {
      const sessionData = {
        errors: [
          {
            text: 'Enter a development name',
            href: '#developmentName'
          }
        ]
      }
      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter a development name')
    })

    it('should show multiple error messages if all fields are not provided', async () => {
      const sessionData = {
        errors: [
          {
            text: 'Enter and select a local planning authority',
            href: '#localPlanningAuthority'
          },
          {
            text: 'Enter a planning application reference',
            href: '#planningApplicationRef'
          },
          {
            text: 'Enter a development name',
            href: '#developmentName'
          }
        ]
      }
      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter and select a local planning authority')
      expect(res.payload).toContain('Enter a planning application reference')
      expect(res.payload).toContain('Enter a development name')
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

    it('Should not continue journey if no lpa name is provided', async () => {
      const res = await submitPostRequest(postOptions, 302)
      expect(res.headers.location).toEqual(constants.routes.CREDITS_PURCHASE_DEVELOPMENT_PROJECT_INFORMATION)
    })

    it('Should not continue journey if invalid lpa is provided', async () => {
      const request = {
        yar: redisMap,
        payload: {
          localPlanningAuthority: ['invalid lpa'],
          planningApplicationRef: 'ref',
          developmentName: 'dev name'
        }
      }

      const res = await submitPostRequest(postOptions, 302, request)
      expect(res.headers.location).toEqual(constants.routes.CREDITS_PURCHASE_DEVELOPMENT_PROJECT_INFORMATION)
    })

    it('Should not continue journey if planningApplicationRef is not provided', async () => {
      const request = {
        yar: redisMap,
        payload: {
          localPlanningAuthority: 'Planning Authority 1',
          planningApplicationRef: undefined,
          developmentName: 'dev name'
        }
      }

      const res = await submitPostRequest(postOptions, 302, request)
      expect(res.headers.location).toEqual(constants.routes.CREDITS_PURCHASE_DEVELOPMENT_PROJECT_INFORMATION)
    })

    it('Should not continue journey if developmentName is not provided', async () => {
      const request = {
        yar: redisMap,
        payload: {
          localPlanningAuthority: 'Planning Authority 1',
          planningApplicationRef: 'ref',
          developmentName: undefined
        }
      }

      const res = await submitPostRequest(postOptions, 302, request)
      expect(res.headers.location).toEqual(constants.routes.CREDITS_PURCHASE_DEVELOPMENT_PROJECT_INFORMATION)
    })
  })
})
