import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants'

const url = constants.routes.DEVELOPER_TASKLIST

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
        dependantIds: [],
        id: null,
        taskTitle: 'Applicant information',
        items: [
          {
            title: { html: "<span id='applicant-details'>Add details about the applicant</span>" },
            status: {
              tag: {
                html: '<span id="applicant-details-status">Not started</span>',
                classes: 'govuk-tag--grey'
              }
            },
            href: constants.routes.DEVELOPER_AGENT_ACTING_FOR_CLIENT,
            id: 'applicant-details'
          }
        ]
      })
      expect(contextResult.tasks.taskList[1]).toEqual({
        dependantIds: [],
        id: null,
        taskTitle: 'Development information',
        items: [
          {
            title: { html: "<span id='gain-site-allocation-info'>Add biodiversity gain site details</span>" },
            status: {
              tag: {
                html: '<span id="gain-site-allocation-info-status">Not started</span>',
                classes: 'govuk-tag--grey'
              }
            },
            href: constants.routes.DEVELOPER_BNG_NUMBER,
            id: 'gain-site-allocation-info'
          },
          {
            title: { html: "<span id='add-development-project-information'>Add development project details</span>" },
            status: {
              tag: {
                html: '<span id="add-development-project-information-status">Not started</span>',
                classes: 'govuk-tag--grey'
              }
            },
            href: constants.routes.DEVELOPER_DEVELOPMENT_PROJECT_INFORMATION,
            id: 'add-development-project-information'
          },
          {
            title: { html: "<span id='planning-decision-notice'>Upload planning decision notice</span>" },
            status: {
              tag: {
                html: '<span id="planning-decision-notice-status">Not started</span>',
                classes: 'govuk-tag--grey'
              }
            },
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
            status: {
              tag: {
                html: '<span id="check-your-answers-status">Cannot start yet</span>',
                classes: 'govuk-tag--grey'
              }
            },
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
        dependantIds: [],
        id: null,
        taskTitle: 'Development information',
        items: [
          {
            title: { html: "<span id='gain-site-allocation-info'>Add biodiversity gain site details</span>" },
            status: {
              tag: {
                html: '<span id="gain-site-allocation-info-status">Not started</span>',
                classes: 'govuk-tag--grey'
              }
            },
            href: constants.routes.DEVELOPER_BNG_NUMBER,
            id: 'gain-site-allocation-info'
          },
          {
            title: { html: "<span id='add-development-project-information'>Add development project details</span>" },
            status: {
              tag: {
                html: '<span id="add-development-project-information-status">Not started</span>',
                classes: 'govuk-tag--grey'
              }
            },
            href: constants.routes.DEVELOPER_DEVELOPMENT_PROJECT_INFORMATION,
            id: 'add-development-project-information'
          },
          {
            title: { html: "<span id='planning-decision-notice'>Upload planning decision notice</span>" },
            status: { html: '<span id="planning-decision-notice-status">Completed</span>' },
            href: constants.routes.DEVELOPER_CHECK_PLANNING_DECISION_NOTICE_FILE,
            id: 'planning-decision-notice'
          }
        ]
      })
    })
  })
})
