import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import * as azureStorage from '../../../utils/azure-storage.js'
import * as checkSchemeOfWorks from '../../land/check-scheme-of-works-file.js'

const url = constants.routes.CHECK_SCHEME_OF_WORKS_FILE
jest.mock('../../../utils/azure-storage.js')

describe(url, () => {
  let redisMap
  let h
  let resultContext

  beforeEach(() => {
    h = {
      view: (_view, context) => {
        resultContext = context
      }
    }

    redisMap = new Map()
    redisMap.set(constants.redisKeys.SCHEME_OF_WORKS_CHECKED, 'yes')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })

    it('should handle when file location is null', async () => {
      redisMap.set(constants.redisKeys.SCHEME_OF_WORKS_FILE_LOCATION, null)

      const request = {
        yar: redisMap
      }

      await checkSchemeOfWorks.default[0].handler(request, h)

      expect(resultContext.filename).toEqual('')
    })

    it('should set context with correct file location', async () => {
      redisMap.set(constants.redisKeys.SCHEME_OF_WORKS_FILE_LOCATION, '/test/location')

      const request = {
        yar: redisMap
      }

      await checkSchemeOfWorks.default[0].handler(request, h)

      expect(resultContext.fileLocation).toEqual('/test/location')
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
    it('should allow confirmation that the correct written authorisation file has been uploaded', async () => {
      postOptions.payload.checkSchemeOfWorks = 'yes'
      const response = await submitPostRequest(postOptions)
      expect(response.headers.location).toBe(constants.routes.NEED_ADD_ALL_RESPONSIBLE_BODIES)
    })

    it('should allow an alternative written authorisation file to be uploaded ', async () => {
      const spy = jest.spyOn(azureStorage, 'deleteBlobFromContainers')
      postOptions.payload.checkSchemeOfWorks = 'no'
      const response = await submitPostRequest(postOptions)
      expect(response.headers.location).toBe(constants.routes.UPLOAD_SCHEME_OF_WORKS)
      expect(spy).toHaveBeenCalledTimes(0)
    })

    it('should detect an invalid response from user', async () => {
      const response = await submitPostRequest(postOptions, 200)
      expect(response.payload).toContain('Select yes if this is the correct file')
    })
  })
})
