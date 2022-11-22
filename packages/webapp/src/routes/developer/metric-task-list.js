import constants from '../../utils/constants.js'
import metricTaskList from '../../utils/metric-task-list.js'

const handlers = {
  get: async (request, h) => {
    const context = await getContext(request)
    let completedTasks = 0
    // if (!context.dataContent) {
    context.dataContent = metricTaskList
    // } else {
    context.dataContent.taskList.forEach(task => {
      if (task.tasks.length === 1 && task.tasks[0].status === constants.COMPLETE_METRIC_TASK_STATUS) {
        completedTasks += 1
      } else {
        task.tasks.forEach(currentTask => {
          if (currentTask.status === constants.COMPLETE_METRIC_TASK_STATUS) {
            completedTasks += 1
          }
        })
      }
    })
    context.dataContent.completedTasks = completedTasks.length
    const updatedMetricTasks = metricTaskList
    if (Object.values(context.headlineResult[2])[2] === 0 && Object.values(context.headlineResult[2])[3] === 0 && Object.values(context.headlineResult[2])[4] === 0) {
      updatedMetricTasks.taskList[2].isDisplay = false
    }
    return h.view(constants.views.DEVELOPER_METRIC_TASK_LIST, {
      startPage: context.startPage,
      metricTasks: updatedMetricTasks,
      metricCompletedTasks: completedTasks
    })
  }
}

const getContext = async request => {
  const metricData = request.yar.get(constants.redisKeys.DEVELOPER_METRIC_DATA)
  const dataContent = request.yar.get(constants.redisKeys.METRIC_TASK_DETAILS)
  return {
    startPage: metricData.startPage,
    headlineResult: metricData.headlineResult,
    dataContent
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_METRIC_TASK_LIST,
  handler: handlers.get
}]
