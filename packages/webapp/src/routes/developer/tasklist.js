import constants from '../../utils/constants.js'
import { getTaskList } from '../../journey-validation/task-list-generator.js'

const handlers = {
  get: async (request, h) => {
    const { taskList, totalTasks, completedTasks, canSubmit } = getTaskList(constants.applicationTypes.ALLOCATION, request.yar)

    request.yar.clear(constants.redisKeys.CHECK_AND_SUBMIT_JOURNEY_ROUTE)

    return h.view(constants.views.DEVELOPER_TASKLIST, {
      canSubmit,
      completedTasks,
      totalSections: totalTasks,
      tasks: { taskList }
    })
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.DEVELOPER_TASKLIST,
    handler: handlers.get
  }
]
