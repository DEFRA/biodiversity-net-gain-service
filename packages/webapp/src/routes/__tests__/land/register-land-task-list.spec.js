import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants'
import { getRegistrationTasks } from '../../../utils/helpers'

const url = constants.routes.REGISTER_LAND_TASK_LIST

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

      const registerTaskList = require('../../../routes/land/register-land-task-list')
      await registerTaskList.default[0].handler(request, h)

      const response = await submitGetRequest(getOptions)
      expect(response.statusCode).toBe(200)
      expect(viewResult).toEqual('land/register-land-task-list')
      expect(contextResult.registrationTasks.taskList.length).toEqual(5)
      expect(contextResult.registrationTasks.taskList[0]).toEqual({
        taskTitle: 'Your details',
        tasks: [
          {
            title: 'Add your details',
            status: 'NOT STARTED',
            completedTaskUrl: '/land/check-your-details',
            startTaskUrl: '/land/name',
            id: 'add-your-details'
          }
        ]
      })
      expect(contextResult.registrationTasks.taskList[1]).toEqual({
        taskTitle: 'Land information',
        tasks: [
          {
            title: 'Add land boundary details',
            status: 'NOT STARTED',
            completedTaskUrl: '/land/check-land-boundary-details',
            startTaskUrl: '/land/upload-land-boundary',
            id: 'add-land-boundary'
          },
          {
            title: 'Add land ownership details',
            status: 'NOT STARTED',
            completedTaskUrl: '/land/check-ownership-details',
            startTaskUrl: '/land/upload-ownership-proof',
            id: 'add-land-ownership'
          }
        ]
      })
      expect(contextResult.registrationTasks.taskList[2]).toEqual({
        taskTitle: 'Habitat information',
        tasks: [
          {
            title: 'Upload Biodiversity Metric 3.1',
            status: 'NOT STARTED',
            completedTaskUrl: '/land/check-metric-file',
            startTaskUrl: '/land/upload-metric',
            id: 'add-habitat-information'
          },
          {
            title: 'Add habitat management and monitoring details',
            status: 'NOT STARTED',
            completedTaskUrl: '/land/check-management-monitoring-details',
            startTaskUrl: '/land/upload-management-plan',
            id: 'add-habitat-management'
          }
        ]
      })
      expect(contextResult.registrationTasks.taskList[3]).toEqual({
        taskTitle: 'Legal information',
        tasks: [
          {
            title: 'Add legal agreement details',
            status: 'NOT STARTED',
            completedTaskUrl: '/land/check-legal-agreement-details',
            startTaskUrl: '/land/legal-agreement-type',
            id: 'add-legal-boundary'
          }
        ]
      })
    })

    it('should render view with legal completed task', async () => {
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
      const registrationTasks = getRegistrationTasks(request)
      registrationTasks.taskList.forEach(task => {
        if (task.taskTitle === 'Legal information') {
          task.tasks[0].status = 'COMPLETED'
        }
        if (task.taskTitle === 'Land information') {
          task.tasks[0].status = 'COMPLETED'
        }
      })
      redisMap.set(constants.redisKeys.REGISTRATION_TASK_DETAILS, registrationTasks)
      const registerTaskList = require('../../../routes/land/register-land-task-list')
      await registerTaskList.default[0].handler(request, h)

      const response = await submitGetRequest(getOptions)
      expect(response.statusCode).toBe(200)
      expect(viewResult).toEqual('land/register-land-task-list')
      expect(contextResult.registrationTasks.taskList.length).toEqual(5)
      expect(contextResult.registrationTasks.taskList[0]).toEqual({
        taskTitle: 'Your details',
        tasks: [
          {
            title: 'Add your details',
            status: 'NOT STARTED',
            completedTaskUrl: '/land/check-your-details',
            startTaskUrl: '/land/name',
            id: 'add-your-details'
          }
        ]
      })
      expect(contextResult.registrationTasks.taskList[1]).toEqual({
        taskTitle: 'Land information',
        tasks: [
          {
            title: 'Add land boundary details',
            status: 'COMPLETED',
            completedTaskUrl: '/land/check-land-boundary-details',
            startTaskUrl: '/land/upload-land-boundary',
            id: 'add-land-boundary'
          },
          {
            title: 'Add land ownership details',
            status: 'NOT STARTED',
            completedTaskUrl: '/land/check-ownership-details',
            startTaskUrl: '/land/upload-ownership-proof',
            id: 'add-land-ownership'
          }
        ]
      })
      expect(contextResult.registrationTasks.taskList[2]).toEqual({
        taskTitle: 'Habitat information',
        tasks: [
          {
            title: 'Upload Biodiversity Metric 3.1',
            status: 'NOT STARTED',
            completedTaskUrl: '/land/check-metric-file',
            startTaskUrl: '/land/upload-metric',
            id: 'add-habitat-information'
          },
          {
            title: 'Add habitat management and monitoring details',
            status: 'NOT STARTED',
            completedTaskUrl: '/land/check-management-monitoring-details',
            startTaskUrl: '/land/upload-management-plan',
            id: 'add-habitat-management'
          }
        ]
      })
      expect(contextResult.registrationTasks.taskList[3]).toEqual({
        taskTitle: 'Legal information',
        tasks: [
          {
            title: 'Add legal agreement details',
            status: 'COMPLETED',
            completedTaskUrl: constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS,
            startTaskUrl: constants.routes.LEGAL_AGREEMENT_TYPE,
            id: 'add-legal-boundary'
          }
        ]
      })
    })
  })
})
