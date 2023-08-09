import constants from '../../utils/constants.js'
import registerTaskList from '../../utils/register-task-list.js'

const handlers = {
  get: async (request, h) => {
    let completedTasks = 0
    let totalTasks = 0
    let dataContent = request.yar.get(constants.redisKeys.REGISTRATION_TASK_DETAILS)
    if (!dataContent) {
      dataContent = JSON.parse(JSON.stringify(registerTaskList))
    } else {
      dataContent.taskList.forEach(task => {
        if (task.tasks.length === 1) {
          totalTasks += 1
          if (task.tasks[0].status === constants.COMPLETE_REGISTRATION_TASK_STATUS) {
            completedTasks += 1
          }
        } else {
          task.tasks.forEach(currentTask => {
            totalTasks += 1
            if (currentTask.status === constants.COMPLETE_REGISTRATION_TASK_STATUS) {
              completedTasks += 1
            }
          })
        }
      })
      dataContent.completedTasks = completedTasks
    }
    const canSubmit = completedTasks === (totalTasks - 1)
    return h.view(constants.views.REGISTER_LAND_TASK_LIST, {
      registrationTasks: dataContent,
      registrationCompletedTasks: completedTasks,
      totalSections: totalTasks,
      canSubmit: canSubmit
    })
  }
}

export default [{
  method: 'GET',
  path: constants.routes.REGISTER_LAND_TASK_LIST,
  handler: handlers.get
}]
