import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants'

const url = constants.routes.ADD_LEGAL_AGREEMENT_PARTIES

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      const response = await submitGetRequest({ url })
      expect(response.statusCode).toBe(200)
    })
    it('should redirect to Start page if no data applicant data is available in session', async () => {
      const response = await submitGetRequest({ url }, 302, {})
      expect(response.headers.location).toEqual(constants.routes.START)
    })
    it(`should render the ${url.substring(1)} view with undefined other party`, async () => {
      jest.isolateModules(async () => {
        let viewResult, contextResult
        const redisMap = new Map()
        const legalAgreementDetails = require('../../land/add-legal-agreement-parties')
        redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_PARTIES, {
          roles: [
            {
              otherPartyName: undefined
            }
          ]
        })
        const request = {
          yar: redisMap
        }
        const h = {
          view: (view, context) => {
            viewResult = view
            contextResult = context
          }
        }
        await legalAgreementDetails.default[0].handler(request, h)
        expect(viewResult).toEqual(constants.views.ADD_LEGAL_AGREEMENT_PARTIES)
        expect(contextResult.roles[0].otherPartyName).toEqual('')
      })
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

    it('should add single legal party to legal agreement', async () => {
      postOptions.payload = {
        'organisation[0][organisationName]': 'Bambury',
        'organisation[0][role]': 'County Council',
        otherPartyName: ''
      }
      const response = await submitPostRequest(postOptions)
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe(constants.routes.LEGAL_AGREEMENT_START_DATE)
    })

    it('should add single legal party to legal agreement and back to details referer', async () => {
      const h = {
        view: jest.fn()
      }
      const redisMap = new Map()
      redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_PARTIES, {})
      const request = {
        yar: redisMap,
        headers: {
          referer: 'http://localhost:3000/land/check-legal-agreement-details'
        }
      }
      const legalAgreementParties = require('../../land/add-legal-agreement-parties')
      await legalAgreementParties.default[0].handler(request, h)

      postOptions.payload = {
        'organisation[0][organisationName]': 'Bambury',
        'organisation[0][role]': 'County Council',
        otherPartyName: ''
      }
      const response = await submitPostRequest(postOptions)
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toEqual(constants.routes.LEGAL_AGREEMENT_START_DATE)
    })

    it('should add single legal party to legal agreement and back to details referer', async () => {
      const redisMap = new Map()
      redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_PARTIES, {})
      postOptions.headers = {
        referer: 'http://localhost:3000/land/check-legal-agreement-details'
      }

      postOptions.payload = {
        'organisation[0][organisationName]': 'Bambury',
        'organisation[0][role]': 'County Council',
        otherPartyName: ''
      }
      const response = await submitPostRequest(postOptions)
      expect(response.statusCode).toBe(302)
    })

    it('should add multiple legal party to legal agreement', async () => {
      postOptions.payload = {
        'organisation[0][organisationName]': 'Sun',
        'organisation[0][role]': 'Developer',
        'organisation[1][organisationName]': 'Intel',
        'organisation[1][role]': 'County Council',
        'organisation[2][organisationName]': 'Intelij',
        'organisation[2][role]': 'Landowner',
        'organisation[3][organisationName]': 'Intelijet',
        'organisation[3][role]': 'Responsible body',
        otherPartyName: [
          '',
          ''
        ]
      }
      const response = await submitPostRequest(postOptions)
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toEqual(constants.routes.LEGAL_AGREEMENT_START_DATE)
    })

    it('should add multiple legal organisation with other party choice to legal agreement', async () => {
      postOptions.payload = {
        'organisation[0][organisationName]': 'Test',
        'organisation[0][role]': 'Other',
        otherPartyName: [
          'party One',
          'Party two'
        ],
        'organisation[1][organisationName]': 'Test Two',
        'organisation[1][role]': 'Other'
      }
      const response = await submitPostRequest(postOptions)
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toEqual(constants.routes.LEGAL_AGREEMENT_START_DATE)
    })

    it('should fail to add single legal party to legal agreement without organisation name', async () => {
      postOptions.payload = {
        'organisation[0][organisationName]': '',
        'organisation[0][role]': 'Developer',
        otherPartyName: ''
      }
      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
      expect(response.request.payload).toEqual(postOptions.payload)
      expect(response.result.indexOf('There is a problem')).toBeGreaterThan(1)
      expect(response.result.indexOf('Enter the name of the legal party')).toBeGreaterThan(1)
    })

    it('should fail to add single legal party to legal agreement without organisation name nor role', async () => {
      postOptions.payload = {
        'organisation[0][organisationName]': '',
        otherPartyName: ''
      }
      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
      expect(response.request.payload).toEqual(postOptions.payload)
      expect(response.result.indexOf('Select the role')).toBeGreaterThan(1)
      expect(response.result.indexOf('Enter the name of the legal party')).toBeGreaterThan(1)
    })

    it('should fail to add single legal party to legal agreement without other organisation name', async () => {
      postOptions.payload = {
        'organisation[0][organisationName]': 'Test one',
        'organisation[0][role]': 'Other',
        otherPartyName: [
          '',
          ''
        ],
        'organisation[1][organisationName]': 'Test Two',
        'organisation[1][role]': 'Other'
      }
      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
      expect(response.result.indexOf('Other type of role cannot be left blank')).toBeGreaterThan(1)
    })

    it('should add multiple legal organisation with other party choice to legal agreement from referer', async () => {
      jest.isolateModules(async () => {
        let viewResult
        const legalAgreementParties = require('../../land/add-legal-agreement-parties.js')
        const redisMap = new Map()
        redisMap.set(constants.redisKeys.REFERER, constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS)
        const request = {
          yar: redisMap,
          payload: {
            'organisation[0][organisationName]': 'Test',
            'organisation[0][role]': 'Other',
            otherPartyName: [
              'party One',
              'Other role'
            ],
            'organisation[1][organisationName]': 'Test Two',
            'organisation[1][role]': 'Other'
          }
        }
        const h = {
          redirect: (view, context) => {
            viewResult = view
          }
        }
        await legalAgreementParties.default[1].handler(request, h)
        expect(viewResult).toEqual(constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS)
        expect(request.yar.get(constants.redisKeys.REFERER)).toBe(constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS)
        expect(request.yar.get('legal-agreement-parties').organisations.length).toBe(2)
        expect(request.yar.get('legal-agreement-parties').roles.length).toBe(2)
        expect(request.yar.get('legal-agreement-parties').roles[0].otherPartyName).toBe('party One')
        expect(request.yar.get('legal-agreement-parties').roles[1].otherPartyName).toBe('Other role')
        expect(request.yar.get('legal-agreement-parties').organisationError.length).toBe(0)
        expect(request.yar.get('legal-agreement-parties').roleError.length).toBe(0)
      })
    })
  })
})
