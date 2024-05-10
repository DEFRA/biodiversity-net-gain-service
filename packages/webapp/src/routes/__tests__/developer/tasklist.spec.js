import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants'
import { getDeveloperTasks } from '../../../utils/helpers'

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
      expect(viewResult).toEqual('developer/record-gains-task-list')
      expect(contextResult.developerTasks.taskList.length).toEqual(4)
      expect(contextResult.developerTasks.taskList[0]).toEqual({
        taskTitle: 'Your details',
        tasks: [
          {
            title: 'Add your details',
            status: constants.DEFAULT_DEVELOPER_TASK_STATUS,
            completedTaskUrl: constants.routes.DEVELOPER_AGENT_ACTING_FOR_CLIENT,
            startTaskUrl: constants.routes.DEVELOPER_AGENT_ACTING_FOR_CLIENT,
            inProgressUrl: constants.routes.DEVELOPER_AGENT_ACTING_FOR_CLIENT,
            id: 'add-your-details'
          }
        ]
      })
      expect(contextResult.developerTasks.taskList[1]).toEqual({
        taskTitle: 'Biodiversity 4.1 Metric calculations',
        tasks: [
          {
            title: 'Upload Metric 4.1 file',
            status: constants.DEFAULT_DEVELOPER_TASK_STATUS,
            completedTaskUrl: constants.routes.DEVELOPER_BNG_NUMBER,
            startTaskUrl: constants.routes.DEVELOPER_BNG_NUMBER,
            inProgressUrl: constants.routes.DEVELOPER_UPLOAD_METRIC,
            id: 'upload-metric-file'
          },
          {
            title: 'Confirm development details',
            status: constants.DEFAULT_DEVELOPER_TASK_STATUS,
            completedTaskUrl: constants.routes.DEVELOPER_CONFIRM_DEV_DETAILS,
            startTaskUrl: constants.routes.DEVELOPER_CONFIRM_DEV_DETAILS,
            inProgressUrl: constants.routes.DEVELOPER_UPLOAD_METRIC,
            id: 'confirm-development-details'
          },
          {
            title: 'Confirm off-site gain',
            status: constants.DEFAULT_DEVELOPER_TASK_STATUS,
            completedTaskUrl: constants.routes.DEVELOPER_CONFIRM_OFF_SITE_GAIN,
            startTaskUrl: constants.routes.DEVELOPER_CONFIRM_OFF_SITE_GAIN,
            inProgressUrl: constants.routes.DEVELOPER_UPLOAD_METRIC,
            id: 'confirm-off-site-gain'
          }
        ]
      })
      expect(contextResult.developerTasks.taskList[2]).toEqual({
        taskTitle: 'Consent to use a biodiversity gain site for off-site gain',
        tasks: [
          {
            title: 'Upload the consent document',
            status: constants.DEFAULT_DEVELOPER_TASK_STATUS,
            completedTaskUrl: constants.routes.DEVELOPER_CONSENT_AGREEMENT_UPLOAD,
            startTaskUrl: constants.routes.DEVELOPER_CONSENT_AGREEMENT_UPLOAD,
            inProgressUrl: constants.routes.DEVELOPER_CONSENT_AGREEMENT_UPLOAD,
            id: 'upload-consent-document'
          }
        ]
      })
    })

    it('should render view with Consent to use a biodiversity gain site for off-site gain completed task', async () => {
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
      const developerTasks = getDeveloperTasks(request)
      developerTasks.taskList.forEach(task => {
        if (task.taskTitle === 'Consent to use a biodiversity gain site for off-site gain') {
          task.tasks[0].status = 'COMPLETED'
        }
        if (task.taskTitle === 'Biodiversity 4.1 Metric calculations') {
          task.tasks[0].status = 'COMPLETED'
        }
      })
      redisMap.set(constants.redisKeys.DEVELOPER_TASK_DETAILS, developerTasks)
      const developerTasklist = require('../../../routes/developer/tasklist')
      await developerTasklist.default[0].handler(request, h)

      const response = await submitGetRequest(getOptions)
      expect(response.statusCode).toBe(200)
      expect(viewResult).toEqual('developer/record-gains-task-list')
      expect(contextResult.developerTasks.taskList.length).toEqual(4)
      expect(contextResult.developerTasks.taskList[0]).toEqual({
        taskTitle: 'Your details',
        tasks: [
          {
            title: 'Add your details',
            status: constants.DEFAULT_DEVELOPER_TASK_STATUS,
            completedTaskUrl: constants.routes.DEVELOPER_AGENT_ACTING_FOR_CLIENT,
            startTaskUrl: constants.routes.DEVELOPER_AGENT_ACTING_FOR_CLIENT,
            inProgressUrl: constants.routes.DEVELOPER_AGENT_ACTING_FOR_CLIENT,
            id: 'add-your-details'
          }
        ]
      })
      expect(contextResult.developerTasks.taskList[1]).toEqual({
        taskTitle: 'Biodiversity 4.1 Metric calculations',
        tasks: [
          {
            title: 'Upload Metric 4.1 file',
            status: constants.COMPLETE_DEVELOPER_TASK_STATUS,
            completedTaskUrl: constants.routes.DEVELOPER_BNG_NUMBER,
            startTaskUrl: constants.routes.DEVELOPER_BNG_NUMBER,
            inProgressUrl: constants.routes.DEVELOPER_UPLOAD_METRIC,
            id: 'upload-metric-file'
          },
          {
            title: 'Confirm development details',
            status: constants.DEFAULT_DEVELOPER_TASK_STATUS,
            completedTaskUrl: constants.routes.DEVELOPER_CONFIRM_DEV_DETAILS,
            startTaskUrl: constants.routes.DEVELOPER_CONFIRM_DEV_DETAILS,
            inProgressUrl: constants.routes.DEVELOPER_UPLOAD_METRIC,
            id: 'confirm-development-details'
          },
          {
            title: 'Confirm off-site gain',
            status: constants.DEFAULT_DEVELOPER_TASK_STATUS,
            completedTaskUrl: constants.routes.DEVELOPER_CONFIRM_OFF_SITE_GAIN,
            startTaskUrl: constants.routes.DEVELOPER_CONFIRM_OFF_SITE_GAIN,
            inProgressUrl: constants.routes.DEVELOPER_UPLOAD_METRIC,
            id: 'confirm-off-site-gain'
          }
        ]
      })
      expect(contextResult.developerTasks.taskList[2]).toEqual({
        taskTitle: 'Consent to use a biodiversity gain site for off-site gain',
        tasks: [
          {
            title: 'Upload the consent document',
            status: constants.COMPLETE_DEVELOPER_TASK_STATUS,
            completedTaskUrl: constants.routes.DEVELOPER_CONSENT_AGREEMENT_UPLOAD,
            startTaskUrl: constants.routes.DEVELOPER_CONSENT_AGREEMENT_UPLOAD,
            inProgressUrl: constants.routes.DEVELOPER_CONSENT_AGREEMENT_UPLOAD,
            id: 'upload-consent-document'
          }
        ]
      })
    })

    it('should fetch developer tasklist from cache', async () => {
      let viewResult, contextResult
      const h = {
        view: (view, context) => {
          viewResult = view
          contextResult = context
        }
      }
      const developerTasks = {
        taskList: [{
          taskTitle: 'Your details',
          tasks: [
            {
              title: 'Add your details',
              status: constants.DEFAULT_DEVELOPER_TASK_STATUS,
              id: 'add-your-details'
            }
          ]
        }]
      }
      const redisMap = new Map()
      redisMap.set(constants.redisKeys.DEVELOPER_TASK_DETAILS, developerTasks)
      const request = {
        yar: redisMap
      }
      getDeveloperTasks(request)
      const developerTasklist = require('../../../routes/developer/tasklist')
      await developerTasklist.default[0].handler(request, h)

      const response = await submitGetRequest(getOptions)
      expect(response.statusCode).toBe(200)
      expect(viewResult).toEqual('developer/record-gains-task-list')
      expect(contextResult.developerTasks.taskList.length).toEqual(1)
      expect(contextResult.developerTasks).toEqual(developerTasks)
    })
  })
})
