import constants from '../../utils/constants.js'
import { getTaskList } from '../../journey-validation/task-list-generator.js'

const handlers = {
  get: async (request, h) => {
    const { taskList, totalTasks, completedTasks, canSubmit } = getTaskList(constants.applicationTypes.COMBINED_CASE, request.yar)

    return h.view(constants.views.COMBINED_CASE_TASK_LIST, {
      registrationTasks: { taskList },
      registrationCompletedTasks: completedTasks,
      totalSections: totalTasks,
      canSubmit
    })
  }
}

export default [{
  method: 'GET',
  path: constants.routes.COMBINED_CASE_TASK_LIST,
  handler: handlers.get
}]
