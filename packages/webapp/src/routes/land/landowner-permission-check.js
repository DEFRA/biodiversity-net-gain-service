import constants from '../../utils/constants.js'
import path from 'path'
import {
  processRegistrationTask,
  getHumanReadableFileSize
} from '../../utils/helpers.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Consent to register the biodiversity gain site'
    }, {
      inProgressUrl: constants.routes.LANDOWNER_PERMISSION_CHECK
    })
    return h.view(constants.views.LANDOWNER_PERMISSION_CHECK, getContext(request))
  },
  post: async (request, h) => {
    const { checkLandownerPermissionFile } = request.payload
    const context = getContext(request)
    request.yar.set(constants.redisKeys.LANDOWNER_PERMISSION_CHECK_KEY, checkLandownerPermissionFile)

    if (checkLandownerPermissionFile === 'no') {
      await deleteBlobFromContainers(context.fileLocation)
      request.yar.clear(constants.redisKeys.LANDOWNER_PERMISSION_UPLOAD_LOCATION)
      request.yar.set(constants.redisKeys.LANDOWNER_PERMISSION_CHECK_KEY, 'no')
      return h.redirect(constants.routes.LANDOWNER_PERMISSION_UPLOAD)
    } else if (checkLandownerPermissionFile === 'yes') {
      request.yar.set(constants.redisKeys.LANDOWNER_PERMISSION_CHECK_KEY, 'yes')
      const taskInformation = {
        taskTitle: 'Legal information',
        title: 'Consent to register the biodiversity gain site'
      }
      const taskStatus = {
        status: constants.COMPLETE_REGISTRATION_TASK_STATUS
      }
      processRegistrationTask(request, taskInformation, taskStatus)
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.REGISTER_LAND_TASK_LIST)
    } else {
      context.err = [{
        text: 'Select yes if this is the correct file',
        href: '#check-landowner-permission-file'
      }]
      return h.view(constants.views.LANDOWNER_PERMISSION_CHECK, context)
    }
  }
}

const getContext = request => {
  const fileLocation = request.yar.get(constants.redisKeys.LANDOWNER_PERMISSION_UPLOAD_LOCATION)
  const fileSize = request.yar.get(constants.redisKeys.LANDOWNER_PERMISSION_UPLOAD_FILE_SIZE)
  const humanReadableFileSize = getHumanReadableFileSize(fileSize)
  return {
    filename: fileLocation === null ? '' : path.parse(fileLocation).base,
    selectedOption: request.yar.get(constants.redisKeys.LANDOWNER_PERMISSION_CHECK_KEY),
    fileSize: humanReadableFileSize,
    fileLocation
  }
}

export default [{
  method: 'GET',
  path: constants.routes.LANDOWNER_PERMISSION_CHECK,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.LANDOWNER_PERMISSION_CHECK,
  handler: handlers.post
}]
