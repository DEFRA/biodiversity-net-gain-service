import constants from '../../utils/constants.js'
import path from 'path'
import { getHumanReadableFileSize } from '../../utils/helpers.js'
import { getNextStep } from '../../journey-validation/task-list-generator.js'

const getContext = request => {
  const fileLocation = request.yar.get(constants.redisKeys.HABITAT_PLAN_LOCATION)
  const fileSize = request.yar.get(constants.redisKeys.HABITAT_PLAN_FILE_SIZE)
  const humanReadableFileSize = getHumanReadableFileSize(fileSize)
  return {
    filename: fileLocation === null ? '' : path.parse(fileLocation).base,
    selectedOption: request.yar.get(constants.redisKeys.HABITAT_PLAN_FILE_OPTION),
    fileSize: humanReadableFileSize,
    fileLocation
  }
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.CHECK_HABITAT_PLAN_FILE, getContext(request))
  },
  post: async (request, h) => {
    const checkHabitatPlan = request.payload.checkHabitatPlan
    const context = getContext(request)
    request.yar.set(constants.redisKeys.HABITAT_PLAN_CHECKED, checkHabitatPlan)
    return getNextStep(request, h, (e) => {
      context.err = [e]
      return h.view(constants.views.CHECK_HABITAT_PLAN_FILE, context)
    })
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_HABITAT_PLAN_FILE,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_HABITAT_PLAN_FILE,
  handler: handlers.post
}]
