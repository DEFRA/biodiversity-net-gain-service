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

      const developerTaskList = require('../../../routes/developer/tasklist')
      await developerTaskList.default[0].handler(request, h)

      const response = await submitGetRequest(getOptions)
      expect(response.statusCode).toBe(200)
      expect(viewResult).toEqual('developer/tasklist')
      expect(contextResult.developerTasks.taskList.length).toEqual(4)
      expect(contextResult.developerTasks.taskList[0]).toEqual({
        taskTitle: 'Your details',
        tasks: [
          {
            title: 'Add your details',
            status: constants.DEFAULT_DEVELOPER_TASK_STATUS,
            completedTaskUrl: '/developer/details-confirm',
            startTaskUrl: '/developer/details-name',
            inProgressUrl: '',
            id: 'add-your-details'
          }
        ]
      })
      expect(contextResult.developerTasks.taskList[1]).toEqual({
        taskTitle: 'Biodiversity 4.0 Metric calculations',
        tasks: [
          {
            title: 'Upload Metric 4.0 file',
            status: constants.DEFAULT_DEVELOPER_TASK_STATUS,
            completedTaskUrl: '/developer/upload-metric-file',
            startTaskUrl: '/developer/upload-metric-file',
            inProgressUrl: '/developer/upload-metric-file',
            id: 'upload-metric-file'
          },
          {
            title: 'Confirm development details',
            status: constants.DEFAULT_DEVELOPER_TASK_STATUS,
            completedTaskUrl: '',
            startTaskUrl: '',
            inProgressUrl: '',
            id: 'confirm-development-details'
          },
          {
            title: 'Confirm off-site gain',
            status: constants.DEFAULT_DEVELOPER_TASK_STATUS,
            completedTaskUrl: '',
            startTaskUrl: '',
            inProgressUrl: '',
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
            completedTaskUrl: '',
            startTaskUrl: '',
            inProgressUrl: '',
            id: 'upload-consent-document'
          }
        ]
      })
      expect(contextResult.developerTasks.taskList[3]).toEqual({
        taskTitle: 'Submit your biodiversity gain information',
        tasks: [
          {
            title: 'Check your answers before you submit them to us',
            status: constants.DEFAULT_DEVELOPER_TASK_STATUS,
            completedTaskUrl: '',
            startTaskUrl: '',
            inProgressUrl: '',
            id: 'check-your-answer'
          }
        ]
      })
    })

    it('should render view with Biodiversity 4.0 Metric calculations completed task', async () => {
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
        if (task.taskTitle === 'Biodiversity 4.0 Metric calculations') {
          task.tasks[0].status = 'COMPLETED'
        }
        if (task.taskTitle === 'Biodiversity 4.0 Metric calculations') {
          task.tasks[1].status = 'COMPLETED'
        }
        if (task.taskTitle === 'Biodiversity 4.0 Metric calculations') {
          task.tasks[2].status = 'COMPLETED'
        }
      })
      redisMap.set(constants.redisKeys.DEVELOPER_TASK_DETAILS, developerTasks)
      const developerTaskList = require('../../../routes/developer/tasklist')
      await developerTaskList.default[0].handler(request, h)

      const response = await submitGetRequest(getOptions)
      expect(response.statusCode).toBe(200)
      expect(viewResult).toEqual('developer/tasklist')
      expect(contextResult.developerTasks.taskList.length).toEqual(4)
      expect(contextResult.developerTasks.taskList[0]).toEqual({
        taskTitle: 'Your details',
        tasks: [
          {
            title: 'Add your details',
            status: constants.DEFAULT_DEVELOPER_TASK_STATUS,
            completedTaskUrl: constants.routes.DEVELOPER_DETAILS_CONFIRM,
            startTaskUrl: constants.routes.DEVELOPER_DETAILS_NAME,
            inProgressUrl: '',
            id: 'add-your-details'
          }
        ]
      })
      expect(contextResult.developerTasks.taskList[1]).toEqual({
        taskTitle: 'Biodiversity 4.0 Metric calculations',
        tasks: [
          {
            title: 'Upload Metric 4.0 file',
            status: constants.COMPLETE_DEVELOPER_TASK_STATUS,
            completedTaskUrl: '/developer/upload-metric-file',
            startTaskUrl: '/developer/upload-metric-file',
            inProgressUrl: '/developer/upload-metric-file',
            id: 'upload-metric-file'
          },
          {
            title: 'Confirm development details',
            status: constants.COMPLETE_DEVELOPER_TASK_STATUS,
            completedTaskUrl: '',
            startTaskUrl: '',
            inProgressUrl: '',
            id: 'confirm-development-details'
          },
          {
            title: 'Confirm off-site gain',
            status: constants.COMPLETE_DEVELOPER_TASK_STATUS,
            completedTaskUrl: '',
            startTaskUrl: '',
            inProgressUrl: '',
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
            completedTaskUrl: '',
            startTaskUrl: '',
            inProgressUrl: '',
            id: 'upload-consent-document'
          }
        ]
      })
      expect(contextResult.developerTasks.taskList[3]).toEqual({
        taskTitle: 'Submit your biodiversity gain information',
        tasks: [
          {
            title: 'Check your answers before you submit them to us',
            status: constants.DEFAULT_DEVELOPER_TASK_STATUS,
            completedTaskUrl: '',
            startTaskUrl: '',
            inProgressUrl: '',
            id: 'check-your-answer'
          }
        ]
      })
    })
  })
})
