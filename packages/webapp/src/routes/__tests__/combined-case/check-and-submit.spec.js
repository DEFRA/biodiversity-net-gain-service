import { submitGetRequest } from '../helpers/server.js'
import combinedCaseApplicationData from '../../../__mocks__/combined-case-application-data.js'
import setDeveloperApplicationSession from '../../../__mocks__/combined-case-application-session.js'
import applicant from '../../../__mocks__/applicant.js'
import constants from '../../../utils/constants.js'
import * as taskListUtil from '../../../journey-validation/task-list-generator.js'

const checkAnswers = require('../../combined-case/check-and-submit.js').default
const url = constants.routes.COMBINED_CASE_CHECK_AND_SUBMIT

jest.mock('../../../utils/http.js')
jest.mock('../../../utils/helpers.js')

const auth = {
  credentials: {
    account: applicant
  }
}

describe(url, () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view `, async () => {
      jest.spyOn(taskListUtil, 'getTaskList').mockReturnValue({ canSubmit: true })

      const res = await submitGetRequest({ url }, 200, combinedCaseApplicationData)
      expect(res.payload).not.toContain('Geoff')
    })

    it('should redirect the view when already submitted', async () => {
      jest.spyOn(taskListUtil, 'getTaskList').mockReturnValue({ canSubmit: false })
      const session = {
        [constants.redisKeys.COMBINED_CASE_APPLICATION_SUBMITTED]: true
      }
      const res = await submitGetRequest({ url }, 302, { ...combinedCaseApplicationData, ...session })
      expect(res.payload).not.toContain('Geoff')
    })

    it('should redirect the view for an organisation application when canSubmit is false', async () => {
      jest.spyOn(taskListUtil, 'getTaskList').mockReturnValue({ canSubmit: false })

      const res = await submitGetRequest({ url }, 302, combinedCaseApplicationData)
      expect(res.payload).not.toContain('Geoff')
    })
  })

  describe('POST', () => {
    it('should process a valid application correctly', async () => {
      const session = setDeveloperApplicationSession()
      session.set(constants.redisKeys.COMBINED_CASE_APPLICATION_REFERENCE, '123')
      const postHandler = checkAnswers[1].handler

      jest.mock('../../../utils/http.js')
      const http = require('../../../utils/http.js')
      http.postJson = jest.fn().mockReturnValue({ applicationReference: 'test-reference' })

      const payload = { termsAndConditionsConfirmed: 'Yes' }
      const h = {
        view: jest.fn(),
        redirect: jest.fn()
      }

      await postHandler({ yar: session, auth, payload }, h)
      expect(h.view).not.toHaveBeenCalled()
      expect(h.redirect).toHaveBeenCalledWith(constants.routes.APPLICATION_SUBMITTED)
    })

    it('should display an error message if user has not confirmed reading terms and conditions', async () => {
      const session = setDeveloperApplicationSession()
      const postHandler = checkAnswers[1].handler

      const payload = { termsAndConditionsConfirmed: 'No' }
      const h = {
        view: jest.fn(),
        redirect: jest.fn()
      }

      await postHandler({ payload, auth, yar: session }, h)

      expect(h.view).toHaveBeenCalledWith(
        constants.views.COMBINED_CASE_CHECK_AND_SUBMIT,
        expect.objectContaining({
          err: [{
            text: 'You must confirm you have read the terms and conditions',
            href: '#termsAndConditionsConfirmed'
          }]
        })
      )
    })
  })
})
