import combinedCaseConstants from '../../utils/combined-case-constants.js'
import constants from '../../utils/constants.js'
import { getTaskList } from '../../journey-validation/task-list-generator.js'

const handlers = {
  get: async (request, h) => {
    const { taskList, totalTasks, completedTasks, canSubmit } = getTaskList(constants.applicationTypes.COMBINED_CASE, request.yar)

    return h.view(combinedCaseConstants.views.COMBINED_CASE_TASK_LIST, {
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
    path: combinedCaseConstants.routes.COMBINED_CASE_TASK_LIST,
    handler: handlers.get
  }
]
