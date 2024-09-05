import Session from '../../__mocks__/session.js'
import constants from '../../utils/constants.js'
import { getTaskList } from '../task-list-generator.js'
const testString = '1234'
const session = new Session()

const statusForDisplay = status => status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()

const initialTaskInfo = {
  canSubmit: false,
  completedTasks: 0,
  totalTasks: 7,
  taskList: [
    {
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
    },
    {
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
    },
    {
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
    },
    {
      taskTitle: 'Submit your biodiversity gain site information',
      items: [
        {
          title: { text: 'Check your answers and submit information' },
          status: {
            tag: {
              html: '<span id="check-your-answers-status">Cannot start yet</span>',
              classes: 'govuk-tag--grey'
            }
          },
          id: 'check-your-answers'
        }
      ]
    }
  ]
}

describe('journey validation task list', () => {
  it('Empty session should generate initial task list for registation journey', done => {
    jest.isolateModules(async () => {
      try {
        const taskInfo = getTaskList(constants.applicationTypes.REGISTRATION, session)
        expect(taskInfo).toMatchObject(initialTaskInfo)
        done()
      } catch (err) {
        done(err)
      }
    })
  })

  it('Session data for task should show status as IN PROGRESS', done => {
    jest.isolateModules(async () => {
      try {
        session.reset()
        session.set(constants.redisKeys.LAND_BOUNDARY_LOCATION, testString)
        session.set(constants.redisKeys.LAND_BOUNDARY_FILE_SIZE, testString)
        session.set(constants.redisKeys.LAND_BOUNDARY_FILE_TYPE, testString)
        session.set(constants.redisKeys.LAND_BOUNDARY_CHECKED, 'yes')

        const taskInfo = getTaskList(constants.applicationTypes.REGISTRATION, session)
        expect(taskInfo.taskList[1].items[1].status.tag.html).toContain(statusForDisplay(constants.IN_PROGRESS_REGISTRATION_TASK_STATUS))

        done()
      } catch (err) {
        done(err)
      }
    })
  })

  it('All session data for task should show status as COMPLETE', done => {
    jest.isolateModules(async () => {
      try {
        session.reset()
        session.set(constants.redisKeys.LAND_BOUNDARY_LOCATION, testString)
        session.set(constants.redisKeys.LAND_BOUNDARY_FILE_SIZE, testString)
        session.set(constants.redisKeys.LAND_BOUNDARY_FILE_TYPE, testString)
        session.set(constants.redisKeys.LAND_BOUNDARY_CHECKED, 'yes')
        session.set(constants.redisKeys.LAND_BOUNDARY_GRID_REFERENCE, testString)
        session.set(constants.redisKeys.LAND_BOUNDARY_HECTARES, testString)

        const taskInfo = getTaskList(constants.applicationTypes.REGISTRATION, session)
        expect(taskInfo.taskList[1].items[1].status.html).toContain(statusForDisplay(constants.COMPLETE_REGISTRATION_TASK_STATUS))

        done()
      } catch (err) {
        done(err)
      }
    })
  })
})
