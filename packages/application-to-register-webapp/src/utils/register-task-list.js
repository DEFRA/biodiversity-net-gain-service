import constants from './constants.js'

const REGISTER_TASK_LIST = {
  taskList: [
    {
      taskTitle: 'Your details',
      tasks: [
        {
          title: 'Add your details',
          status: constants.DEFAULT_REGISTRATION_TASK_STATUS,
          completedTaskUrl: '#',
          startTaskUrl: '#'
        }
      ]
    },
    {
      taskTitle: 'Land information',
      tasks: [
        {
          title: 'Add land boundary details',
          status: constants.DEFAULT_REGISTRATION_TASK_STATUS,
          completedTaskUrl: '#',
          startTaskUrl: '#'
        },
        {
          title: 'Add land ownership details',
          status: constants.DEFAULT_REGISTRATION_TASK_STATUS,
          completedTaskUrl: '#',
          startTaskUrl: '#'
        }
      ]
    },
    {
      taskTitle: 'Habitat information',
      tasks: [
        {
          title: 'Upload Biodiversity Metric 3.1',
          status: constants.DEFAULT_REGISTRATION_TASK_STATUS,
          completedTaskUrl: '#',
          startTaskUrl: '#'
        },
        {
          title: 'Add habitat management and monitoring details',
          status: constants.DEFAULT_REGISTRATION_TASK_STATUS,
          completedTaskUrl: '#',
          startTaskUrl: '#'
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
    }
  ]
}
export default REGISTER_TASK_LIST
