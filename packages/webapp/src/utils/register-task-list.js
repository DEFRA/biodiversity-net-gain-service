import constants from './constants.js'
import lojConstants from './loj-constants.js'

const registerTaskList = {
  taskList: [
    {
      taskTitle: 'Applicant information',
      tasks: [
        {
          title: 'Add details about the applicant',
          status: constants.DEFAULT_REGISTRATION_TASK_STATUS,
          completedTaskUrl: constants.routes.CHECK_APPLICANT_INFORMATION,
          startTaskUrl: lojConstants.commonRoutes.AGENT_ACTING_FOR_CLIENT,
          inProgressUrl: '',
          id: 'add-applicant-information'
        }
      ]
    },
    {
      taskTitle: 'Land information',
      tasks: [
        {
          title: 'Add land ownership details',
          status: constants.DEFAULT_REGISTRATION_TASK_STATUS,
          completedTaskUrl: constants.routes.LAND_OWNERSHIP_PROOF_LIST,
          startTaskUrl: constants.routes.UPLOAD_LAND_OWNERSHIP,
          inProgressUrl: '',
          id: 'add-land-ownership'
        },
        {
          title: 'Add biodiversity gain site boundary details',
          status: constants.DEFAULT_REGISTRATION_TASK_STATUS,
          completedTaskUrl: constants.routes.CHECK_LAND_BOUNDARY_DETAILS,
          startTaskUrl: process.env.ENABLE_ROUTE_SUPPORT_FOR_GEOSPATIAL === 'Y' ? constants.routes.CHOOSE_LAND_BOUNDARY_UPLOAD : constants.routes.UPLOAD_LAND_BOUNDARY,
          inProgressUrl: '',
          id: 'add-land-boundary'
        },
        {
          title: 'Add habitat baseline, creation and enhancements',
          status: constants.DEFAULT_REGISTRATION_TASK_STATUS,
          completedTaskUrl: constants.routes.CHECK_METRIC_DETAILS,
          startTaskUrl: constants.routes.UPLOAD_METRIC,
          inProgressUrl: '',
          id: 'add-habitat-information'
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
        },
        {
          title: 'Add local land charge search certificate',
          status: constants.DEFAULT_REGISTRATION_TASK_STATUS,
          completedTaskUrl: constants.routes.CHECK_LOCAL_LAND_CHARGE_FILE,
          startTaskUrl: constants.routes.UPLOAD_LOCAL_LAND_CHARGE,
          inProgressUrl: '',
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
