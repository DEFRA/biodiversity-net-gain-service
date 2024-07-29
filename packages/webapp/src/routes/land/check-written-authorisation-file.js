import constants from '../../utils/constants.js'
import { getHumanReadableFileSize } from '../../utils/helpers.js'
import path from 'path'
import { getNextStep } from '../../journey-validation/task-list-generator-v5.js'

const getContext = request => {
  const fileLocation = request.yar.get(constants.redisKeys.WRITTEN_AUTHORISATION_LOCATION)
  const fileSize = request.yar.get(constants.redisKeys.WRITTEN_AUTHORISATION_FILE_SIZE)
  const humanReadableFileSize = getHumanReadableFileSize(fileSize)
  return {
    filename: fileLocation === null ? '' : path.parse(fileLocation).base,
    fileSize: humanReadableFileSize,
    fileLocation
  }
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.CHECK_WRITTEN_AUTHORISATION_FILE, getContext(request))
  },
  post: async (request, h) => {
    const checkWrittenAuthorisation = request.payload.checkWrittenAuthorisation
    const context = getContext(request)
    request.yar.set(constants.redisKeys.WRITTEN_AUTHORISATION_CHECKED, checkWrittenAuthorisation)

    return getNextStep(request, h, (e) => {
      return h.view(constants.views.CHECK_WRITTEN_AUTHORISATION_FILE, {
        ...context,
        err: [e]
      })
    })
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_WRITTEN_AUTHORISATION_FILE,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_WRITTEN_AUTHORISATION_FILE,
  handler: handlers.post
}]
