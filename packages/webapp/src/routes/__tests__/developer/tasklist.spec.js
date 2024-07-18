import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants'

const url = constants.routes.DEVELOPER_TASKLIST

const notStartedStatus = { tag: { classes: 'govuk-tag--blue', text: 'Not started' } }
const cannotStartYetStatus = { tag: { classes: 'govuk-tag--blue', text: 'Cannot start yet' } }
const completedStatus = { text: 'Completed' }

describe(url, () => {
  describe('GET', () => {
    let getOptions
    beforeEach(() => {
      getOptions = {
        url
      }
    })
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
    it('should render view with no completed task', async () => {
      let viewResult, contextResult
      const h = {
        view: (view, context) => {
          viewResult = view
          contextResult = context
        }
      }
      const redisMap = new Map()
      const request = {
        yar: redisMap
      }

      const developerTasklist = require('../../../routes/developer/tasklist')
      await developerTasklist.default[0].handler(request, h)

      const response = await submitGetRequest(getOptions)
      expect(response.statusCode).toBe(200)
      expect(viewResult).toEqual('developer/tasklist')
      expect(contextResult.tasks.taskList.length).toEqual(3)
      expect(contextResult.tasks.taskList[0]).toEqual({
        taskTitle: 'Applicant information',
        items: [
          {
            title: { text: 'Add details about the applicant' },
            status: notStartedStatus,
            href: constants.routes.DEVELOPER_AGENT_ACTING_FOR_CLIENT,
            id: 'applicant-details'
          }
        ]
      })
      expect(contextResult.tasks.taskList[1]).toEqual({
        taskTitle: 'Development information',
        items: [
          {
            title: { text: 'Add biodiversity gain site details' },
            status: notStartedStatus,
            href: constants.routes.DEVELOPER_BNG_NUMBER,
            id: 'gain-site-allocation-info'
          },
          {
            title: { text: 'Add development project details' },
            status: notStartedStatus,
            href: constants.routes.DEVELOPER_DEVELOPMENT_PROJECT_INFORMATION,
            id: 'add-devlopment-project-information'
          },
          {
            title: { text: 'Upload planning decision notice' },
            status: notStartedStatus,
            href: constants.routes.DEVELOPER_UPLOAD_PLANNING_DECISION_NOTICE,
            id: 'planning-decision-notice'
          }
        ]
      })
      expect(contextResult.tasks.taskList[2]).toEqual({
        taskTitle: 'Submit your off-site gains information',
        items: [
          {
            title: { text: 'Check your answers and submit' },
            status: cannotStartYetStatus,
            id: 'check-your-answers'
          }
        ]
      })
    })

    it('should render view with completed task when session variables set', async () => {
      let viewResult, contextResult
      const h = {
        view: (view, context) => {
          viewResult = view
          contextResult = context
        }
      }
      const redisMap = new Map()
      const request = {
        yar: redisMap
      }

      redisMap.set(constants.redisKeys.DEVELOPER_PLANNING_DECISION_NOTICE_LOCATION, 'mock')
      redisMap.set(constants.redisKeys.DEVELOPER_PLANNING_DECISION_NOTICE_FILE_SIZE, 'mock')
      redisMap.set(constants.redisKeys.DEVELOPER_PLANNING_DECISION_NOTICE_FILE_TYPE, 'mock')
      redisMap.set(constants.redisKeys.DEVELOPER_PLANNING_DECISION_NOTICE_CHECKED, 'yes')

      const developerTasklist = require('../../../routes/developer/tasklist')
      await developerTasklist.default[0].handler(request, h)

      const response = await submitGetRequest(getOptions)

      expect(response.statusCode).toBe(200)
      expect(viewResult).toEqual('developer/tasklist')
      expect(contextResult.tasks.taskList.length).toEqual(3)

      expect(contextResult.tasks.taskList[1]).toEqual({
        taskTitle: 'Development information',
        items: [
          {
            title: { text: 'Add biodiversity gain site details' },
            status: notStartedStatus,
            href: constants.routes.DEVELOPER_BNG_NUMBER,
            id: 'gain-site-allocation-info'
          },
          {
            title: { text: 'Add development project details' },
            status: notStartedStatus,
            href: constants.routes.DEVELOPER_DEVELOPMENT_PROJECT_INFORMATION,
            id: 'add-devlopment-project-information'
          },
          {
            title: { text: 'Upload planning decision notice' },
            status: completedStatus,
            href: constants.routes.DEVELOPER_CHECK_PLANNING_DECISION_NOTICE_FILE,
            id: 'planning-decision-notice'
          }
        ]
      })
    })
  })
})
