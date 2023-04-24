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
          inProgressUrl: '',
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
          completedTaskUrl: '',
          startTaskUrl: '',
          inProgressUrl: '',
          id: 'confirm-development-details'
        },
        {
          title: 'Confirm off-site gain',
          status: constants.DEFAULT_DEVELOPER_TASK_STATUS,
          completedTaskUrl: '',
          startTaskUrl: '',
          inProgressUrl: '',
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
          completedTaskUrl: '',
          startTaskUrl: '',
          inProgressUrl: '',
          id: 'upload-consent-document'
        }
      ]
    },
    {
      taskTitle: 'Submit your biodiversity gain information',
      tasks: [
        {
          title: 'Check your answers before you submit them to us',
          status: constants.DEFAULT_DEVELOPER_TASK_STATUS,
          completedTaskUrl: '',
          startTaskUrl: '',
          inProgressUrl: '',
          id: 'check-your-answer'
        }
      ]
    }
  ]
}
export default developerTaskList
