import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
const url = constants.routes.CHECK_LEGAL_AGREEMENT_FILES
const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/legal-agreements'
jest.mock('../../../utils/azure-storage.js')

describe(url, () => {
  let viewResult
  let h
  let redisMap
  let resultContext
  let legalAgreementFilesList

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
    redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_FILES, [
      {
        location: '800376c7-8652-4906-8848-70a774578dfe/legal-agreement/legal-agreement.doc',
        fileSize: 0.01,
        fileType: 'application/msword',
        id: '1'

      },
      {
        location: '800376c7-8652-4906-8848-70a774578dfe/legal-agreement/legal-agreement1.pdf',
        fileSize: 0.01,
        fileType: 'application/pdf',
        id: '2'
      }
    ])
    legalAgreementFilesList = require('../../land/check-you-added-all-legal-files.js')
  })
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
    it('should show all legal agreement files that are added', async () => {
      const request = {
        yar: redisMap
      }

      await legalAgreementFilesList.default[0].handler(request, h)

      expect(viewResult).toEqual(constants.views.CHECK_LEGAL_AGREEMENT_FILES)
      expect(resultContext.filesListWithAction.length).toEqual(2)
    })
    it('Should continue journey to NEED_ADD_ALL_LEGAL_FILES if all files removed', async () => {
      redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_FILES, [])
      const request = {
        yar: redisMap,
        query: { id: '1' }
      }
      await legalAgreementFilesList.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.routes.NEED_ADD_ALL_LEGAL_FILES)
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

    it('should allow another legal agreement file to be uploaded ', async () => {
      postOptions.payload.checkLegalAgreement = constants.confirmLegalAgreementOptions.NO
      const response = await submitPostRequest(postOptions)
      expect(response.headers.location).toBe(constants.routes.UPLOAD_LEGAL_AGREEMENT)
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
      const legalAgreementFile = require('../../land/check-you-added-all-legal-files.js')
      await legalAgreementFile.default[1].handler(request, h)
      expect(viewResult).toBe(constants.routes.NEED_ADD_ALL_RESPONSIBLE_BODIES)
    })
    it('should detect an invalid response from user', async () => {
      await submitPostRequest(postOptions, 200)
      const response = await submitPostRequest(postOptions, 200)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select yes if you have added all legal agreement files')
    })
  })
})
