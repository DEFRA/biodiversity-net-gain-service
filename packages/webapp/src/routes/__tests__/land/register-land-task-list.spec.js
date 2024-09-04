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
          expect(contextResult.tasks.taskList.length).toEqual(4)
          expect(contextResult.tasks.taskList[0]).toEqual({
            dependantIds: [],
            id: null,
            taskTitle: 'Applicant information',
            items: [
              {
                title: { html: "<span id='add-applicant-information'>Add details about the applicant</span>" },
                status: {
                  tag: {
                    html: '<span id="add-applicant-information-status">Not started</span>',
                    classes: 'govuk-tag--grey'
                  }
                },
                href: '/land/agent-acting-for-client',
                id: 'add-applicant-information'
              }
            ]
          })
          expect(contextResult.tasks.taskList[1]).toEqual({
            dependantIds: [],
            id: null,
            taskTitle: 'Land information',
            items: [
              {
                title: { html: "<span id='add-land-ownership'>Add land ownership details</span>" },
                status: {
                  tag: {
                    html: '<span id="add-land-ownership-status">Not started</span>',
                    classes: 'govuk-tag--grey'
                  }
                },
                href: '/land/upload-ownership-proof',
                id: 'add-land-ownership'
              },
              {
                title: { html: "<span id='add-land-boundary'>Add biodiversity gain site boundary details</span>" },
                status: {
                  tag: {
                    html: '<span id="add-land-boundary-status">Not started</span>',
                    classes: 'govuk-tag--grey'
                  }
                },
                href: '/land/upload-land-boundary',
                id: 'add-land-boundary'
              },
              {
                title: { html: "<span id='add-habitat-information'>Add habitat baseline, creation and enhancements</span>" },
                status: {
                  tag: {
                    html: '<span id="add-habitat-information-status">Not started</span>',
                    classes: 'govuk-tag--grey'
                  }
                },
                href: '/land/upload-metric',
                id: 'add-habitat-information'
              }
            ]
          })
          expect(contextResult.tasks.taskList[2]).toEqual({
            dependantIds: [],
            id: null,
            taskTitle: 'Legal information',
            items: [
              {
                title: { html: "<span id='add-legal-agreement'>Add legal agreement details</span>" },
                status: {
                  tag: {
                    html: '<span id="add-legal-agreement-status">Not started</span>',
                    classes: 'govuk-tag--grey'
                  }
                },
                href: '/land/legal-agreement-type',
                id: 'add-legal-agreement'
              },
              {
                title: { html: "<span id='add-local-land-charge-search-certificate'>Add local land charge search certificate</span>" },
                status: {
                  tag: {
                    html: '<span id="add-local-land-charge-search-certificate-status">Not started</span>',
                    classes: 'govuk-tag--grey'
                  }
                },
                href: '/land/upload-local-land-charge',
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
          process.env.ENABLE_ROUTE_SUPPORT_FOR_GEOSPATIAL = 'N'
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
          expect(contextResult.tasks.taskList.length).toEqual(4)
          expect(contextResult.tasks.taskList[1]).toEqual({
            dependantIds: [],
            id: null,
            taskTitle: 'Land information',
            items: [
              {
                title: { html: "<span id='add-land-ownership'>Add land ownership details</span>" },
                status: {
                  tag: {
                    html: '<span id="add-land-ownership-status">Not started</span>',
                    classes: 'govuk-tag--grey'
                  }
                },
                href: '/land/upload-ownership-proof',
                id: 'add-land-ownership'
              },
              {
                title: { html: "<span id='add-land-boundary'>Add biodiversity gain site boundary details</span>" },
                status: { html: '<span id="add-land-boundary-status">Completed</span>' },
                href: '/land/check-land-boundary-details',
                id: 'add-land-boundary'
              },
              {
                title: { html: "<span id='add-habitat-information'>Add habitat baseline, creation and enhancements</span>" },
                status: {
                  tag: {
                    html: '<span id="add-habitat-information-status">Not started</span>',
                    classes: 'govuk-tag--grey'
                  }
                },
                href: '/land/upload-metric',
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
