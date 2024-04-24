import constants from '../../utils/constants.js'
import path from 'path'
import { getHumanReadableFileSize } from '../../utils/helpers.js'
const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.CHECK_LOCAL_LAND_CHARGE_FILE, getContext(request))
  },
  post: async (request, h) => {
    const checkLocalLandCharge = request.payload.checkLocalLandCharge
    const context = getContext(request)
    request.yar.set(constants.redisKeys.LOCAL_LAND_CHARGE_CHECKED, checkLocalLandCharge)
    if (checkLocalLandCharge === 'no') {
      request.yar.set(constants.redisKeys.LOCAL_LAND_CHARGE_FILE_OPTION, 'no')
      return h.redirect(constants.routes.UPLOAD_LOCAL_LAND_CHARGE)
    } else if (checkLocalLandCharge === 'yes') {
      request.yar.set(constants.redisKeys.LOCAL_LAND_CHARGE_FILE_OPTION, 'yes')
      const redirectUrl = request.yar.get(constants.redisKeys.REFERER, true) ||
                          constants.routes.REGISTER_LAND_TASK_LIST
      return h.redirect(redirectUrl)
    } else {
      context.err = [{
        text: 'Select yes if this is the correct file',
        href: '#check-upload-correct-yes'
      }]
      return h.view(constants.views.CHECK_LOCAL_LAND_CHARGE_FILE, context)
    }
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
