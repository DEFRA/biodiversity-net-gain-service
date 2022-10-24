import constants from './constants.js'

const REGISTER_TASK_LIST = {
  taskList: [
    {
      taskTitle: 'Your details',
      tasks: [
        {
          title: 'Add your details',
          status: constants.DEFAULT_REGISTRATION_TASK_STATUS,
          taskUrl: constants.routes.LEGAL_AGREEMENT_SUMMARY
        }
      ]
    },
    {
      taskTitle: 'Land information',
      tasks: [
        {
          title: 'Add land boundary details',
          status: constants.DEFAULT_REGISTRATION_TASK_STATUS,
          taskUrl: constants.routes.LEGAL_AGREEMENT_SUMMARY
        },
        {
          title: 'Add land ownership details',
          status: constants.DEFAULT_REGISTRATION_TASK_STATUS,
          taskUrl: constants.routes.LEGAL_AGREEMENT_SUMMARY
        }
      ]
    },
    {
      taskTitle: 'Habitat information',
      tasks: [
        {
          title: 'Upload Biodiversity Metric 3.1',
          status: constants.DEFAULT_REGISTRATION_TASK_STATUS,
          taskUrl: constants.routes.LEGAL_AGREEMENT_SUMMARY
        },
        {
          title: 'Add habitat management and monitoring details',
          status: constants.DEFAULT_REGISTRATION_TASK_STATUS,
          taskUrl: constants.routes.LEGAL_AGREEMENT_SUMMARY
        }
      ]
    },
    {
      taskTitle: 'Legal information',
      tasks: [
        {
          title: 'Add legal agreement details',
          status: constants.DEFAULT_REGISTRATION_TASK_STATUS,
          taskUrl: constants.routes.LEGAL_AGREEMENT_SUMMARY
        }
      ]
    }
  ]
}
export default REGISTER_TASK_LIST
