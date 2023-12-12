import constants from '../../utils/constants.js'
import path from 'path'
import { getHumanReadableFileSize, processRegistrationTask } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Add legal agreement details'
    }, {
      inProgressUrl: constants.routes.CHECK_SCHEME_OF_WORKS_FILE
    })
    return h.view(constants.views.CHECK_SCHEME_OF_WORKS_FILE, getContext(request))
  },
  post: async (request, h) => {
    const { checkSchemeOfWorks } = request.payload
    const context = getContext(request)
    request.yar.set(constants.redisKeys.SCHEME_OF_WORKS_CHECKED, checkSchemeOfWorks)
    if (checkSchemeOfWorks === 'no') {
      request.yar.set(constants.redisKeys.SCHEME_OF_WORKS_FILE_OPTION, 'no')
      return h.redirect(constants.routes.UPLOAD_SCHEME_OF_WORKS)
    } else if (checkSchemeOfWorks === 'yes') {
      request.yar.set(constants.redisKeys.SCHEME_OF_WORKS_FILE_OPTION, 'yes')
      const redirectUrl = request.yar.get(constants.redisKeys.REFERER, true) ||
                          constants.routes.NEED_ADD_ALL_RESPONSIBLE_BODIES
      return h.redirect(redirectUrl)
    } else {
      context.err = [{
        text: 'Select yes if this is the correct file',
        href: '#check-upload-correct-yes'
      }]
      return h.view(constants.views.CHECK_SCHEME_OF_WORKS_FILE, context)
    }
  }
}

const getContext = request => {
  const fileLocation = request.yar.get(constants.redisKeys.SCHEME_OF_WORKS_FILE_LOCATION)
  const fileSize = request.yar.get(constants.redisKeys.SCHEME_OF_WORKS_FILE_SIZE)
  const humanReadableFileSize = getHumanReadableFileSize(fileSize)
  return {
    filename: fileLocation === null ? '' : path.parse(fileLocation).base,
    selectedOption: request.yar.get(constants.redisKeys.SCHEME_OF_WORKS_FILE_OPTION),
    fileSize: humanReadableFileSize,
    fileLocation
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_SCHEME_OF_WORKS_FILE,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_SCHEME_OF_WORKS_FILE,
  handler: handlers.post
}]
