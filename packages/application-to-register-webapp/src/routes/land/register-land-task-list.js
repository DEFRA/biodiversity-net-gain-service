import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const dataContent = {
      taskList: [
        {
          taskTitle: 'Your details',
          tasks: [
            {
              title: 'Add your details',
              status: 'NOT STARTED',
              taskUrl: '/land/legal-agreement-type'
            }
          ]
        },
        {
          taskTitle: 'Land information',
          tasks: [
            {
              title: 'Add land boundary details',
              status: 'NOT STARTED'
            },
            {
              title: 'Add land ownership details',
              status: 'NOT STARTED'
            }
          ]
        },
        {
          taskTitle: 'Habitat information',
          tasks: [
            {
              title: 'Upload Biodiversity Metric 3.1',
              status: 'NOT STARTED'
            },
            {
              title: 'Add habitat management and monitoring details',
              status: 'NOT STARTED'
            }
          ]
        },
        {
          taskTitle: 'Legal information',
          tasks: [
            {
              title: 'Add legal agreement details',
              status: 'NOT STARTED'
            }
          ]
        }
      ]
    }
    return h.view(constants.views.REGISTER_LAND_TASK_LIST, dataContent)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.REGISTER_LAND_TASK_LIST,
  handler: handlers.get
}]
