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

    it('Should fail journey if user selects doesnt select yes or no', async () => {
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Select yes if you have a middle name')
    })

    it('Should fail journey if user selects yes to middle name but doesnt enter one', async () => {
      postOptions.payload.middleNameOption = 'yes'
      postOptions.payload.middleName = ''
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter your middle name')
    })

    it('Should fail journey if middle name is more than 50 characters', async () => {
      postOptions.payload.middleNameOption = 'yes'
      postOptions.payload.middleName = '123456789012345678901234567890123456789012345678901234567890'
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Middle name must be 50 characters or fewer')
    })
  })
})
