import constants from '../../utils/constants.js'
import RegisterTaskList from '../../utils/register-task-list.js'

const handlers = {
  get: async (request, h) => {
    let completedTasks = 0
    let dataContent = request.yar.get(constants.redisKeys.REGISTRATION_TASK_DETAILS)
    if (!dataContent) {
      dataContent = RegisterTaskList
    } else {
      dataContent.taskList.forEach(task => {
        if (task.tasks.length === 1 && task.tasks[0].status === constants.COMPLETE_REGISTRATION_TASK_STATUS) {
          completedTasks += 1
        } else {
          task.tasks.forEach(currentTask => {
            if (currentTask.status === constants.COMPLETE_REGISTRATION_TASK_STATUS) {
              completedTasks += 1
            }
          })
        }
      })
      dataContent.completedTasks = completedTasks.length
    }
    return h.view(constants.views.REGISTER_LAND_TASK_LIST, {
      registrationTasks: dataContent,
      registrationCompletedTasks: completedTasks
    })
  }
}

export default [{
  method: 'GET',
  path: constants.routes.REGISTER_LAND_TASK_LIST,
  handler: handlers.get
}]
