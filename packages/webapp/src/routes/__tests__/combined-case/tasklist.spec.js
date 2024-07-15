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
      expect(contextResult.tasks.taskList.length).toEqual(2)
      expect(contextResult.tasks.taskList[0]).toEqual({
        taskTitle: 'Applicant information',
        tasks: [
          {
            id: 'add-applicant-information',
            title: 'Add details about the applicant',
            status: 'NOT STARTED',
            url: '/land/agent-acting-for-client'
          }
        ]
      })
      expect(contextResult.tasks.taskList[1]).toEqual({
        taskTitle: 'Submit your biodiversity gain information',
        tasks: [
          {
            id: 'check-your-answers',
            status: 'CANNOT START YET',
            title: 'Check your answers before you submit them',
            url: '/combined-case/check-and-submit'
          }
        ]
      })
    })
  })
})
