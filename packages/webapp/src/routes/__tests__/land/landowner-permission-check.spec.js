import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import * as azureStorage from '../../../utils/azure-storage.js'
const url = constants.routes.LANDOWNER_PERMISSION_CHECK
jest.mock('../../../utils/azure-storage.js')

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
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
    it('should allow confirmation that the correct landowner consent file has been uploaded', async () => {
      postOptions.payload.checkLandownerPermissionFile = constants.checkLandownerPermissionOptions.YES
      await submitPostRequest(postOptions)
    })

    it('should allow an alternative landowner consent file to be uploaded ', async () => {
      const spy = jest.spyOn(azureStorage, 'deleteBlobFromContainers')
      postOptions.payload.checkLandownerPermissionFile = constants.checkLandownerPermissionOptions.NO
      const response = await submitPostRequest(postOptions)
      expect(response.headers.location).toBe(constants.routes.LANDOWNER_PERMISSION_UPLOAD)
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('should detect an invalid response from user', async () => {
      await submitPostRequest(postOptions, 200)
    })
  })
})
