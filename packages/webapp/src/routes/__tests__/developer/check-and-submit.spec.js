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
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view for an organisation application`, async () => {
      jest.mock('../../../utils/helpers.js')
      const helpers = require('../../../utils/helpers.js')
      helpers.extractAllocationHabitatsByGainSiteNumber = jest.fn().mockImplementation(() => {
        return [{
          unit: 'm',
          items: [{
            header: 'testHeader',
            description: 'testDescription',
            condition: 'testCondition',
            amount: 'testAmount'
          }]
        }]
      })

      jest.spyOn(taskListUtil, 'getTaskList').mockReturnValue({ canSubmit: true })

      const res = await submitGetRequest({ url }, 200, developerApplicationData)
      expect(res.payload).not.toContain('Geoff')
    })
    it(`should render the ${url.substring(1)} view for an organisation application when is an agent`, async () => {
      const sessionData = { ...developerApplicationData }
      sessionData[constants.redisKeys.DEVELOPER_IS_AGENT] = constants.APPLICANT_IS_AGENT.YES
      sessionData[constants.redisKeys.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION] = constants.individualOrOrganisationTypes.INDIVIDUAL
      jest.mock('../../../utils/helpers.js')
      const helpers = require('../../../utils/helpers.js')
      helpers.extractAllocationHabitatsByGainSiteNumber = jest.fn().mockImplementation(() => {
        return [{
          unit: 'm',
          items: [{
            header: 'testHeader',
            description: 'testDescription',
            condition: 'testCondition',
            amount: 'testAmount'
          }]
        }]
      })

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
      const sessionData = { ...developerApplicationData }
      sessionData[constants.redisKeys.DEVELOPER_IS_AGENT] = constants.APPLICANT_IS_AGENT.YES
      sessionData[constants.redisKeys.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION] = constants.individualOrOrganisationTypes.ORGANISATION
      sessionData[constants.redisKeys.DEVELOPER_CLIENTS_ORGANISATION_NAME] = orgName
      jest.mock('../../../utils/helpers.js')
      const helpers = require('../../../utils/helpers.js')
      helpers.extractAllocationHabitatsByGainSiteNumber = jest.fn().mockImplementation(() => {
        return [{
          unit: 'm',
          items: [{
            header: 'testHeader',
            description: 'testDescription',
            condition: 'testCondition',
            amount: 'testAmount'
          }]
        }]
      })

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
      const sessionData = { ...developerApplicationData }
      sessionData[constants.redisKeys.DEVELOPER_IS_AGENT] = constants.APPLICANT_IS_AGENT.YES
      sessionData[constants.redisKeys.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION] = constants.individualOrOrganisationTypes.INDIVIDUAL
      sessionData[constants.redisKeys.DEVELOPER_CLIENTS_NAME] = clientName
      jest.mock('../../../utils/helpers.js')
      const helpers = require('../../../utils/helpers.js')
      helpers.extractAllocationHabitatsByGainSiteNumber = jest.fn().mockImplementation(() => {
        return [{
          unit: 'm',
          items: [{
            header: 'testHeader',
            description: 'testDescription',
            condition: 'testCondition',
            amount: 'testAmount'
          }]
        }]
      })

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
      jest.mock('../../../utils/helpers.js')
      const helpers = require('../../../utils/helpers.js')
      helpers.habitatTypeAndConditionMapper = jest.fn().mockImplementation(() => {
        return [{
          items: [{
            header: 'testHeader',
            description: 'testDescription',
            condition: 'testCondition',
            amount: 'testAmount'
          }]
        }]
      })

      jest.spyOn(taskListUtil, 'getTaskList').mockReturnValue({ canSubmit: false })

      const res = await submitGetRequest({ url }, 302, developerApplicationData)
      expect(res.payload).not.toContain('Geoff')
    })
  })

  describe('POST', () => {
    it('should process a valid application correctly', done => {
      jest.isolateModules(async () => {
        try {
          const session = setDeveloperApplicationSession()
          const postHandler = checkAnswers[1].handler

          jest.resetAllMocks()
          jest.mock('../../../utils/http.js')
          const http = require('../../../utils/http.js')
          http.postJson = jest.fn().mockImplementation(() => {
            return {
              applicationReference: 'test-reference'
            }
          })
          jest.mock('../../../utils/helpers.js')
          const helpers = require('../../../utils/helpers.js')
          helpers.habitatTypeAndConditionMapper = jest.fn().mockImplementation(() => {
            return [{
              items: [{
                header: 'testHeader',
                description: 'testDescription',
                condition: 'testCondition',
                amount: 'testAmount'
              }]
            }]
          })

          let viewArgs = ''
          let redirectArgs = ''
          const h = {
            view: (...args) => {
              viewArgs = args
            },
            redirect: (...args) => {
              redirectArgs = args
            }
          }

          await postHandler({ yar: session, auth }, h)
          expect(viewArgs).toEqual('')
          expect(redirectArgs).toEqual([constants.routes.DEVELOPER_CONFIRMATION])
          done()
        } catch (err) {
          done(err)
        }
      })
    })

    it('should fail if backend errors', done => {
      jest.isolateModules(async () => {
        try {
          const session = setDeveloperApplicationSession()
          const postHandler = checkAnswers[1].handler

          jest.resetAllMocks()
          jest.mock('../../../utils/http.js')
          const http = require('../../../utils/http.js')
          http.postJson = jest.fn().mockImplementation(() => {
            throw new Error('test error')
          })

          await expect(postHandler({ yar: session, auth })).rejects.toThrow('test error')
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })

  it('should throw an error page if validation fails for application', done => {
    jest.isolateModules(async () => {
      try {
        const session = setDeveloperApplicationSession()
        const postHandler = checkAnswers[1].handler
        session.set(constants.redisKeys.CREDITS_PURCHASE_APPLICATION_REFERENCE, undefined)

        let viewArgs = ''
        let redirectArgs = ''
        const h = {
          view: (...args) => {
            viewArgs = args
          },
          redirect: (...args) => {
            redirectArgs = args
          }
        }

        const authCopy = JSON.parse(JSON.stringify(auth))
        authCopy.credentials.account.idTokenClaims.contactId = ''

        await expect(postHandler({ yar: session, auth: authCopy }, h)).rejects.toThrow('ValidationError: "developerRegistration.applicant.id" is not allowed to be empty')
        expect(viewArgs).toEqual('')
        expect(redirectArgs).toEqual('')
        done()
      } catch (err) {
        done(err)
      }
    })
  })
})
