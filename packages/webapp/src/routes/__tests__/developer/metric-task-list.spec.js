import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants'
import { getMetricTasks } from '../../../utils/helpers'

const url = constants.routes.DEVELOPER_METRIC_TASK_LIST

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

      const metricTaskList = require('../../../routes/developer/metric-task-list')
      await metricTaskList.default[0].handler(request, h)

      const response = await submitGetRequest(getOptions)
      expect(response.statusCode).toBe(200)
      expect(viewResult).toEqual('developer/metric-task-list')
      expect(contextResult.metricTasks.taskList.length).toEqual(4)
      expect(contextResult.metricTasks.taskList[0]).toEqual({
        isDisplay: true,
        taskTitle: 'Biodiversity 3.1 Metric calculations',
        tasks: [
          {
            title: 'Upload metric calculation',
            status: constants.DEFAULT_METRIC_TASK_STATUS,
            completedTaskUrl: constants.routes.DEVELOPER_UPLOAD_METRIC,
            startTaskUrl: constants.routes.DEVELOPER_UPLOAD_METRIC,
            id: 'upload-metric-calculation'
          },
          {
            title: 'Confirm development details',
            status: constants.DEFAULT_METRIC_TASK_STATUS,
            completedTaskUrl: constants.routes.DEVELOPER_CONFIRM_DEV_DETAILS,
            startTaskUrl: constants.routes.DEVELOPER_CONFIRM_DEV_DETAILS,
            id: 'confirm-development-details'
          }
        ]
      })
      expect(contextResult.metricTasks.taskList[1]).toEqual({
        isDisplay: true,
        taskTitle: 'Your development project',
        tasks: [
          {
            title: 'Upload the land boundary details',
            status: constants.DEFAULT_METRIC_TASK_STATUS,
            completedTaskUrl: '#',
            startTaskUrl: '#',
            id: 'upload-the-land-boundary-details'
          }
        ]
      })
      expect(contextResult.metricTasks.taskList[2]).toEqual({
        isDisplay: true,
        taskTitle: 'Biodiversity Payment',
        tasks: [
          {
            title: 'Confirm any Biodiversity Payment you need to make',
            status: constants.DEFAULT_METRIC_TASK_STATUS,
            completedTaskUrl: '#',
            startTaskUrl: '#',
            id: 'confirm-any-biodiversity-payment-you-need-to-make'
          }
        ]
      })
      expect(contextResult.metricTasks.taskList[3]).toEqual({
        isDisplay: true,
        taskTitle: 'Submit your biodiversity gain information',
        tasks: [
          {
            title: 'Check your answers before you submit them to us',
            status: constants.DEFAULT_METRIC_TASK_STATUS,
            completedTaskUrl: '#',
            startTaskUrl: '#',
            id: 'check-your-answers-before-you-submit-them-to-us'
          }
        ]
      })
    })

    it('should render view with Biodiversity 3.1 Metric calculations completed task', async () => {
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
      const metricTasks = getMetricTasks(request)
      metricTasks.taskList.forEach(task => {
        if (task.taskTitle === 'Biodiversity 3.1 Metric calculations') {
          task.tasks[0].status = constants.COMPLETE_METRIC_TASK_STATUS
          task.tasks[1].status = constants.COMPLETE_METRIC_TASK_STATUS
        }
      })
      redisMap.set(constants.redisKeys.METRIC_TASK_DETAILS, metricTasks)
      const metricTaskList = require('../../../routes/developer/metric-task-list')
      await metricTaskList.default[0].handler(request, h)

      const response = await submitGetRequest(getOptions)
      expect(response.statusCode).toBe(200)
      expect(viewResult).toEqual('developer/metric-task-list')
      expect(contextResult.metricTasks.taskList.length).toEqual(4)
      expect(contextResult.metricTasks.taskList[0]).toEqual({
        taskTitle: 'Biodiversity 3.1 Metric calculations',
        tasks: [
          {
            title: 'Upload metric calculation',
            status: constants.COMPLETE_METRIC_TASK_STATUS,
            completedTaskUrl: constants.routes.DEVELOPER_UPLOAD_METRIC,
            startTaskUrl: constants.routes.DEVELOPER_UPLOAD_METRIC,
            id: 'upload-metric-calculation'
          },
          {
            title: 'Confirm development details',
            status: constants.COMPLETE_METRIC_TASK_STATUS,
            completedTaskUrl: constants.routes.DEVELOPER_CONFIRM_DEV_DETAILS,
            startTaskUrl: constants.routes.DEVELOPER_CONFIRM_DEV_DETAILS,
            id: 'confirm-development-details'
          }
        ],
        isDisplay: true
      })
      expect(contextResult.metricTasks.taskList[1]).toEqual({
        taskTitle: 'Your development project',
        tasks: [
          {
            title: 'Upload the land boundary details',
            status: constants.DEFAULT_METRIC_TASK_STATUS,
            completedTaskUrl: '#',
            startTaskUrl: '#',
            id: 'upload-the-land-boundary-details'
          }
        ],
        isDisplay: true
      })
      expect(contextResult.metricTasks.taskList[2]).toEqual({
        taskTitle: 'Biodiversity Payment',
        tasks: [
          {
            title: 'Confirm any Biodiversity Payment you need to make',
            status: constants.DEFAULT_METRIC_TASK_STATUS,
            completedTaskUrl: '#',
            startTaskUrl: '#',
            id: 'confirm-any-biodiversity-payment-you-need-to-make'
          }
        ],
        isDisplay: true
      })
      expect(contextResult.metricTasks.taskList[3]).toEqual({
        taskTitle: 'Submit your biodiversity gain information',
        tasks: [
          {
            title: 'Check your answers before you submit them to us',
            status: constants.DEFAULT_METRIC_TASK_STATUS,
            completedTaskUrl: '#',
            startTaskUrl: '#',
            id: 'check-your-answers-before-you-submit-them-to-us'
          }
        ],
        isDisplay: true
      })
    })

    it('should render view with single completed task', async () => {
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
      const mockMetricTasks = {
        taskList: [{
          taskTitle: 'Biodiversity Payment',
          tasks: [
            {
              title: 'Confirm any Biodiversity Payment you need to make',
              status: constants.COMPLETE_METRIC_TASK_STATUS,
              completedTaskUrl: '#',
              startTaskUrl: '#',
              id: 'confirm-any-biodiversity-payment-you-need-to-make'
            }
          ],
          isDisplay: true
        }]
      }
      redisMap.set(constants.redisKeys.METRIC_TASK_DETAILS, mockMetricTasks)
      const metricTaskList = require('../../../routes/developer/metric-task-list')
      await metricTaskList.default[0].handler(request, h)

      const response = await submitGetRequest(getOptions)
      expect(response.statusCode).toBe(200)
      expect(viewResult).toEqual('developer/metric-task-list')
      expect(contextResult.metricTasks.taskList.length).toEqual(1)
    })

    // TODO: Need to update this test case when on-site task will be displayed
    it.skip('should not show task if on-site net % change value will be 0 for all units', async () => {
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
      const mockMetricData = {
        headlineResult: [{
          task: 'On-site baseline',
          subtask: '',
          habitatUnits: 0,
          hedgerowUnits: 0,
          riverUnits: 0
        },
        {
          task: 'On-site post-intervention',
          subtask: '(Including habitat retention, creation & enhancement)',
          habitatUnits: 0,
          hedgerowUnits: 0,
          riverUnits: 0
        },
        {
          task: 'On-site net % change',
          subtask: '(Including habitat retention, creation & enhancement)',
          habitatUnits: 0,
          hedgerowUnits: 0,
          riverUnits: 0
        }]
      }
      const mockMetricTasks = {
        taskList: [{}, {}, {
          taskTitle: 'On-site Baseline',
          tasks: [
            {
              title: 'Confirm the total amount of on-site gain or loss',
              status: constants.DEFAULT_METRIC_TASK_STATUS,
              completedTaskUrl: '#',
              startTaskUrl: '#',
              id: 'confirm-the-total-amount-of-on-site-gain-or-loss'
            }
          ],
          isDisplay: true
        }]
      }
      redisMap.set(constants.redisKeys.METRIC_TASK_DETAILS, mockMetricTasks)
      redisMap.set(constants.redisKeys.DEVELOPER_METRIC_DATA, mockMetricData)
      const metricTaskList = require('../../../routes/developer/metric-task-list')
      await metricTaskList.default[0].handler(request, h)

      const response = await submitGetRequest(getOptions)
      expect(response.statusCode).toBe(200)
      expect(viewResult).toEqual('developer/metric-task-list')
      expect(contextResult.metricTasks.taskList.length).toEqual(3)
    })
  })
})
