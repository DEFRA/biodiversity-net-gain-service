import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants'
import Session from '../../../__mocks__/session.js'

const url = constants.routes.REGISTER_LAND_TASK_LIST
const session = new Session()
const testString = '1234'

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

    it('should render view with no completed task', done => {
      jest.isolateModules(async () => {
        try {
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
            dependantIds: [],
            id: null,
            taskTitle: 'Applicant information',
            tasks: [
              {
                title: 'Add details about the applicant',
                status: 'NOT STARTED',
                url: '/land/agent-acting-for-client',
                id: 'add-applicant-information'
              }
            ]
          })
          expect(contextResult.registrationTasks.taskList[1]).toEqual({
            dependantIds: [],
            id: null,
            taskTitle: 'Land information',
            tasks: [
              {
                title: 'Add land ownership details',
                status: 'NOT STARTED',
                url: '/land/upload-ownership-proof',
                id: 'add-land-ownership'
              },
              {
                title: 'Add biodiversity gain site boundary details',
                status: 'NOT STARTED',
                url: '/land/upload-land-boundary',
                id: 'add-land-boundary'
              },
              {
                title: 'Add habitat baseline, creation and enhancements',
                status: 'NOT STARTED',
                url: '/land/upload-metric',
                id: 'add-habitat-information'
              }
            ]
          })
          expect(contextResult.registrationTasks.taskList[2]).toEqual({
            dependantIds: [],
            id: null,
            taskTitle: 'Legal information',
            tasks: [
              {
                title: 'Add legal agreement details',
                status: 'NOT STARTED',
                url: '/land/legal-agreement-type',
                id: 'add-legal-agreement'
              },
              {
                title: 'Add local land charge search certificate',
                status: 'NOT STARTED',
                url: '/land/upload-local-land-charge',
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

    it('should render view with legal completed task', done => {
      jest.isolateModules(async () => {
        try {
          let viewResult, contextResult
          const h = {
            view: (view, context) => {
              viewResult = view
              contextResult = context
            }
          }

          session.reset()
          session.set(constants.redisKeys.LAND_BOUNDARY_LOCATION, testString)
          session.set(constants.redisKeys.LAND_BOUNDARY_FILE_SIZE, testString)
          session.set(constants.redisKeys.LAND_BOUNDARY_FILE_TYPE, testString)
          session.set(constants.redisKeys.LAND_BOUNDARY_CHECKED, 'yes')
          session.set(constants.redisKeys.LAND_BOUNDARY_GRID_REFERENCE, testString)
          session.set(constants.redisKeys.LAND_BOUNDARY_HECTARES, testString)

          const request = {
            yar: session
          }

          const registerTaskList = require('../../../routes/land/register-land-task-list')
          await registerTaskList.default[0].handler(request, h)

          const response = await submitGetRequest(getOptions)
          expect(response.statusCode).toBe(200)
          expect(viewResult).toEqual('land/register-land-task-list')
          expect(contextResult.registrationTasks.taskList.length).toEqual(4)
          expect(contextResult.registrationTasks.taskList[1]).toEqual({
            dependantIds: [],
            id: null,
            taskTitle: 'Land information',
            tasks: [
              {
                title: 'Add land ownership details',
                status: 'NOT STARTED',
                url: '/land/upload-ownership-proof',
                id: 'add-land-ownership'
              },
              {
                title: 'Add biodiversity gain site boundary details',
                status: 'COMPLETED',
                url: '/land/check-land-boundary-details',
                id: 'add-land-boundary'
              },
              {
                title: 'Add habitat baseline, creation and enhancements',
                status: 'NOT STARTED',
                url: '/land/upload-metric',
                id: 'add-habitat-information'
              }
            ]
          })

          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
