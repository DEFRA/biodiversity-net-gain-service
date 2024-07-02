import constants from '../../utils/constants.js'
import path from 'path'
import { getHumanReadableFileSize } from '../../utils/helpers.js'
import { getNextStep } from '../../journey-validation/task-list-generator.js'
const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.CHECK_LOCAL_LAND_CHARGE_FILE, getContext(request))
  },
  post: async (request, h) => {
    const checkLocalLandCharge = request.payload.checkLocalLandCharge
    const context = getContext(request)
    request.yar.set(constants.redisKeys.LOCAL_LAND_CHARGE_CHECKED, checkLocalLandCharge)

    return getNextStep(request, h, (e) => {
      context.err = [e]
      return h.view(constants.views.CHECK_LOCAL_LAND_CHARGE_FILE, context)
    })
  }
}

const getContext = request => {
  const fileLocation = request.yar.get(constants.redisKeys.LOCAL_LAND_CHARGE_LOCATION)
  const fileSize = request.yar.get(constants.redisKeys.LOCAL_LAND_CHARGE_FILE_SIZE)
  const humanReadableFileSize = getHumanReadableFileSize(fileSize)

  return {
    filename: fileLocation === null ? '' : path.parse(fileLocation).base,
    selectedOption: request.yar.get(constants.redisKeys.LOCAL_LAND_CHARGE_FILE_OPTION),
    fileSize: humanReadableFileSize,
    fileLocation
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_LOCAL_LAND_CHARGE_FILE,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_LOCAL_LAND_CHARGE_FILE,
  handler: handlers.post
}]
