import constants from '../../utils/constants.js'
import { getTaskList } from '../../journey-validation/task-list-generator.js'

const handlers = {
  get: async (request, h) => {
    // todo temp as no new combined case route
    request.yar.set(constants.redisKeys.APPLICATION_TYPE, constants.applicationTypes.COMBINED_CASE)

    const { taskList, totalTasks, completedTasks, canSubmit } = getTaskList(constants.applicationTypes.COMBINED_CASE, request.yar)

    return h.view(constants.views.COMBINED_CASE_TASK_LIST, {
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
    path: constants.routes.COMBINED_CASE_TASK_LIST,
    handler: handlers.get
  }
]
