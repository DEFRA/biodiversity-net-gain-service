import { submitGetRequest, submitPostRequest } from '../helpers/server.js'

const url = '/land/legal-agreement-start-date'

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

    it('should add a legal agreement start date', async () => {
      postOptions.payload['legalAgreementStartDate-day'] = '01'
      postOptions.payload['legalAgreementStartDate-month'] = '01'
      postOptions.payload['legalAgreementStartDate-year'] = '1971'

      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
    })

    it('should fail to add a legal agreement start date with empty dates', async () => {
      postOptions.payload['legalAgreementStartDate-day'] = ''
      postOptions.payload['legalAgreementStartDate-month'] = ''
      postOptions.payload['legalAgreementStartDate-year'] = ''

      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
    })

    it('should fail to add a legal agreement start date with invalid dates', async () => {
      postOptions.payload['legalAgreementStartDate-day'] = 'xx'
      postOptions.payload['legalAgreementStartDate-month'] = 'zz'
      postOptions.payload['legalAgreementStartDate-year'] = 'cc'

      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
    })

    it('should fail to add a legal agreement start date with wrong day', async () => {
      postOptions.payload['legalAgreementStartDate-day'] = 'x1'
      postOptions.payload['legalAgreementStartDate-month'] = '11'
      postOptions.payload['legalAgreementStartDate-year'] = '2020'

      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
    })

    it('should fail to add a legal agreement start date with wrong month', async () => {
      postOptions.payload['legalAgreementStartDate-day'] = '11'
      postOptions.payload['legalAgreementStartDate-month'] = '23'
      postOptions.payload['legalAgreementStartDate-year'] = '2020'

      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
    })

    it('should fail to add a legal agreement start date with wrong year', async () => {
      postOptions.payload['legalAgreementStartDate-day'] = '11'
      postOptions.payload['legalAgreementStartDate-month'] = '23'
      postOptions.payload['legalAgreementStartDate-year'] = '2a20'

      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
    })
  })
})
