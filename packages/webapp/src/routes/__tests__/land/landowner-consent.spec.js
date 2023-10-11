import constants from '../../../utils/constants.js'

import { submitPostRequest } from '../helpers/server.js'
const url = constants.routes.LANDOWNER_CONSENT

describe(url, () => {
  let viewResult
  let h
  let redisMap
  let landownerConsent

  beforeEach(() => {
    h = {
      view: (view, context) => {
        viewResult = view
      },
      redirect: (view, context) => {
        viewResult = view
      }
    }

    redisMap = new Map()

    landownerConsent = require('../../land/landowner-consent.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      redisMap.set(constants.redisKeys.LANDOWNER_CONSENT_KEY, 'yes')

      const request = {
        yar: redisMap
      }

      await landownerConsent.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.views.LANDOWNER_CONSENT)
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
    it('Should continue journey to consent being ticked', async () => {
      postOptions.payload.landownerConsent = 'yes'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.REGISTER_LAND_TASK_LIST)
    })
    it('Should continue journey to upload written consent', async () => {
      postOptions.payload.landownerConsent = 'no'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.LANDOWNER_PERMISSION_UPLOAD)
    })
    it('Should stop journey if consent not ticked', async () => {
      postOptions.payload.landownerConsent = undefined
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Agree to the landowner consent declaration to continue')
      expect(res.payload).toContain('I confirm that I, <strong>John Smith</strong> , am authorised to act on behalf of the landowners.')
    })
  })
})
