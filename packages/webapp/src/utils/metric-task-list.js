import constants from './constants.js'

const metricTaskList = {
  taskList: [
    {
      taskTitle: 'Biodiversity 3.1 Metric calculations',
      tasks: [
        {
          title: 'Upload metric calculation',
          status: constants.DEFAULT_METRIC_TASK_STATUS,
          completedTaskUrl: constants.routes.DEVELOPER_UPLOAD_METRIC,
          startTaskUrl: constants.routes.DEVELOPER_UPLOAD_METRIC,
          id: 'upload-metric-calculation'
        },
        {
          title: 'Confirm development details',
          status: constants.DEFAULT_METRIC_TASK_STATUS,
          completedTaskUrl: constants.routes.DEVELOPER_CONFIRM_DEV_DETAILS,
          startTaskUrl: constants.routes.DEVELOPER_CONFIRM_DEV_DETAILS,
          id: 'confirm-development-details'
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
          startTaskUrl: '#',
          id: 'upload-the-land-boundary-details'
        }
      ],
      isDisplay: true
    },

    // FOLLOWING 2 TASKS REQUIRED FOR OFFSITE GAIN <REF: BNGP-740>

    // {
    //   taskTitle: 'On-site Baseline',
    //   tasks: [
    //     {
    //       title: 'Confirm the total amount of on-site gain or loss',
    //       status: constants.DEFAULT_METRIC_TASK_STATUS,
    //       completedTaskUrl: '#',
    //       startTaskUrl: '#',
    //       id: 'confirm-the-total-amount-of-on-site-gain-or-loss'
    //     }
    //   ],
    //   isDisplay: true
    // },
    // {
    //   taskTitle: 'Off-site gains',
    //   tasks: [
    //     {
    //       title: 'confirm the total amount of the off-site gain',
    //       status: constants.DEFAULT_METRIC_TASK_STATUS,
    //       completedTaskUrl: '#',
    //       startTaskUrl: '#',
    //       id: 'confirm-the-total-amount-of-off-site-gain'
    //     }
    //   ],
    //   isDisplay: true
    // },
    {
      taskTitle: 'Biodiversity Payment',
      tasks: [
        {
          title: 'Confirm any Biodiversity Payment you need to make',
          status: constants.DEFAULT_METRIC_TASK_STATUS,
          completedTaskUrl: '#',
          startTaskUrl: '#',
          id: 'confirm-any-biodiversity-payment-you-need-to-make'
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
          startTaskUrl: '#',
          id: 'check-your-answers-before-you-submit-them-to-us'
        }
      ],
      isDisplay: true
    }
  ]
}
export default metricTaskList
