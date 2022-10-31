import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants'

const url = '/land/add-legal-agreement-parties'

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      const response = await submitGetRequest({ url })
      expect(response.statusCode).toBe(200)
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
      expect(response.headers.location).toBe('/land/legal-agreement-start-date')
    })

    it('should add single legal party to legal agreement and back to details referrer', async () => {
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
      expect(response.headers.location).toEqual('/land/legal-agreement-start-date')
    })

    it('should add single legal party to legal agreement and back to details referrer', async () => {
      const h = {
        view: jest.fn()
      }
      const redisMap = new Map()
      redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_PARTIES, {})
      const request = {
        yar: redisMap,
        headers: {
          referrer: 'http://localhost:3000/land/check-legal-agreement-details'
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
      expect(response.headers.location).toEqual('/land/legal-agreement-start-date')
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
      expect(response.headers.location).toEqual('/land/legal-agreement-start-date')
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
    it('should add multiple legal organisation with other party choice to legal agreement from referrer', async () => {
      jest.isolateModules(async () => {
        let viewResult
        const legalAgreementParties = require('../../land/add-legal-agreement-parties.js')
        const redisMap = new Map()
        redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_PARTIES_KEY, 'http://localhost:3000/land/check-legal-agreement-details')
        const request = {
          yar: redisMap,
          payload: {
            'organisation[0][organisationName]': 'Test',
            'organisation[0][role]': 'Other',
            otherPartyName: [
              'party One',
              'Party two'
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
        expect(viewResult).toEqual(constants.routes.LEGAL_AGREEMENT_SUMMARY)
      })
    })
  })
})
