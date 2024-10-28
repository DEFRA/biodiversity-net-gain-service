import constants from './constants.js'

const developerTaskList = {
  taskList: [
    {
      dependantIds: [],
      id: null,
      taskTitle: 'Your details',
      tasks: [
        {
          title: 'Add your details',
          status: constants.DEFAULT_DEVELOPER_TASK_STATUS,
          completedTaskUrl: constants.routes.DEVELOPER_AGENT_ACTING_FOR_CLIENT,
          startTaskUrl: constants.routes.DEVELOPER_AGENT_ACTING_FOR_CLIENT,
          inProgressUrl: constants.routes.DEVELOPER_AGENT_ACTING_FOR_CLIENT,
          id: 'add-your-details'
        }
      ]
    },
    {
      dependantIds: [],
      id: null,
      taskTitle: 'Biodiversity 4.1 Metric calculations',
      tasks: [
        {
          title: 'Upload Metric 4.1 file',
          status: constants.DEFAULT_DEVELOPER_TASK_STATUS,
          completedTaskUrl: constants.routes.DEVELOPER_BNG_NUMBER,
          startTaskUrl: constants.routes.DEVELOPER_BNG_NUMBER,
          inProgressUrl: constants.routes.DEVELOPER_UPLOAD_METRIC,
          id: 'upload-metric-file'
        },
        {
          title: 'Confirm development details',
          status: constants.DEFAULT_DEVELOPER_TASK_STATUS,
          completedTaskUrl: constants.routes.DEVELOPER_CONFIRM_DEV_DETAILS,
          startTaskUrl: constants.routes.DEVELOPER_CONFIRM_DEV_DETAILS,
          inProgressUrl: constants.routes.DEVELOPER_UPLOAD_METRIC,
          id: 'confirm-development-details'
        },
        {
          title: 'Confirm off-site gain',
          status: constants.DEFAULT_DEVELOPER_TASK_STATUS,
          completedTaskUrl: constants.routes.DEVELOPER_CONFIRM_OFF_SITE_GAIN,
          startTaskUrl: constants.routes.DEVELOPER_CONFIRM_OFF_SITE_GAIN,
          inProgressUrl: constants.routes.DEVELOPER_UPLOAD_METRIC,
          id: 'confirm-off-site-gain'
        }
      ]
    },
    {
      dependantIds: [],
      id: null,
      taskTitle: 'Development project information',
      tasks: [
        {
          title: 'Add development project information',
          status: constants.DEFAULT_DEVELOPER_TASK_STATUS,
          completedTaskUrl: constants.routes.DEVELOPER_DEVELOPMENT_PROJECT_INFORMATION,
          startTaskUrl: constants.routes.DEVELOPER_DEVELOPMENT_PROJECT_INFORMATION,
          inProgressUrl: constants.routes.DEVELOPER_DEVELOPMENT_PROJECT_INFORMATION,
          id: 'add-development-project-information'

        }
      ]
    },
    {
      dependantIds: [],
      id: null,
      taskTitle: 'Consent to use a biodiversity gain site for off-site gain',
      tasks: [
        {
          title: 'Upload the consent document',
          status: constants.DEFAULT_DEVELOPER_TASK_STATUS,
          completedTaskUrl: constants.routes.DEVELOPER_UPLOAD_CONSENT_TO_ALLOCATE_GAINS,
          startTaskUrl: constants.routes.DEVELOPER_UPLOAD_CONSENT_TO_ALLOCATE_GAINS,
          inProgressUrl: constants.routes.DEVELOPER_UPLOAD_CONSENT_TO_ALLOCATE_GAINS,
          id: 'upload-consent-document'
        }
      ]
    },
    {
      dependantIds: [],
      id: null,
      taskTitle: 'Submit your biodiversity gain information',
      tasks: [
        {
          title: 'Check your answers before you submit them to us',
          status: 'CANNOT START YET',
          completedTaskUrl: constants.routes.DEVELOPER_CHECK_AND_SUBMIT,
          startTaskUrl: constants.routes.DEVELOPER_CHECK_AND_SUBMIT,
          inProgressUrl: constants.routes.DEVELOPER_CHECK_AND_SUBMIT,
          id: 'check-your-answer'
        }
      ]
    }
  ]
}
export default developerTaskList
