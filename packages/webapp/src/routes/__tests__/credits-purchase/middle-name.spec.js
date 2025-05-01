import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import creditsPurchaseConstants from '../../../utils/credits-purchase-constants.js'

const url = creditsPurchaseConstants.routes.CREDITS_PURCHASE_MIDDLE_NAME
const mockMiddleName = 'Oliver'

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })

    it('should render the view with previous values if in cache', async () => {
      const sessionData = {}
      sessionData[creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_MIDDLE_NAME] = {
        middleNameOption: 'yes',
        middleName: mockMiddleName
      }
      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).toContain(mockMiddleName)
    })

    it('should render the view with the correct error message when user doesnt select yes or no', async () => {
      const sessionData = {
        errors: [
          {
            text: 'Select yes if you have a middle name',
            href: '#middleNameOption'
          }
        ],
        middleNameOption: ''
      }

      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Select yes if you have a middle name')
    })

    it('should render the view with the correct error message when user selects yes but doesnt enter a middle name', async () => {
      const sessionData = {
        errors: [
          {
            text: 'Enter your middle name',
            href: '#middleName'
          }
        ],
        middleNameOption: 'yes',
        middleName: ''
      }

      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter your middle name')
    })

    it('should render the view with the correct error message when middle name is more than 50 characters', async () => {
      const sessionData = {
        errors: [
          {
            text: 'Enter a middle name that is 50 characters or fewer',
            href: '#middleName'
          }
        ],
        middleNameOption: 'yes',
        middleName: '123456789012345678901234567890123456789012345678901234567890'
      }

      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter a middle name that is 50 characters or fewer')
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

    it('Should continue journey if user selects no to middle name', async () => {
      postOptions.payload.middleNameOption = 'no'
      postOptions.payload.middleName = ''
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_DATE_OF_BIRTH)
    })

    it('Should continue journey if user selects yes to middle name and enters one', async () => {
      postOptions.payload.middleNameOption = 'yes'
      postOptions.payload.middleName = mockMiddleName
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_DATE_OF_BIRTH)
    })

    it('Should fail journey if user doesnt select yes or no', async () => {
      const res = await submitPostRequest(postOptions, 302)
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_MIDDLE_NAME)
    })

    it('Should fail journey if user selects yes to middle name but doesnt enter one', async () => {
      postOptions.payload.middleNameOption = 'yes'
      postOptions.payload.middleName = ''
      const res = await submitPostRequest(postOptions, 302)
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_MIDDLE_NAME)
    })

    it('Should fail journey if middle name is more than 50 characters', async () => {
      postOptions.payload.middleNameOption = 'yes'
      postOptions.payload.middleName = '123456789012345678901234567890123456789012345678901234567890'
      const res = await submitPostRequest(postOptions, 302)
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_MIDDLE_NAME)
    })
  })
})
