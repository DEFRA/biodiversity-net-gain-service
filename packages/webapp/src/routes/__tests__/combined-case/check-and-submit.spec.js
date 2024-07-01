import { submitGetRequest } from '../helpers/server.js'
import developerApplicationData from '../../../__mocks__/developer-application-data.js'
import setDeveloperApplicationSession from '../../../__mocks__/developer-application-session.js'
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

      const res = await submitGetRequest({ url }, 200, developerApplicationData)
      expect(res.payload).not.toContain('Geoff')
    })

    it('should redirect the view for an organisation application when canSubmit is false', async () => {
      jest.spyOn(taskListUtil, 'getTaskList').mockReturnValue({ canSubmit: false })

      const res = await submitGetRequest({ url }, 302, developerApplicationData)
      expect(res.payload).not.toContain('Geoff')
    })
  })

  describe('POST', () => {
    it('should process a valid application correctly', async () => {
      const session = setDeveloperApplicationSession()
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
      expect(h.redirect).toHaveBeenCalledWith(constants.routes.COMBINED_CASE_TASK_LIST)
    })
  })
})
