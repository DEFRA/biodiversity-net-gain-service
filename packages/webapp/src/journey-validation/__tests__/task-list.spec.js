import Session from '../../__mocks__/session.js'
import constants from '../../utils/constants.js'
import {
  getTaskList,
  JOURNEYS,
  STATUSES
} from '../blah.js'

const testString = '1234'
const session = new Session()

const initialTaskList = [
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

describe('journey validation task list', () => {
  it('Empty session should generate initial task list for registation journey', done => {
    jest.isolateModules(async () => {
      try {
        const taskList = getTaskList(JOURNEYS.REGISTRATION, session)
        expect(taskList).toMatchObject(initialTaskList)
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

        const taskList = getTaskList(JOURNEYS.REGISTRATION, session)
        expect(taskList[1].tasks[1].status).toBe(STATUSES.IN_PROGRESS)

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

        const taskList = getTaskList(JOURNEYS.REGISTRATION, session)
        expect(taskList[1].tasks[1].status).toBe(STATUSES.COMPLETE)

        done()
      } catch (err) {
        done(err)
      }
    })
  })
})
