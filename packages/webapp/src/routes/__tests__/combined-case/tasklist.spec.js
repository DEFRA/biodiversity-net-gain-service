import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.COMBINED_CASE_TASK_LIST

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
        tasks: [
          {
            id: 'add-applicant-information',
            title: 'Add details about the applicant',
            status: 'NOT STARTED',
            url: '/combined-case/agent-acting-for-client'
          }
        ]
      })
      expect(contextResult.tasks.taskList[1]).toEqual({
        taskTitle: 'Land information',
        tasks: [
          {
            id: 'add-land-ownership',
            title: 'Add land ownership details',
            status: 'NOT STARTED',
            url: '/combined-case/upload-ownership-proof'
          },
          {
            id: 'add-land-boundary',
            title: 'Add biodiversity gain site boundary details',
            status: 'NOT STARTED',
            url: '/combined-case/upload-land-boundary'
          },
          {
            id: 'add-habitat-information',
            title: 'Add habitat baseline, creation and enhancements',
            status: 'NOT STARTED',
            url: '/combined-case/upload-metric'
          }
        ]
      })
      expect(contextResult.tasks.taskList[2]).toEqual({
        taskTitle: 'Legal information',
        tasks: [
          {
            id: 'add-legal-agreement',
            title: 'Add legal agreement details',
            status: 'NOT STARTED',
            url: '/combined-case/legal-agreement-type'
          },
          {
            id: 'add-local-land-charge-search-certificate',
            title: 'Add local land charge search certificate',
            status: 'NOT STARTED',
            url: '/combined-case/upload-local-land-charge'
          }
        ]
      })
      expect(contextResult.tasks.taskList[3]).toEqual({
        taskTitle: 'Allocation information',
        tasks: [
          {
            id: 'planning-decision-notice',
            title: 'Add planning decision notice',
            status: 'NOT STARTED',
            url: '/combined-case/upload-planning-decision-notice'
          },
          {
            id: 'match-available-habitats',
            title: 'Match available habitats',
            status: 'NOT STARTED',
            url: '/combined-case/upload-allocation-metric'
          },
          {
            id: 'confirm-dev-and-habitat-details',
            title: 'Confirm development and habitat details',
            status: 'NOT STARTED',
            url: '/combined-case/development-project-information'
          }
        ]
      })
      expect(contextResult.tasks.taskList[4]).toEqual({
        taskTitle: 'Submit your biodiversity gain information',
        tasks: [
          {
            id: 'check-your-answers',
            title: 'Check your answers before you submit them',
            url: '/combined-case/check-and-submit',
            status: 'CANNOT START YET'
          }
        ]
      })
    })
  })
})
