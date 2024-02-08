import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import * as azureStorage from '../../../utils/azure-storage.js'
const url = constants.routes.DEVELOPER_CHECK_WRITTEN_AUTHORISATION_FILE
jest.mock('../../../utils/azure-storage.js')

describe(url, () => {
  let viewResult
  let h
  let redisMap
  let checkAuthorization
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
    checkAuthorization = require('../../developer/check-written-authorisation-file.js')
  })
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
    it(`should render the ${url.substring(1)} view if fle location is null`, async () => {
      redisMap.set(constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_FILES, [
        {
          location: null,
          fileSize: 0.01,
          fileType: 'application/msword',
          id: '1'

        }])
      const request = {
        yar: redisMap,
        query: { id: '1' }
      }
      await checkAuthorization.default[0].handler(request, h)
      expect(viewResult).toEqual('developer/check-written-authorisation-file')
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
    it('Should permit the upload of an alternative written authorisation file when the condition MULTIPLE_PROOFS_OF_PERMISSION_REQUIRED is set to true and fewer than 2 file has been uploaded', async () => {
      redisMap.set(constants.redisKeys.MULTIPLE_PROOFS_OF_PERMISSION_REQUIRED, true)

      const request = {
        yar: redisMap,
        payload: { checkWrittenAuthorisation: 'yes' },
        query: { id: '1' }
      }
      await checkAuthorization.default[1].handler(request, h)
      expect(viewResult).toEqual(constants.routes.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION)
    })
    it('Should permit the upload of an alternative written authorisation file when the condition MULTIPLE_PROOFS_OF_PERMISSION_REQUIRED is set to true and greater than one file has been uploaded', async () => {
      redisMap.set(constants.redisKeys.MULTIPLE_PROOFS_OF_PERMISSION_REQUIRED, true)
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
        yar: redisMap,
        payload: { checkWrittenAuthorisation: 'yes' },
        query: { id: '1' }
      }
      await checkAuthorization.default[1].handler(request, h)
      expect(viewResult).toEqual(constants.routes.DEVELOPER_UPLOAD_CONSENT_TO_USE_GAIN_SITE)
    })
    it('should allow an alternative written authorisation file to be uploaded ', async () => {
      const spy = jest.spyOn(azureStorage, 'deleteBlobFromContainers')
      const request = {
        yar: redisMap,
        payload: { checkWrittenAuthorisation: 'no' },
        query: { id: '1' }
      }
      await checkAuthorization.default[1].handler(request, h)
      expect(viewResult).toEqual(constants.routes.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION)
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('should detect an invalid response from user', async () => {
      const response = await submitPostRequest(postOptions, 200)
      expect(response.payload).toContain('Select yes if this is the correct file')
    })
  })
})
