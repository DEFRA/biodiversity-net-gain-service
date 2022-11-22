import constants from './constants.js'

const metricTaskList = {
  taskList: [
    {
      taskTitle: 'Biodiversity 3.1 Metric calculations',
      tasks: [
        {
          title: 'Upload metric calculation',
          status: constants.COMPLETE_METRIC_TASK_STATUS,
          completedTaskUrl: constants.routes.DEVELOPER_UPLOAD_METRIC,
          startTaskUrl: constants.routes.DEVELOPER_UPLOAD_METRIC
        },
        {
          title: 'Confirm development details',
          status: constants.COMPLETE_METRIC_TASK_STATUS,
          completedTaskUrl: constants.routes.DEVELOPER_CONFIRM_DEV_DETAILS,
          startTaskUrl: constants.routes.DEVELOPER_CONFIRM_DEV_DETAILS
        }
      ],
      isDisplay: true
    },
    {
      taskTitle: 'Your development project',
      tasks: [
        {
          title: 'Upload the land boundary details',
          status: constants.DEFAULT_METRIC_TASK_STATUS,
          completedTaskUrl: '#',
          startTaskUrl: '#'
        }
      ],
      isDisplay: true
    },
    {
      taskTitle: 'On-site land',
      tasks: [
        {
          title: 'Confirm the total amount of on-site gain or loss',
          status: constants.DEFAULT_METRIC_TASK_STATUS,
          completedTaskUrl: '#',
          startTaskUrl: '#'
        }
      ],
      isDisplay: true
    },
    {
      taskTitle: 'Off-site land',
      tasks: [
        {
          title: 'Confirm the total amount of off-site gain',
          status: constants.DEFAULT_METRIC_TASK_STATUS,
          completedTaskUrl: '#',
          startTaskUrl: '#'
        }
      ],
      isDisplay: true
    },
    {
      taskTitle: 'Biodiversity Payment',
      tasks: [
        {
          title: 'Confirm any Biodiversity Payment you need to make',
          status: constants.DEFAULT_METRIC_TASK_STATUS,
          completedTaskUrl: '#',
          startTaskUrl: '#'
        }
      ],
      isDisplay: true
    },
    {
      taskTitle: 'Submit your biodiversity gain information',
      tasks: [
        {
          title: 'Check your answers before you submit them to us',
          status: constants.DEFAULT_METRIC_TASK_STATUS,
          completedTaskUrl: '#',
          startTaskUrl: '#'
        }
      ],
      isDisplay: true
    }
  ]
}
export default metricTaskList
