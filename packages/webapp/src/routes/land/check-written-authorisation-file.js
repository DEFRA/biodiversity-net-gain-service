import constants from '../../utils/constants.js'
import path from 'path'
import { getHumanReadableFileSize, processRegistrationTask } from '../../utils/helpers.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'

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
    processRegistrationTask(request, {
      taskTitle: 'Applicant information',
      title: 'Add details about the person applying'
    }, {
      status: constants.IN_PROGRESS_REGISTRATION_TASK_STATUS,
      inProgressUrl: constants.routes.CHECK_WRITTEN_AUTHORISATION_FILE
    })
    return h.view(constants.views.CHECK_WRITTEN_AUTHORISATION_FILE, getContext(request))
  },
  post: async (request, h) => {
    const checkWrittenAuthorisation = request.payload.checkWrittenAuthorisation
    const context = getContext(request)
    request.yar.set(constants.redisKeys.WRITTEN_AUTHORISATION_CHECKED, checkWrittenAuthorisation)
    if (checkWrittenAuthorisation === 'no') {
      await deleteBlobFromContainers(context.fileLocation)
      request.yar.clear(constants.redisKeys.WRITTEN_AUTHORISATION_LOCATION)
      return h.redirect(constants.routes.UPLOAD_WRITTEN_AUTHORISATION)
    } else if (checkWrittenAuthorisation === 'yes') {
      return h.redirect(constants.routes.CHECK_APPLICANT_INFORMATION)
    } else {
      context.err = [{
        text: 'Select yes if this is the correct file',
        href: '#check-upload-correct-yes'
      }]
      return h.view(constants.views.CHECK_WRITTEN_AUTHORISATION_FILE, context)
    }
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
