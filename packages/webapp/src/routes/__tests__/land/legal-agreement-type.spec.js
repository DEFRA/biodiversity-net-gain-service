import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants'

const url = constants.routes.LEGAL_AGREEMENT_TYPE

describe(url, () => {
  const redisMap = new Map()
  redisMap.set(constants.redisKeys.APPLICATION_TYPE, constants.applicationTypes.REGISTRATION)

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view without any selection`, async () => {
      await submitGetRequest({ url })
    })

    it(`should render the ${url.substring(1)} view with conservation selected`, async () => {
      jest.isolateModules(async () => {
        redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE, '759150001')
        let viewResult, contextResult
        const legalAgreementDetails = require('../../land/legal-agreement-type')
        const request = {
          yar: redisMap,
          headers: {
            referer: 'http://localhost:3000/land/check-legal-agreement-details'
          }
        }
        const h = {
          view: (view, context) => {
            viewResult = view
            contextResult = context
          }
        }
        await legalAgreementDetails.default[0].handler(request, h)
        expect(viewResult).toEqual(constants.views.LEGAL_AGREEMENT_TYPE)
        expect(contextResult.documentType).toEqual('759150001')
      })
    })

    it(`should render the ${url.substring(1)} view with planning selected`, async () => {
      jest.isolateModules(async () => {
        redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE, '759150000')
        let viewResult, contextResult
        const legalAgreementDetails = require('../../land/legal-agreement-type')
        const request = {
          yar: redisMap,
          headers: {
            referer: 'http://localhost:3000/land/check-legal-agreement-details'
          }
        }
        const h = {
          view: (view, context) => {
            viewResult = view
            contextResult = context
          }
        }
        await legalAgreementDetails.default[0].handler(request, h)
        expect(viewResult).toEqual(constants.views.LEGAL_AGREEMENT_TYPE)
        expect(contextResult.documentType).toEqual('759150000')
      })
    })

    it(`should render the ${url.substring(1)} view with dont have selected`, async () => {
      jest.isolateModules(async () => {
        redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE, '-1')
        let viewResult, contextResult
        const legalAgreementDetails = require('../../land/legal-agreement-type')
        const request = {
          yar: redisMap,
          headers: {
            referer: 'http://localhost:3000/land/check-legal-agreement-details'
          }
        }
        const h = {
          view: (view, context) => {
            viewResult = view
            contextResult = context
          }
        }
        await legalAgreementDetails.default[0].handler(request, h)
        expect(viewResult).toEqual(constants.views.LEGAL_AGREEMENT_TYPE)
        expect(contextResult.documentType).toEqual('-1')
      })
    })

    it(`should render the ${url.substring(1)} view with nothing selected`, async () => {
      jest.isolateModules(async () => {
        redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE, '')
        let viewResult, contextResult
        const legalAgreementDetails = require('../../land/legal-agreement-type')
        const request = {
          yar: redisMap,
          headers: {
            referer: 'http://localhost:3000/land/check-legal-agreement-details'
          }
        }
        const h = {
          view: (view, context) => {
            viewResult = view
            contextResult = context
          }
        }
        await legalAgreementDetails.default[0].handler(request, h)
        expect(viewResult).toEqual('land/legal-agreement-type')
        expect(contextResult.documentType).toEqual('')
      })
    })
  })

  describe('POST', () => {
    let postOptions
    const sessionData = {}
    beforeAll(async () => {
      sessionData[constants.redisKeys.APPLICATION_TYPE] = constants.applicationTypes.REGISTRATION
    })
    beforeEach(async () => {
      postOptions = {
        url,
        payload: {}
      }
    })
    it('should allow the choice of conservation covenant legal agreement', async () => {
      postOptions.payload.legalAgreementType = '759150001'
      const response = await submitPostRequest(postOptions, 302, sessionData)
      expect(response.request.response.headers.location).toBe(constants.routes.NEED_ADD_ALL_LEGAL_FILES)
    })

    it('should allow the choice of Planning obligation (section 106 agreement) legal agreement', async () => {
      postOptions.payload.legalAgreementType = '759150000'
      const response = await submitPostRequest(postOptions, 302, sessionData)
      expect(response.request.response.headers.location).toBe(constants.routes.NEED_ADD_ALL_LEGAL_FILES)
    })

    it('should go to upload legal agreement if legal agreement type is changed', async () => {
      let viewResult
      const h = {
        redirect: (view, context) => {
          viewResult = view
        }
      }
      redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE, '759150000')
      const legalAgreementDetails = require('../../land/legal-agreement-type')
      const request = {
        yar: redisMap,
        payload: {
          legalAgreementType: '759150000'
        },
        path: legalAgreementDetails.default[1].path
      }
      await legalAgreementDetails.default[1].handler(request, h)

      postOptions.payload.legalAgreementType = '759150001'
      await submitPostRequest(postOptions, 302, sessionData)
      expect(viewResult).toBe(constants.routes.NEED_ADD_ALL_LEGAL_FILES)
    })

    it('should go back to detail if referred if legal agreement type is not changed', async () => {
      let viewResult
      const h = {
        redirect: (view, context) => {
          viewResult = view
        }
      }
      redisMap.set(constants.redisKeys.REFERER, constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS)
      redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE, '759150000')
      const legalAgreementDetails = require('../../land/legal-agreement-type')
      const request = {
        yar: redisMap,
        info: {
          referer: 'http://localhost:3000/land/check-legal-agreement-details'
        },
        payload: {
          legalAgreementType: '759150000'
        },
        path: legalAgreementDetails.default[1].path
      }
      await legalAgreementDetails.default[1].handler(request, h)

      postOptions.payload.legalAgreementType = '759150000'
      await submitPostRequest(postOptions, 302, sessionData)
      expect(viewResult).toBe(constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS)
    })

    it('should allow the choice of I do not have a legal agreement', async () => {
      postOptions.payload.legalAgreementType = '-1'
      const response = await submitPostRequest(postOptions, 302, sessionData)
      expect(response.headers.location).toEqual(constants.routes.NEED_LEGAL_AGREEMENT)
    })

    it('should detect an invalid response from user', async () => {
      await submitPostRequest(postOptions, 200, sessionData)
    })
  })
})
