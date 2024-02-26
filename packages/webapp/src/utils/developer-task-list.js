import constants from './constants.js'

const developerTaskList = {
  taskList: [
    {
      taskTitle: 'Your details',
      tasks: [
        {
          title: 'Add your details',
          status: constants.DEFAULT_DEVELOPER_TASK_STATUS,
          completedTaskUrl: constants.routes.DEVELOPER_DETAILS_CONFIRM,
          startTaskUrl: constants.routes.DEVELOPER_DETAILS_NAME,
          inProgressUrl: constants.routes.DEVELOPER_DETAILS_NAME,
          id: 'add-your-details'
        }
      ]
    },
    {
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
      taskTitle: 'Consent to allocate off-site gains from a biodiversity gain site',
      tasks: [
        {
          title: 'Upload the consent document',
          status: constants.DEFAULT_DEVELOPER_TASK_STATUS,
          completedTaskUrl: constants.routes.DEVELOPER_CHECK_CONSENT_TO_USE_GAIN_SITE_FILE,
          startTaskUrl: constants.routes.DEVELOPER_UPLOAD_CONSENT_TO_ALLOCATE_GAINS,
          inProgressUrl: '',
          id: 'upload-consent-to-allocate-gains-document'
        }
      ]
    },
    {
      taskTitle: 'Submit your biodiversity gain information',
      tasks: [
        {
          title: 'Check your answers before you submit them to us',
          status: 'CANNOT START YET',
          completedTaskUrl: constants.routes.DEVELOPER_CHECK_ANSWERS,
          startTaskUrl: constants.routes.DEVELOPER_CHECK_ANSWERS,
          inProgressUrl: constants.routes.DEVELOPER_CHECK_ANSWERS,
          id: 'check-your-answer'
        }
      ]
    }
  ]
}
export default developerTaskList
