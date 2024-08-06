import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.COMBINED_CASE_TASK_LIST

const notStartedStatus = { tag: { classes: 'govuk-tag--grey', text: 'Not started' } }
const cannotStartYetStatus = { tag: { classes: 'govuk-tag--grey', text: 'Cannot start yet' } }

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

      const creditsPurchaseTasklist = require('../../../routes/combined-case/tasklist')
      await creditsPurchaseTasklist.default[0].handler(request, h)

      const response = await submitGetRequest(getOptions)
      expect(response.statusCode).toBe(200)
      expect(viewResult).toEqual('combined-case/tasklist')
      expect(contextResult.tasks.taskList.length).toEqual(5)
      expect(contextResult.tasks.taskList[0]).toEqual({
        dependantIds: [],
        id: 'cc-app-info',
        taskTitle: 'Applicant information',
        items: [
          {
            id: 'add-applicant-information',
            title: { text: 'Add details about the applicant' },
            status: notStartedStatus,
            href: '/combined-case/agent-acting-for-client'
          }
        ]
      })
      expect(contextResult.tasks.taskList[1]).toEqual({
        dependantIds: [],
        id: 'cc-land-info',
        taskTitle: 'Land information',
        items: [
          {
            id: 'add-land-ownership',
            title: { text: 'Add land ownership details' },
            status: notStartedStatus,
            href: '/combined-case/upload-ownership-proof'
          },
          {
            id: 'add-land-boundary',
            title: { text: 'Add biodiversity gain site boundary details' },
            status: notStartedStatus,
            href: '/combined-case/upload-land-boundary'
          },
          {
            id: 'add-habitat-information',
            title: { text: 'Add habitat baseline, creation and enhancements' },
            status: notStartedStatus,
            href: '/combined-case/upload-metric'
          }
        ]
      })
      expect(contextResult.tasks.taskList[2]).toEqual({
        dependantIds: [],
        id: 'cc-legal-info',
        taskTitle: 'Legal information',
        items: [
          {
            id: 'add-legal-agreement',
            title: { text: 'Add legal agreement details' },
            status: notStartedStatus,
            href: '/combined-case/legal-agreement-type'
          },
          {
            id: 'add-local-land-charge-search-certificate',
            title: { text: 'Add local land charge search certificate' },
            status: notStartedStatus,
            href: '/combined-case/upload-local-land-charge'
          }
        ]
      })
      expect(contextResult.tasks.taskList[3]).toEqual({
        dependantIds: [
          'cc-app-info',
          'cc-land-info',
          'cc-legal-info'
        ],
        id: 'cc-allocation-info',
        taskTitle: 'Allocation information',
        items: [
          {
            id: 'planning-decision-notice',
            title: { text: 'Add planning decision notice' },
            isLocked: true,
            status: cannotStartYetStatus
          },
          {
            id: 'match-available-habitats',
            title: { text: 'Match available habitats' },
            isLocked: true,
            status: cannotStartYetStatus
          },
          {
            id: 'confirm-dev-and-habitat-details',
            title: { text: 'Confirm development and habitat details' },
            isLocked: true,
            status: cannotStartYetStatus
          }
        ]
      })
      expect(contextResult.tasks.taskList[4]).toEqual({
        taskTitle: 'Submit your biodiversity gain information',
        items: [
          {
            id: 'check-your-answers',
            title: { text: 'Check your answers before you submit them' },
            status: cannotStartYetStatus
          }
        ]
      })
    })
  })
})
