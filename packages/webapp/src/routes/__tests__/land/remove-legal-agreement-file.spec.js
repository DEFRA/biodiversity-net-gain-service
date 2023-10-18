import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.REMOVE_LEGAL_AGREEMENT_FILE

describe(url, () => {
  let viewResult
  let h
  let redisMap
  let resultContext
  let legalAgreementFileRemove

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

    legalAgreementFileRemove = require('../../land/remove-legal-agreement-file.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })

    it('should show correct legal Agreement file to be remove', async () => {
      const request = {
        yar: redisMap,
        query: { id: '1' }
      }

      await legalAgreementFileRemove.default[0].handler(request, h)

      expect(viewResult).toEqual(constants.views.REMOVE_LEGAL_AGREEMENT_FILE)
      expect(resultContext.filenameText).toEqual(
        'legal-agreement.doc'
      )
    })
    it('Should continue journey to NEED_ADD_ALL_LEGAL_FILES if all files removed', async () => {
      redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_FILES, [])
      const request = {
        yar: redisMap,
        query: { id: '1' }
      }
      await legalAgreementFileRemove.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.routes.NEED_ADD_ALL_LEGAL_FILES)
    })
  })

  describe('POST', () => {
    it('Should continue journey to CHECK_LEGAL_AGREEMENT_FILES if yes is chosen and remove legal agreement file', async () => {
      const request = {
        yar: redisMap,
        payload: { legalAgreementFileToRemove: 'yes' },
        query: { id: '1' }
      }

      await legalAgreementFileRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.CHECK_LEGAL_AGREEMENT_FILES)
      expect(redisMap.get(constants.redisKeys.LEGAL_AGREEMENT_FILES).length).toEqual(1)
    })

    it('Should continue journey to CHECK_LEGAL_AGREEMENT_FILES if no is chosen', async () => {
      const request = {
        yar: redisMap,
        payload: { legalAgreementFileToRemove: 'no' },
        query: { id: '1' }
      }

      await legalAgreementFileRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.CHECK_LEGAL_AGREEMENT_FILES)
      expect(redisMap.get(constants.redisKeys.LEGAL_AGREEMENT_FILES).length).toEqual(2)
    })

    it('Should fail journey if no answer', async () => {
      const request = {
        yar: redisMap,
        payload: { },
        query: { id: '1' }
      }

      await legalAgreementFileRemove.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.REMOVE_LEGAL_AGREEMENT_FILE)

      expect(resultContext.err[0]).toEqual({ text: 'Select yes if you want to remove legal-agreement.doc as a legal agreement file', href: '#legalAgreementFileToRemove' })
    })

    it('Should continue journey to NEED_ADD_ALL_LEGAL_FILES all removed', async () => {
      let request = {
        yar: redisMap,
        payload: { legalAgreementFileToRemove: 'yes' },
        query: { id: '1' }
      }
      await legalAgreementFileRemove.default[1].handler(request, h)
      request = {
        yar: redisMap,
        payload: { legalAgreementFileToRemove: 'yes' },
        query: { id: '2' }
      }
      await legalAgreementFileRemove.default[1].handler(request, h)
      expect(viewResult).toEqual(constants.routes.NEED_ADD_ALL_LEGAL_FILES)
      expect(redisMap.get(constants.redisKeys.LEGAL_AGREEMENT_FILES).length).toEqual(0)
    })
  })
})
