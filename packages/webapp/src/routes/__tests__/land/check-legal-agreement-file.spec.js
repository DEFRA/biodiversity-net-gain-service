import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import * as azureStorage from '../../../utils/azure-storage.js'
const url = constants.routes.CHECK_LEGAL_AGREEMENT
jest.mock('../../../utils/azure-storage.js')

describe(url, () => {
  let viewResult
  let h
  let redisMap
  let resultContext
  let legalAgreementFileCheck

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
        location: '800376c7-8652-4906-8848-70a774578dfe/legal-agreement/legal-agreement-qwww.doc',
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

    legalAgreementFileCheck = require('../../land/check-legal-agreement-file.js')
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
    it('should show correct legal Agreement file to be check', async () => {
      const request = {
        yar: redisMap,
        query: { id: '1' }
      }

      await legalAgreementFileCheck.default[0].handler(request, h)

      expect(viewResult).toEqual(constants.views.CHECK_LEGAL_AGREEMENT)
      expect(resultContext.filename).toEqual(
        'legal-agreement-qwww.doc'
      )
    })
    it('Should continue journey to NEED_ADD_ALL_LEGAL_FILES if all files removed', async () => {
      redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_FILES, [])
      const request = {
        yar: redisMap,
        query: { id: '1' }
      }
      await legalAgreementFileCheck.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.routes.NEED_ADD_ALL_LEGAL_FILES)
    })
  })

  describe('POST', () => {
    let request
    beforeEach(() => {
      request = {
        yar: redisMap,
        payload: { checkLegalAgreement: 'yes' },
        query: { id: '1' }
      }
    })
    it('should return an error for empty id in query string', async () => {
      const queryUrl = url + '?id='
      const response = await submitPostRequest({ url: queryUrl }, 400)
      expect(response.statusCode).toBe(400)
    })
    it('should return an error for invalid id in query string', async () => {
      const queryUrl = url + '?id=$'
      const response = await submitPostRequest({ url: queryUrl }, 400)
      expect(response.statusCode).toBe(400)
    })
    it('should allow confirmation that the correct legal agreement file has been uploaded', async () => {
      await legalAgreementFileCheck.default[1].handler(request, h)
      expect(viewResult).toEqual(constants.routes.CHECK_LEGAL_AGREEMENT_FILES)
    })

    it('should allow an alternative legal agreement file to be uploaded ', async () => {
      const spy = jest.spyOn(azureStorage, 'deleteBlobFromContainers')
      request.payload.checkLegalAgreement = constants.confirmLegalAgreementOptions.NO
      await legalAgreementFileCheck.default[1].handler(request, h)
      expect(viewResult).toEqual(constants.routes.UPLOAD_LEGAL_AGREEMENT)
      expect(spy).toHaveBeenCalledTimes(1)
    })
    it('should detect an invalid response from user', async () => {
      const postOptions = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(postOptions, 200)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select yes if this is the correct file')
    })
  })
})
