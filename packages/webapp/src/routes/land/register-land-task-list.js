import constants from '../../utils/constants.js'
import { getTaskListWithStatusCounts } from '../../journey-validation/task-list-generator.js'

const handlers = {
  get: async (request, h) => {
    const { taskList, totalTasks, completedTasks, canSubmit } = getTaskListWithStatusCounts(request.yar)

    return h.view(constants.views.REGISTER_LAND_TASK_LIST, {
      registrationTasks: { taskList },
      registrationCompletedTasks: completedTasks,
      totalSections: totalTasks,
      canSubmit
    })
  }
}

export default [{
  method: 'GET',
  path: constants.routes.REGISTER_LAND_TASK_LIST,
  handler: handlers.get
}]
