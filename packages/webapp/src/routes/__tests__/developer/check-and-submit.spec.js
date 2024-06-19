import { submitGetRequest } from '../helpers/server.js'
import developerApplicationData from '../../../__mocks__/developer-application-data.js'
import setDeveloperApplicationSession from '../../../__mocks__/developer-application-session.js'
import applicant from '../../../__mocks__/applicant.js'
import constants from '../../../utils/constants.js'
import * as taskListUtil from '../../../journey-validation/task-list-generator.js'

const checkAnswers = require('../../developer/check-and-submit.js').default
const url = constants.routes.DEVELOPER_CHECK_AND_SUBMIT

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
    const helpers = require('../../../utils/helpers.js')
    helpers.extractAllocationHabitatsByGainSiteNumber = jest.fn().mockReturnValue([{
      unit: 'm',
      items: [{
        header: 'testHeader',
        description: 'testDescription',
        condition: 'testCondition',
        amount: 'testAmount'
      }]
    }])
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view for an organisation application`, async () => {
      jest.spyOn(taskListUtil, 'getTaskList').mockReturnValue({ canSubmit: true })

      const res = await submitGetRequest({ url }, 200, developerApplicationData)
      expect(res.payload).not.toContain('Geoff')
    })

    it(`should render the ${url.substring(1)} view for an organisation application when is an agent`, async () => {
      const sessionData = {
        ...developerApplicationData,
        [constants.redisKeys.DEVELOPER_IS_AGENT]: constants.APPLICANT_IS_AGENT.YES,
        [constants.redisKeys.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION]: constants.individualOrOrganisationTypes.INDIVIDUAL
      }

      jest.spyOn(taskListUtil, 'getTaskList').mockReturnValue({ canSubmit: true })

      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).not.toContain('Geoff')
      expect(res.payload).toContain('Client is a landowner or leaseholder')
      expect(res.payload).not.toContain('Applying as landowner or leaseholder')
      expect(res.payload).toContain('Client is an individual or organisation')
      expect(res.payload).not.toContain('Applying as individual or organisation')
    })

    it(`should render the ${url.substring(1)} view where client is an organisation`, async () => {
      const orgName = 'Test Org 1234'
      const sessionData = {
        ...developerApplicationData,
        [constants.redisKeys.DEVELOPER_IS_AGENT]: constants.APPLICANT_IS_AGENT.YES,
        [constants.redisKeys.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION]: constants.individualOrOrganisationTypes.ORGANISATION,
        [constants.redisKeys.DEVELOPER_CLIENTS_ORGANISATION_NAME]: orgName
      }

      jest.spyOn(taskListUtil, 'getTaskList').mockReturnValue({ canSubmit: true })

      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).not.toContain('Geoff')
      expect(res.payload).toContain('Client is a landowner or leaseholder')
      expect(res.payload).not.toContain('Applying as landowner or leaseholder')
      expect(res.payload).toContain('Client is an individual or organisation')
      expect(res.payload).not.toContain('Applying as individual or organisation')
      expect(res.payload).toContain(orgName)
      expect(res.payload).toContain('Client&#39;s organisation name')
    })

    it(`should render the ${url.substring(1)} view where client is an individual`, async () => {
      const clientName = {
        value: {
          firstName: 'Test',
          lastName: 'Name'
        }
      }
      const sessionData = {
        ...developerApplicationData,
        [constants.redisKeys.DEVELOPER_IS_AGENT]: constants.APPLICANT_IS_AGENT.YES,
        [constants.redisKeys.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION]: constants.individualOrOrganisationTypes.INDIVIDUAL,
        [constants.redisKeys.DEVELOPER_CLIENTS_NAME]: clientName
      }

      jest.spyOn(taskListUtil, 'getTaskList').mockReturnValue({ canSubmit: true })

      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).not.toContain('Geoff')
      expect(res.payload).toContain('Client is a landowner or leaseholder')
      expect(res.payload).not.toContain('Applying as landowner or leaseholder')
      expect(res.payload).toContain('Client is an individual or organisation')
      expect(res.payload).not.toContain('Applying as individual or organisation')
      expect(res.payload).toContain(`${clientName.value.firstName} ${clientName.value.lastName}`)
      expect(res.payload).toContain('Client&#39;s name')
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
      expect(h.redirect).toHaveBeenCalledWith(constants.routes.DEVELOPER_CONFIRMATION)
    })

    it('should fail if backend errors', async () => {
      const session = setDeveloperApplicationSession()
      const postHandler = checkAnswers[1].handler

      jest.mock('../../../utils/http.js')
      const http = require('../../../utils/http.js')
      http.postJson = jest.fn().mockImplementation(() => {
        throw new Error('test error')
      })

      const payload = { termsAndConditionsConfirmed: 'Yes' }
      await expect(postHandler({ yar: session, auth, payload })).rejects.toThrow('test error')
    })

    it('should throw an error page if validation fails for application', async () => {
      const session = setDeveloperApplicationSession()
      const postHandler = checkAnswers[1].handler
      session.set(constants.redisKeys.CREDITS_PURCHASE_APPLICATION_REFERENCE, undefined)

      const authCopy = JSON.parse(JSON.stringify(auth))
      authCopy.credentials.account.idTokenClaims.contactId = ''

      const payload = { termsAndConditionsConfirmed: 'Yes' }
      const h = {
        view: jest.fn(),
        redirect: jest.fn()
      }

      await expect(postHandler({ yar: session, auth: authCopy, payload }, h)).rejects.toThrow('ValidationError: "developerRegistration.applicant.id" is not allowed to be empty')
      expect(h.view).not.toHaveBeenCalled()
      expect(h.redirect).not.toHaveBeenCalled()
    })

    it('should display an error message if user has not confirmed reading terms and conditions', async () => {
      const session = setDeveloperApplicationSession()
      session.set(constants.redisKeys.DEVELOPER_PLANNING_DECISION_NOTICE_LOCATION, 'dummy/path/to/file')

      const postHandler = checkAnswers[1].handler

      const payload = { termsAndConditionsConfirmed: 'No' }
      const h = {
        view: jest.fn(),
        redirect: jest.fn()
      }

      await postHandler({ payload, auth, yar: session }, h)

      expect(h.view).toHaveBeenCalledWith(
        constants.views.DEVELOPER_CHECK_AND_SUBMIT,
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
