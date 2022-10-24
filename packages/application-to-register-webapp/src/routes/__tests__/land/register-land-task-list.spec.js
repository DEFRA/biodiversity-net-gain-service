import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants'
import { getRegistrationTasks } from '../../../utils/helpers'

const url = '/land/register-land-task-list'

describe(url, () => {
  describe('GET', () => {
    let getOptions
    beforeEach(() => {
      getOptions = {
        url
      }
    })

    it('should render view with legal agreement completed task', async () => {
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
      })
      redisMap.set(constants.redisKeys.REGISTRATION_TASK_DETAILS, registrationTasks)
      const registerTaskList = require('../../../routes/land/register-land-task-list')
      await registerTaskList.default[0].handler(request, h)

      const response = await submitGetRequest(getOptions)
      expect(response.statusCode).toBe(200)
      expect(viewResult).toEqual('land/register-land-task-list')
      expect(contextResult.taskList.length).toEqual(4)
      expect(contextResult.taskList[0]).toEqual({
        taskTitle: 'Your details',
        tasks: [
          {
            title: 'Add your details',
            status: 'NOT STARTED',
            taskUrl: '/land/check-legal-agreement-details'
          }
        ]
      })
      expect(contextResult.taskList[1]).toEqual({
        taskTitle: 'Land information',
        tasks: [
          {
            title: 'Add land boundary details',
            status: 'NOT STARTED',
            taskUrl: '/land/check-legal-agreement-details'
          },
          {
            title: 'Add land ownership details',
            status: 'NOT STARTED',
            taskUrl: '/land/check-legal-agreement-details'
          }
        ]
      })
      expect(contextResult.taskList[2]).toEqual({
        taskTitle: 'Habitat information',
        tasks: [
          {
            title: 'Upload Biodiversity Metric 3.1',
            status: 'NOT STARTED',
            taskUrl: '/land/check-legal-agreement-details'
          },
          {
            title: 'Add habitat management and monitoring details',
            status: 'NOT STARTED',
            taskUrl: '/land/check-legal-agreement-details'
          }
        ]
      })
      expect(contextResult.taskList[3]).toEqual({
        taskTitle: 'Legal information',
        tasks: [
          {
            title: 'Add legal agreement details',
            status: 'COMPLETED',
            taskUrl: '/land/check-legal-agreement-details'
          }
        ]
      })
    })
  })
})
