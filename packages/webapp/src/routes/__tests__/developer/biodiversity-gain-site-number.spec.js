import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.DEVELOPER_BNG_NUMBER

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({
        headers: {
          referer: constants.routes.DEVELOPER_CHECK_UPLOAD_METRIC
        },
        url
      })
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

    it('Should continue journey if valid BGS number provided', async () => {
      postOptions.payload.bgsNumber = 'BGS-010124001'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual('/developer/upload-metric-file')
    })

    it('Should fail journey if BGS number blank', async () => {
      const res = await submitPostRequest(postOptions, 500)
      expect(res.payload).toContain('Sorry, there is a problem with the service')
    })

    it('Should show appropriate error if only spaces provided', async () => {
      postOptions.payload.bgsNumber = ''
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('Enter your biodiversity gain site number')
    })

    it('Should show appropriate error if BGS number is in active state', async () => {
      postOptions.payload.bgsNumber = 'active '
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('This gain site registration is not complete - wait until you have confirmation.')
    })

    it('Should show appropriate error if BGS number is in rejected state', async () => {
      postOptions.payload.bgsNumber = ' rejected'
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('This reference is for a rejected application - enter a reference for an approved gain site.')
    })

    it('Should show appropriate error if BGS number does not exist', async () => {
      postOptions.payload.bgsNumber = '  doesNotExist  '
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('The gain site reference was not recognised - enter a reference for an approved gain site.')
    })

    it('Should show appropriate error if BGS number is in removed state', async () => {
      postOptions.payload.bgsNumber = 'removed'
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('This reference is for a gain site which is no longer registered.')
    })

    it('Should show appropriate error if BGS number is in internally removed state', async () => {
      postOptions.payload.bgsNumber = 'internally-removed'
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('This reference is for a gain site which is no longer registered.')
    })

    it('Should show appropriate error if BGS number is in inactive state', async () => {
      postOptions.payload.bgsNumber = 'inactive'
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('This reference is for a gain site which has been withdrawn from registration.')
    })

    it('Should show appropriate error if BGS number return unknown error', async () => {
      postOptions.payload.bgsNumber = 'default-error'
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There was a problem checking your gain site reference - please try again later.')
    })

    it('Should return to upload metric file if checkReferer is set', async () => {
      let viewResult
      const h = {
        redirect: (view, context) => {
          viewResult = view
        }
      }
      const redisMap = new Map()
      redisMap.set(constants.redisKeys.DEVELOPER_REFERER, constants.routes.DEVELOPER_CHECK_UPLOAD_METRIC)
      const request = {
        yar: redisMap,
        payload: {
          bgsNumber: 'BGS-010124001'
        }
      }
      const developerBgsNumber = require('../../developer/biodiversity-gain-site-number')
      await developerBgsNumber.default[1].handler(request, h)
      expect(viewResult).toBe(constants.routes.DEVELOPER_CHECK_UPLOAD_METRIC)
    })

    it('Should redirect to referrer without setting BGS number if submitted number matches current number', async () => {
      const bgsNumber = 'existing-number'
      let viewResult
      const h = {
        redirect: (view, context) => {
          viewResult = view
        }
      }
      const redisMap = new Map()
      redisMap.set(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER, bgsNumber)
      redisMap.set(constants.redisKeys.REFERER, constants.routes.DEVELOPER_CHECK_AND_SUBMIT)
      const request = {
        yar: redisMap,
        payload: {
          bgsNumber
        }
      }
      const developerBgsNumber = require('../../developer/biodiversity-gain-site-number')
      await developerBgsNumber.default[1].handler(request, h)
      expect(viewResult).toBe(constants.routes.DEVELOPER_CHECK_AND_SUBMIT)
    })

    it('Should redirect to developer referrer as a fallback without setting BGS number if submitted number matches current number', async () => {
      const bgsNumber = 'existing-number'
      let viewResult
      const h = {
        redirect: (view, context) => {
          viewResult = view
        }
      }
      const redisMap = new Map()
      redisMap.set(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER, bgsNumber)
      redisMap.set(constants.redisKeys.DEVELOPER_REFERER, constants.routes.DEVELOPER_CHECK_AND_SUBMIT)
      const request = {
        yar: redisMap,
        payload: {
          bgsNumber
        }
      }
      const developerBgsNumber = require('../../developer/biodiversity-gain-site-number')
      await developerBgsNumber.default[1].handler(request, h)
      expect(viewResult).toBe(constants.routes.DEVELOPER_CHECK_AND_SUBMIT)
    })

    it('Should redirect to upload metric as a fallback without setting BGS number if submitted number matches current number', async () => {
      const bgsNumber = 'existing-number'
      let viewResult
      const h = {
        redirect: (view, context) => {
          viewResult = view
        }
      }
      const redisMap = new Map()
      redisMap.set(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER, bgsNumber)
      const request = {
        yar: redisMap,
        payload: {
          bgsNumber
        }
      }
      const developerBgsNumber = require('../../developer/biodiversity-gain-site-number')
      await developerBgsNumber.default[1].handler(request, h)
      expect(viewResult).toBe(constants.routes.DEVELOPER_UPLOAD_METRIC)
    })
  })
})
