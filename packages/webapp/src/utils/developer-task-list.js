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
      taskTitle: 'Biodiversity 4.0 Metric calculations',
      tasks: [
        {
          title: 'Upload Metric 4.0 file',
          status: constants.DEFAULT_DEVELOPER_TASK_STATUS,
          completedTaskUrl: constants.routes.DEVELOPER_UPLOAD_METRIC,
          startTaskUrl: constants.routes.DEVELOPER_UPLOAD_METRIC,
          inProgressUrl: constants.routes.DEVELOPER_UPLOAD_METRIC,
          id: 'upload-metric-file'
        },
        {
          title: 'Confirm development details',
          status: constants.DEFAULT_DEVELOPER_TASK_STATUS,
          completedTaskUrl: constants.routes.DEVELOPER_CONFIRM_DEV_DETAILS,
          startTaskUrl: constants.routes.DEVELOPER_UPLOAD_METRIC,
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
      taskTitle: 'Consent to use a biodiversity gain site for off-site gain',
      tasks: [
        {
          title: 'Upload the consent document',
          status: constants.DEFAULT_DEVELOPER_TASK_STATUS,
          completedTaskUrl: constants.routes.DEVELOPER_CONSENT_AGREEMENT_UPLOAD,
          startTaskUrl: constants.routes.DEVELOPER_CONSENT_AGREEMENT_UPLOAD,
          inProgressUrl: constants.routes.DEVELOPER_CONSENT_AGREEMENT_UPLOAD,
          id: 'upload-consent-document'
        }
      ]
    },
    {
      taskTitle: 'Submit your biodiversity gain information',
      tasks: [
        {
          title: 'Check your answers before you submit them to us',
          status: 'CANNOT START YET',
          completedTaskUrl: constants.routes.DEVELOPER_EMAIL_ENTRY,
          startTaskUrl: constants.routes.DEVELOPER_CHECK_ANSWERS,
          inProgressUrl: constants.routes.DEVELOPER_CHECK_ANSWERS,
          id: 'check-your-answer'
        }
      ]
    }
  ]
}
export default developerTaskList
