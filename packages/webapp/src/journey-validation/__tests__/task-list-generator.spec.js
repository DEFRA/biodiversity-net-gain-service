import Session from '../../__mocks__/session.js'
import { getTaskList, generateTaskList } from '../task-list-generator'
import constants from '../../utils/constants.js'

const testString = '1234'
const session = new Session()

const initialTaskInfo = {
  canSubmit: false,
  completedTasks: 0,
  totalTasks: 7,
  taskList: [
    {
      taskTitle: 'Applicant information',
      tasks: [
        {
          title: 'Add details about the applicant',
          status: 'NOT STARTED',
          url: '/land/agent-acting-for-client',
          id: 'add-applicant-information'
        }
      ]
    },
    {
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
    },
    {
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
    },
    {
      taskTitle: 'Submit your biodiversity gain site information',
      tasks: [
        {
          title: 'Check your answers and submit information',
          status: 'CANNOT START YET',
          url: '/land/check-and-submit',
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
        expect(taskInfo.taskList[1].tasks[1].status).toBe(constants.IN_PROGRESS_REGISTRATION_TASK_STATUS)

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
        expect(taskInfo.taskList[1].tasks[1].status).toBe(constants.COMPLETE_REGISTRATION_TASK_STATUS)

        done()
      } catch (err) {
        done(err)
      }
    })
  })
})

describe('generateTaskList', () => {
  beforeAll(() => {
    process.env.USE_MOCK_SERVER = 'true'
    process.env.NODE_ENV = 'test'
  })

  it('should lock tasks if dependent tasks are not complete', () => {
    const taskSections = [
      {
        id: 1,
        title: 'Section 1',
        tasks: [{ id: 'task1', status: constants.COMPLETE_REGISTRATION_TASK_STATUS, journeyParts: [] }],
        dependantIds: []
      },
      {
        id: 2,
        title: 'Section 2',
        tasks: [{ id: 'task2', status: 'IN_PROGRESS', journeyParts: [] }],
        dependantIds: [1]
      }
    ]

    const session = {}

    const result = generateTaskList(taskSections, session)

    expect(result[1].tasks[0].status).toBe(constants.CANNOT_START_YET_STATUS)
    expect(result[1].tasks[0].isLocked).toBe(true)
  })
})
