import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import * as azureStorage from '../../../utils/azure-storage.js'
const url = constants.routes.CHECK_LEGAL_AGREEMENT
const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/legal-agreements'
jest.mock('../../../utils/azure-storage.js')

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
    it('should redirect to Start page if no data applicant data is available in session', async () => {
      const response = await submitGetRequest({ url }, 302, {})
      expect(response.headers.location).toEqual(constants.routes.START)
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

    it('should allow confirmation that the correct legal agreement file has been uploaded', async () => {
      postOptions.payload.checkLegalAgreement = constants.confirmLegalAgreementOptions.YES
      await submitPostRequest(postOptions)
    })

    it('should allow an alternative legal agreement file to be uploaded ', async () => {
      const spy = jest.spyOn(azureStorage, 'deleteBlobFromContainers')
      postOptions.payload.checkLegalAgreement = constants.confirmLegalAgreementOptions.NO
      const response = await submitPostRequest(postOptions)
      expect(response.headers.location).toBe(constants.routes.UPLOAD_LEGAL_AGREEMENT)
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('Should continue journey to NEED_ADD_ALL_RESPONSIBLE_BODIES if yes is chosen and legalAgreementType=conservation covenant', async () => {
      let viewResult
      const redisMap = new Map()
      const h = {
        redirect: (view, context) => {
          viewResult = view
        }
      }
      redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE, '759150001')
      redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_LOCATION, mockDataPath)
      const request = {
        yar: redisMap,
        payload: {
          checkLegalAgreement: 'yes'
        }
      }
      const legalAgreementFile = require('../../land/check-legal-agreement-file.js')
      await legalAgreementFile.default[1].handler(request, h)
      expect(viewResult).toBe(constants.routes.NEED_ADD_ALL_RESPONSIBLE_BODIES)
    })
    it('should detect an invalid response from user', async () => {
      await submitPostRequest(postOptions, 200)
    })
  })
})
