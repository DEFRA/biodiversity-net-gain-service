import constants from '../../utils/constants.js'
import path from 'path'
import { getHumanReadableFileSize } from '../../utils/helpers.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import { getNextStep } from '../../journey-validation/task-list-generator.js'

const getContext = request => {
  const fileLocation = request.yar.get(constants.redisKeys.DEVELOPER_PLANNING_DECISION_NOTICE_LOCATION)
  const fileSize = request.yar.get(constants.redisKeys.DEVELOPER_PLANNING_DECISION_NOTICE_FILE_SIZE)
  const humanReadableFileSize = getHumanReadableFileSize(fileSize)
  return {
    filename: fileLocation === null ? '' : path.parse(fileLocation).base,
    fileSize: humanReadableFileSize,
    fileLocation
  }
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.DEVELOPER_CHECK_PLANNING_DECISION_NOTICE_FILE, getContext(request))
  },
  post: async (request, h) => {
    const checkPlanningDecisionNotice = request.payload.checkPlanningDecisionNotice
    request.yar.set(constants.redisKeys.DEVELOPER_PLANNING_DECISION_NOTICE_CHECKED, checkPlanningDecisionNotice)
    const context = getContext(request)
    if (checkPlanningDecisionNotice === 'no') {
      await deleteBlobFromContainers(context.fileLocation)
      request.yar.clear(constants.redisKeys.DEVELOPER_PLANNING_DECISION_NOTICE_LOCATION)
      return getNextStep(request, h)
    } else if (checkPlanningDecisionNotice === 'yes') {
      return getNextStep(request, h)
    } else {
      context.err = [{
        text: 'Select yes if this is the correct file',
        href: '#check-upload-correct-yes'
      }]
      return h.view(constants.views.DEVELOPER_CHECK_PLANNING_DECISION_NOTICE_FILE, context)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_CHECK_PLANNING_DECISION_NOTICE_FILE,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_CHECK_PLANNING_DECISION_NOTICE_FILE,
  handler: handlers.post
}]
