import constants from './constants.js'

const registerTaskList = {
  taskList: [
    {
      taskTitle: 'Your details',
      tasks: [
        {
          title: 'Add your details',
          status: constants.DEFAULT_REGISTRATION_TASK_STATUS,
          completedTaskUrl: constants.routes.CHECK_YOUR_DETAILS,
          startTaskUrl: constants.routes.NAME
        }
      ]
    },
    {
      taskTitle: 'Land information',
      tasks: [
        {
          title: 'Add land boundary details',
          status: constants.DEFAULT_REGISTRATION_TASK_STATUS,
          completedTaskUrl: constants.routes.CHECK_LAND_BOUNDARY_DETAILS,
          startTaskUrl: constants.routes.UPLOAD_GEOSPATIAL_LAND_BOUNDARY
        },
        {
          title: 'Add land ownership details',
          status: constants.DEFAULT_REGISTRATION_TASK_STATUS,
          completedTaskUrl: constants.routes.CHECK_OWNERSHIP_DETAILS,
          startTaskUrl: constants.routes.UPLOAD_LAND_OWNERSHIP
        }
      ]
    },
    {
      taskTitle: 'Habitat information',
      tasks: [
        {
          title: 'Upload Biodiversity Metric 3.1',
          status: constants.DEFAULT_REGISTRATION_TASK_STATUS,
          completedTaskUrl: constants.routes.CHECK_UPLOAD_METRIC,
          startTaskUrl: constants.routes.UPLOAD_METRIC
        },
        {
          title: 'Add habitat management and monitoring details',
          status: constants.DEFAULT_REGISTRATION_TASK_STATUS,
          completedTaskUrl: constants.routes.CHECK_MANAGEMENT_MONITORING_SUMMARY,
          startTaskUrl: constants.routes.UPLOAD_MANAGEMENT_PLAN
        }
      ]
    },
    {
      taskTitle: 'Legal information',
      tasks: [
        {
          title: 'Add legal agreement details',
          status: constants.DEFAULT_REGISTRATION_TASK_STATUS,
          completedTaskUrl: constants.routes.LEGAL_AGREEMENT_SUMMARY,
          startTaskUrl: constants.routes.LEGAL_AGREEMENT_TYPE
        }
      ]
    },
    {
      taskTitle: 'Submit your biodiversity gain site information',
      tasks: [
        {
          title: 'Check your answers and submit information',
          status: 'CANNOT START YET',
          completedTaskUrl: constants.routes.CHECK_YOUR_ANSWERS,
          startTaskUrl: constants.routes.CHECK_YOUR_ANSWERS
        }
      ]
    }
  ]
}
export default registerTaskList
