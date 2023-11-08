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

    it('should render view with no completed task: ENV ENABLE_ROUTE_SUPPORT_FOR_GEOSPATIAL = N', done => {
      jest.isolateModules(async () => {
        try {
          process.env.ENABLE_ROUTE_SUPPORT_FOR_GEOSPATIAL = 'N'
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
          // TODO: remove skip and test should pass after all routes are developed
          // expect(contextResult.registrationTasks.taskList[0]).toEqual({
          //   taskTitle: 'Applicant information',
          //   tasks: [
          //     {
          //       title: 'Add details about the applicant',
          //       status: 'NOT STARTED',
          //       completedTaskUrl: '/land/check-ownership-details',
          //       startTaskUrl: '/land/applicant-details-is-agent',
          //       inProgressUrl: '',
          //       id: 'add-applicant-details-is-agent'
          //     }
          //   ]
          // })
          expect(contextResult.registrationTasks.taskList[1]).toEqual({
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
                startTaskUrl: '/land/upload-land-boundary',
                inProgressUrl: '',
                id: 'add-land-boundary'
              }
            ]
          })
          expect(contextResult.registrationTasks.taskList[2]).toEqual({
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
          expect(contextResult.registrationTasks.taskList[3]).toEqual({
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
          done()
        } catch (err) {
          done(err)
        }
      })
    })

    it('should render view with no completed task: ENV ENABLE_ROUTE_SUPPORT_FOR_GEOSPATIAL = null', done => {
      jest.isolateModules(async () => {
        try {
          process.env.ENABLE_ROUTE_SUPPORT_FOR_GEOSPATIAL = null
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
          expect(contextResult.registrationTasks.taskList[1]).toEqual({
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
                startTaskUrl: '/land/upload-land-boundary',
                inProgressUrl: '',
                id: 'add-land-boundary'
              }
            ]
          })
          expect(contextResult.registrationTasks.taskList[2]).toEqual({
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
          expect(contextResult.registrationTasks.taskList[3]).toEqual({
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
          done()
        } catch (err) {
          done(err)
        }
      })
    })

    it('should render view with no completed task if geospatial enabled', done => {
      jest.isolateModules(async () => {
        try {
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
          expect(contextResult.registrationTasks.taskList.length).toEqual(5)
          expect(contextResult.registrationTasks.taskList[1]).toEqual({
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
          expect(contextResult.registrationTasks.taskList[2]).toEqual({
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
          expect(contextResult.registrationTasks.taskList[3]).toEqual({
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
          done()
        } catch (err) {
          done(err)
        }
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
      expect(contextResult.registrationTasks.taskList[1]).toEqual({
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
      expect(contextResult.registrationTasks.taskList[2]).toEqual({
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
      expect(contextResult.registrationTasks.taskList[3]).toEqual({
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
    it('should render view with Add land ownership details task in progress after associated functionality is accessed', done => {
      jest.isolateModules(async () => {
        try {
          await checkExpectedTaskStatus('upload-ownership-proof', 'IN PROGRESS', 'Add land ownership details')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })
    it('should render view with Add biodiversity gain site boundary details task in progress after associated functionality is accessed when ENV ENABLE_ROUTE_SUPPORT_FOR_GEOSPATIAL = null', done => {
      jest.isolateModules(async () => {
        try {
          await checkExpectedTaskStatus('upload-land-boundary', 'IN PROGRESS', 'Add biodiversity gain site boundary details')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })
    it('should render view with Add biodiversity gain site boundary details task in progress after associated functionality is accessed when ENV ENABLE_ROUTE_SUPPORT_FOR_GEOSPATIAL = Y', done => {
      jest.isolateModules(async () => {
        try {
          process.env.ENABLE_ROUTE_SUPPORT_FOR_GEOSPATIAL = 'Y'
          await checkExpectedTaskStatus('upload-land-boundary', 'IN PROGRESS', 'Add biodiversity gain site boundary details')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })
    it('should render view with Add habitat baseline, creation and enhancements task in progress after associated functionality is accessed', done => {
      jest.isolateModules(async () => {
        try {
          await checkExpectedTaskStatus('upload-metric', 'IN PROGRESS', 'Add habitat baseline, creation and enhancements')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })
    it('should render view with Add habitat management and monitoring details task in progress after associated functionality is accessed', done => {
      jest.isolateModules(async () => {
        try {
          await checkExpectedTaskStatus('upload-management-plan', 'IN PROGRESS', 'Add habitat management and monitoring details')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })
    it('should render view with Add legal agreement details task in progress after associated functionality is accessed', done => {
      jest.isolateModules(async () => {
        try {
          await checkExpectedTaskStatus('legal-agreement-type', 'IN PROGRESS', 'Add legal agreement details')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })
    it('should render view with Add local land charge search certificate task in progress after associated functionality is accessed', done => {
      jest.isolateModules(async () => {
        try {
          await checkExpectedTaskStatus('upload-local-land-charge', 'IN PROGRESS', 'Add local land charge search certificate')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })
  })
})

const checkExpectedTaskStatus = async (routeName, expectedStatus, expectedTaskTitle) => {
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

  const route = require(`../../../routes/land/${routeName}`)
  const registerTaskList = require('../../../routes/land/register-land-task-list')
  await route.default[0].handler(request, h)
  await registerTaskList.default[0].handler(request, h)
  const inProgressTasks = contextResult.registrationTasks.taskList.flatMap(item => item.tasks).filter(task => task.status === expectedStatus)
  expect(viewResult).toEqual(constants.views.REGISTER_LAND_TASK_LIST)
  expect(inProgressTasks.length).toBe(1)
  expect(inProgressTasks[0].title).toBe(expectedTaskTitle)
}
