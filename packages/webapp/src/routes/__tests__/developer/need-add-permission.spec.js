import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.DEVELOPER_NEED_ADD_PERMISSION

describe(url, () => {
  let viewResult
  let h
  let redisMap
  let needPermission
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
    redisMap.set(constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_FILES, [
      {
        location: '800376c7-8652-4906-8848-70a774578dfe/written-authorisation/auth.doc',
        fileSize: 0.01,
        fileType: 'application/msword',
        id: '1'

      }
    ])
    needPermission = require('../../developer/need-add-permission.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
    it('Should continue journey to DEVELOPER_UPLOAD_CONSENT_TO_USE_GAIN_SITE if more than 1 permission added', async () => {
      redisMap.set(constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_FILES, [
        {
          location: '800376c7-8652-4906-8848-70a774578dfe/written-authorisation/auth.doc',
          fileSize: 0.01,
          fileType: 'application/msword',
          id: '1'

        },
        {
          location: '800376c7-8652-4906-8848-70a774578dfe/written-authorisation/auth2.doc',
          fileSize: 0.01,
          fileType: 'application/msword',
          id: '2'

        }])
      const request = {
        yar: redisMap
      }
      await needPermission.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.routes.DEVELOPER_UPLOAD_CONSENT_TO_USE_GAIN_SITE)
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
    it('Should continue journey to DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION on continue', async () => {
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION)
    })
  })
})
