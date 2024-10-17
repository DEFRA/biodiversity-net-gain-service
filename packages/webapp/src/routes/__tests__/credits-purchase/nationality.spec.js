import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import creditsPurchaseConstants from '../../../utils/credits-purchase-constants.js'

const url = creditsPurchaseConstants.routes.CREDITS_PURCHASE_NATIONALITY

const mockNationalities = {
  nationality1: 'Australian',
  nationality2: 'Spanish',
  nationality3: '',
  nationality4: ''
}

const mockNationalitiesAlt = {
  nationality1: '',
  nationality2: '',
  nationality3: 'American',
  nationality4: ''
}

const mockNationalitiesNone = {
  nationality1: '',
  nationality2: '',
  nationality3: '',
  nationality4: ''
}

const mockNationalitiesDuplicates = {
  nationality1: 'Mexican',
  nationality2: '',
  nationality3: '',
  nationality4: 'Mexican'
}

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })

    it('should render the view with previous values if in cache', async () => {
      const sessionData = {}
      sessionData[creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_NATIONALITY] = mockNationalities
      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).toContain(mockNationalities.nationality1)
      expect(res.payload).toContain(mockNationalities.nationality2)
    })

    it('should render the view with the correct error message when no option is selected', async () => {
      const sessionData = {
        errors: [
          {
            text: 'Select a nationality from the dropdown list',
            href: '#nationality1'
          }
        ],
        hasAtLeastOneNationality: false
      }

      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Select a nationality from the dropdown list')
    })

    it('should render the view with the correct error message when duplicate nationalities are selected', async () => {
      const sessionData = {
        errors: [
          {
            text: 'Remove duplicate nationality',
            href: '#nationality1'
          }
        ],
        hasAtLeastOneNationality: true,
        isUnique: false
      }

      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Remove duplicate nationality')
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

    it('Should continue journey if user enters nationalities', async () => {
      postOptions.payload = mockNationalities
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_CUSTOMER_DUE_DILIGENCE)
    })

    it('Should continue journey if user enters nationality in any drop down', async () => {
      postOptions.payload = mockNationalitiesAlt
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_CUSTOMER_DUE_DILIGENCE)
    })

    it('Should fail journey if user doesnt select a nationality', async () => {
      postOptions.payload = mockNationalitiesNone
      const res = await submitPostRequest(postOptions, 302)
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_NATIONALITY)
    })

    it('Should fail journey if user selects duplicate nationalities', async () => {
      postOptions.payload = mockNationalitiesDuplicates
      const res = await submitPostRequest(postOptions, 302)
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_NATIONALITY)
    })
  })
})
