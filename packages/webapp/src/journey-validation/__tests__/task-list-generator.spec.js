import Session from '../../__mocks__/session.js'
import constants from '../../utils/constants.js'
import { getTaskList } from '../task-list-generator.js'
const testString = '1234'
const session = new Session()

const notStartedStatus = { tag: { classes: 'govuk-tag--grey', text: 'Not started' } }
const cannotStartYetStatus = { tag: { classes: 'govuk-tag--grey', text: 'Cannot start yet' } }

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
          title: { text: 'Add details about the applicant' },
          status: notStartedStatus,
          href: '/land/agent-acting-for-client',
          id: 'add-applicant-information'
        }
      ]
    },
    {
      taskTitle: 'Land information',
      items: [
        {
          title: { text: 'Add land ownership details' },
          status: notStartedStatus,
          href: '/land/upload-ownership-proof',
          id: 'add-land-ownership'
        },
        {
          title: { text: 'Add biodiversity gain site boundary details' },
          status: notStartedStatus,
          href: '/land/upload-land-boundary',
          id: 'add-land-boundary'
        },
        {
          title: { text: 'Add habitat baseline, creation and enhancements' },
          status: notStartedStatus,
          href: '/land/upload-metric',
          id: 'add-habitat-information'
        }
      ]
    },
    {
      taskTitle: 'Legal information',
      items: [
        {
          title: { text: 'Add legal agreement details' },
          status: notStartedStatus,
          href: '/land/legal-agreement-type',
          id: 'add-legal-agreement'
        },
        {
          title: { text: 'Add local land charge search certificate' },
          status: notStartedStatus,
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
          status: cannotStartYetStatus,
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
        expect(taskInfo.taskList[1].items[1].status.tag.text).toBe(statusForDisplay(constants.IN_PROGRESS_REGISTRATION_TASK_STATUS))

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
        expect(taskInfo.taskList[1].items[1].status.text).toBe(statusForDisplay(constants.COMPLETE_REGISTRATION_TASK_STATUS))

        done()
      } catch (err) {
        done(err)
      }
    })
  })
})
