import constants from '../../utils/constants.js'
import developerTaskList from '../../utils/developer-task-list.js'

const handlers = {
  get: async (request, h) => {
    let completedTasks = 0
    let dataContent = request.yar.get(constants.cacheKeys.DEVELOPER_TASK_DETAILS)
    if (!dataContent) {
      dataContent = JSON.parse(JSON.stringify(developerTaskList))
    } else {
      dataContent.taskList.forEach(task => {
        if (task.tasks.length === 1 && task.tasks[0].status === constants.COMPLETE_DEVELOPER_TASK_STATUS) {
          completedTasks += 1
        } else {
          task.tasks.forEach(currentTask => {
            if (currentTask.status === constants.COMPLETE_DEVELOPER_TASK_STATUS) {
              completedTasks += 1
            }
          })
        }
      })
      dataContent.completedTasks = completedTasks.length
    }
    return h.view(constants.views.DEVELOPER_TASKLIST, {
      developerTasks: dataContent,
      developerCompletedTasks: completedTasks
    })
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_TASKLIST,
  handler: handlers.get
}]
