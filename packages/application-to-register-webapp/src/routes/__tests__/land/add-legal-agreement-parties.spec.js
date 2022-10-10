import { submitGetRequest, submitPostRequest } from '../helpers/server.js'

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
    })

    it('should fail to add single legal party to legal agreement without organisation name', async () => {
      postOptions.payload = {
        'organisation[0][organisationName]': '',
        'organisation[0][role]': 'Developer',
        otherPartyName: ''
      }
      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
    })

    it('should fail to add single legal party to legal agreement without organisation name', async () => {
      postOptions.payload = {
        'organisation[0][organisationName]': '',
        'organisation[0][role]': 'Developer',
        otherPartyName: ''
      }
      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
    })

    it('should fail to add single legal party to legal agreement without organisation name nor role', async () => {
      postOptions.payload = {
        'organisation[0][organisationName]': '',
        otherPartyName: ''
      }
      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
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
    })
  })
})
