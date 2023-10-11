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

      const registerTaskList = require('../../../routes/land/register-land-task-list')
      await registerTaskList.default[0].handler(request, h)

      const response = await submitGetRequest(getOptions)
      expect(response.statusCode).toBe(200)
      expect(viewResult).toEqual('land/register-land-task-list')
      expect(contextResult.registrationTasks.taskList.length).toEqual(4)
      expect(contextResult.registrationTasks.taskList[0]).toEqual({
        taskTitle: 'Land information',
        tasks: [
          {
            title: 'Add land ownership details',
            status: 'NOT STARTED',
            completedTaskUrl: '/land/check-ownership-details',
            startTaskUrl: '/land/upload-ownership-proof',
            inProgressUrl: '',
            id: 'add-land-ownership'
          },
          {
            title: 'Add biodiversity gain site boundary details',
            status: 'NOT STARTED',
            completedTaskUrl: '/land/check-land-boundary-details',
            startTaskUrl: '/land/choose-land-boundary-upload',
            inProgressUrl: '',
            id: 'add-land-boundary'
          }
        ]
      })
      expect(contextResult.registrationTasks.taskList[1]).toEqual({
        taskTitle: 'Habitat information',
        tasks: [
          {
            title: 'Add habitat baseline, creation and enhancements',
            status: 'NOT STARTED',
            completedTaskUrl: '/land/check-metric-details',
            startTaskUrl: '/land/upload-metric',
            inProgressUrl: '',
            id: 'add-habitat-information'
          },
          {
            title: 'Add habitat management and monitoring details',
            status: 'NOT STARTED',
            completedTaskUrl: '/land/check-management-monitoring-details',
            startTaskUrl: '/land/upload-management-plan',
            inProgressUrl: '',
            id: 'add-habitat-management'
          }
        ]
      })
      expect(contextResult.registrationTasks.taskList[2]).toEqual({
        taskTitle: 'Legal information',
        tasks: [
          {
            title: 'Add legal agreement details',
            status: 'NOT STARTED',
            completedTaskUrl: '/land/check-legal-agreement-details',
            startTaskUrl: '/land/legal-agreement-type',
            inProgressUrl: '',
            id: 'add-legal-agreement'
          },
          {
            title: 'Add local land charge search certificate',
            status: 'NOT STARTED',
            completedTaskUrl: '/land/check-local-land-charge-file',
            startTaskUrl: '/land/upload-local-land-charge',
            inProgressUrl: '',
            id: 'add-local-land-charge-search-certificate'
          }
        ]
      })
    })

    it('should render view with no completed task if geospatial enabled', async () => {
      let viewResult, contextResult
      process.env.ENABLE_ROUTE_SUPPORT_FOR_GEOSPATIAL = 'Y'
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
      expect(contextResult.registrationTasks.taskList.length).toEqual(4)
      expect(contextResult.registrationTasks.taskList[0]).toEqual({
        taskTitle: 'Land information',
        tasks: [
          {
            title: 'Add land ownership details',
            status: 'NOT STARTED',
            completedTaskUrl: '/land/check-ownership-details',
            startTaskUrl: '/land/upload-ownership-proof',
            inProgressUrl: '',
            id: 'add-land-ownership'
          },
          {
            title: 'Add biodiversity gain site boundary details',
            status: 'NOT STARTED',
            completedTaskUrl: '/land/check-land-boundary-details',
            startTaskUrl: '/land/choose-land-boundary-upload',
            inProgressUrl: '',
            id: 'add-land-boundary'
          }
        ]
      })
      expect(contextResult.registrationTasks.taskList[1]).toEqual({
        taskTitle: 'Habitat information',
        tasks: [
          {
            title: 'Add habitat baseline, creation and enhancements',
            status: 'NOT STARTED',
            completedTaskUrl: '/land/check-metric-details',
            startTaskUrl: '/land/upload-metric',
            inProgressUrl: '',
            id: 'add-habitat-information'
          },
          {
            title: 'Add habitat management and monitoring details',
            status: 'NOT STARTED',
            completedTaskUrl: '/land/check-management-monitoring-details',
            startTaskUrl: '/land/upload-management-plan',
            inProgressUrl: '',
            id: 'add-habitat-management'
          }
        ]
      })
      expect(contextResult.registrationTasks.taskList[2]).toEqual({
        taskTitle: 'Legal information',
        tasks: [
          {
            title: 'Add legal agreement details',
            status: 'NOT STARTED',
            completedTaskUrl: '/land/check-legal-agreement-details',
            startTaskUrl: '/land/legal-agreement-type',
            inProgressUrl: '',
            id: 'add-legal-agreement'
          },
          {
            title: 'Add local land charge search certificate',
            status: 'NOT STARTED',
            completedTaskUrl: '/land/check-local-land-charge-file',
            startTaskUrl: '/land/upload-local-land-charge',
            inProgressUrl: '',
            id: 'add-local-land-charge-search-certificate'
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
      expect(contextResult.registrationTasks.taskList.length).toEqual(4)
      expect(contextResult.registrationTasks.taskList[0]).toEqual({
        taskTitle: 'Land information',
        tasks: [
          {
            title: 'Add land ownership details',
            status: 'COMPLETED',
            completedTaskUrl: '/land/check-ownership-details',
            startTaskUrl: '/land/upload-ownership-proof',
            inProgressUrl: '',
            id: 'add-land-ownership'
          },
          {
            title: 'Add biodiversity gain site boundary details',
            status: 'NOT STARTED',
            completedTaskUrl: '/land/check-land-boundary-details',
            startTaskUrl: '/land/choose-land-boundary-upload',
            inProgressUrl: '',
            id: 'add-land-boundary'
          }
        ]
      })
      expect(contextResult.registrationTasks.taskList[1]).toEqual({
        taskTitle: 'Habitat information',
        tasks: [
          {
            title: 'Add habitat baseline, creation and enhancements',
            status: 'NOT STARTED',
            completedTaskUrl: '/land/check-metric-details',
            startTaskUrl: '/land/upload-metric',
            inProgressUrl: '',
            id: 'add-habitat-information'
          },
          {
            title: 'Add habitat management and monitoring details',
            status: 'NOT STARTED',
            completedTaskUrl: '/land/check-management-monitoring-details',
            startTaskUrl: '/land/upload-management-plan',
            inProgressUrl: '',
            id: 'add-habitat-management'
          }
        ]
      })
      expect(contextResult.registrationTasks.taskList[2]).toEqual({
        taskTitle: 'Legal information',
        tasks: [
          {
            title: 'Add legal agreement details',
            status: 'COMPLETED',
            completedTaskUrl: constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS,
            startTaskUrl: constants.routes.LEGAL_AGREEMENT_TYPE,
            inProgressUrl: '',
            id: 'add-legal-agreement'
          },
          {
            title: 'Add local land charge search certificate',
            status: 'NOT STARTED',
            completedTaskUrl: '/land/check-local-land-charge-file',
            startTaskUrl: '/land/upload-local-land-charge',
            inProgressUrl: '',
            id: 'add-local-land-charge-search-certificate'
          }
        ]
      })
    })
  })
})
