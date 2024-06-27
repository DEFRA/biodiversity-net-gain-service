import Session from '../../__mocks__/session.js'
import constants from '../../utils/constants.js'
import { getTaskList } from '../task-list-generator.js'
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

  describe('Task list locking behavior for combined case', () => {
    it('Should lock a section if its dependant sections are not complete in combined case', done => {
      jest.isolateModules(async () => {
        try {
          session.reset()

          session.set(constants.redisKeys.COMBINED_CASE_TASK_1, testString)

          const taskInfo = getTaskList(constants.applicationTypes.COMBINED_CASE, session)

          const dependentSection = taskInfo.taskList.find(section => section.taskTitle === 'Development information')
          dependentSection.tasks.forEach(task => {
            expect(task.status).toBe(constants.CANNOT_START_YET_STATUS)
            expect(task.isLocked).toBe(true)
          })

          done()
        } catch (err) {
          done(err)
        }
      })
    })

    it('Should not lock a section if its dependant sections are complete in combined case', done => {
      jest.isolateModules(async () => {
        try {
          session.reset()

          // Completing all dependant tasks in the combined case journey
          session.set(constants.redisKeys.IS_AGENT, 'no')
          session.set(constants.redisKeys.DEFRA_ACCOUNT_DETAILS_CONFIRMED, 'true')
          session.set(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY, 'individual')
          session.set(constants.redisKeys.LANDOWNER_TYPE, 'individual')
          session.set(constants.redisKeys.IS_ADDRESS_UK_KEY, 'yes')
          session.set(constants.redisKeys.UK_ADDRESS_KEY, testString)
          session.set(constants.redisKeys.NON_UK_ADDRESS_KEY, testString)
          session.set(constants.redisKeys.CLIENTS_ORGANISATION_NAME_KEY, testString)
          session.set(constants.redisKeys.WRITTEN_AUTHORISATION_LOCATION, testString)
          session.set(constants.redisKeys.WRITTEN_AUTHORISATION_FILE_SIZE, testString)
          session.set(constants.redisKeys.WRITTEN_AUTHORISATION_FILE_TYPE, testString)
          session.set(constants.redisKeys.WRITTEN_AUTHORISATION_CHECKED, testString)
          session.set(constants.redisKeys.CLIENTS_NAME_KEY, testString)
          session.set(constants.redisKeys.CLIENTS_EMAIL_ADDRESS_KEY, testString)
          session.set(constants.redisKeys.CLIENTS_PHONE_NUMBER_KEY, testString)

          const taskInfo = getTaskList(constants.applicationTypes.COMBINED_CASE, session)

          const dependentSection = taskInfo.taskList.find(section => section.taskTitle === 'Development information')
          dependentSection.tasks.forEach(task => {
            expect(task.status).not.toBe(constants.CANNOT_START_YET_STATUS)
            expect(task.isLocked).toBe(undefined)
          })

          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
