import constants from './constants.js'

const registerTaskList = {
  taskList: [
    {
      taskTitle: 'Land information',
      tasks: [
        {
          title: 'Add land ownership details',
          status: constants.DEFAULT_REGISTRATION_TASK_STATUS,
          completedTaskUrl: constants.routes.CHECK_OWNERSHIP_DETAILS,
          startTaskUrl: constants.routes.UPLOAD_LAND_OWNERSHIP,
          inProgressUrl: '',
          id: 'add-land-ownership'
        },
        {
          title: 'Add biodiversity gain site boundary details',
          status: constants.DEFAULT_REGISTRATION_TASK_STATUS,
          completedTaskUrl: constants.routes.CHECK_LAND_BOUNDARY_DETAILS,
          startTaskUrl: constants.routes.CHOOSE_LAND_BOUNDARY_UPLOAD,
          inProgressUrl: '',
          id: 'add-land-boundary'
        }
      ]
    },
    {
      taskTitle: 'Habitat information',
      tasks: [
        {
          title: 'Add habitat baseline, creation and enhancements',
          status: constants.DEFAULT_REGISTRATION_TASK_STATUS,
          completedTaskUrl: constants.routes.CHECK_METRIC_DETAILS,
          startTaskUrl: constants.routes.UPLOAD_METRIC,
          inProgressUrl: '',
          id: 'add-habitat-information'
        },
        {
          title: 'Add habitat management and monitoring details',
          status: constants.DEFAULT_REGISTRATION_TASK_STATUS,
          completedTaskUrl: constants.routes.CHECK_MANAGEMENT_MONITORING_DETAILS,
          startTaskUrl: constants.routes.UPLOAD_MANAGEMENT_PLAN,
          inProgressUrl: '',
          id: 'add-habitat-management'
        }
      ]
    },
    {
      taskTitle: 'Legal information',
      tasks: [
        {
          title: 'Add legal agreement details',
          status: constants.DEFAULT_REGISTRATION_TASK_STATUS,
          completedTaskUrl: constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS,
          startTaskUrl: constants.routes.LEGAL_AGREEMENT_TYPE,
          inProgressUrl: '',
          id: 'add-legal-agreement'
        }
      ]
    },
    {
      taskTitle: 'Submit your biodiversity gain site information',
      tasks: [
        {
          title: 'Check your answers and submit information',
          status: 'CANNOT START YET',
          completedTaskUrl: constants.routes.CHECK_AND_SUBMIT,
          startTaskUrl: constants.routes.CHECK_AND_SUBMIT,
          inProgressUrl: '',
          id: 'check-your-answers'
        }
      ]
    }
  ]
}
export default registerTaskList
