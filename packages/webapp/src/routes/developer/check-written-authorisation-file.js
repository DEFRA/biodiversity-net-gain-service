import constants from '../../utils/constants.js'
import path from 'path'
import { getHumanReadableFileSize, processRegistrationTask } from '../../utils/helpers.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'

const handlers = {
  get: async (request, h) => {
    const { id } = request.query
    processRegistrationTask(request, {
      taskTitle: 'Applicant information',
      title: 'Add details about the applicant'
    }, {
      inProgressUrl: `${constants.routes.DEVELOPER_CHECK_WRITTEN_AUTHORISATION_FILE}?id=${id}`
    })
    return h.view(constants.views.DEVELOPER_CHECK_WRITTEN_AUTHORISATION_FILE, getContext(request))
  },
  post: async (request, h) => {
    const checkWrittenAuthorisation = request.payload.checkWrittenAuthorisation
    const context = getContext(request)
    request.yar.set(constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_CHECKED, checkWrittenAuthorisation)
    const writtenAuthorisationProofFiles = request.yar.get(constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_FILES)
    if (checkWrittenAuthorisation === 'no') {
      const { id } = request.query
      await deleteBlobFromContainers(context.fileLocation)
      const updatedWrittenAuthorisationProofFiles = writtenAuthorisationProofFiles.filter(item => item.id !== id)
      request.yar.set(constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_FILES, updatedWrittenAuthorisationProofFiles)
      return h.redirect(constants.routes.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION)
    } else if (checkWrittenAuthorisation === 'yes') {
      const multipleProofsOfPermissionRequired = request.yar.get(constants.redisKeys.MULTIPLE_PROOFS_OF_PERMISSION_REQUIRED)
      if (writtenAuthorisationProofFiles.length < 2 && multipleProofsOfPermissionRequired) {
        return h.redirect(constants.routes.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION)
      }
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.DEVELOPER_UPLOAD_CONSENT_TO_USE_GAIN_SITE)
    } else {
      context.err = [{
        text: 'Select yes if this is the correct file',
        href: '#check-upload-correct-yes'
      }]
      return h.view(constants.views.DEVELOPER_CHECK_WRITTEN_AUTHORISATION_FILE, context)
    }
  }
}

const getContext = (request) => {
  const { id } = request.query
  let fileLocation = ''
  let filename = ''
  let fileSize = null
  let humanReadableFileSize = ''
  const writtenAuthorisationProofFiles = request.yar.get(constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_FILES)
  if (id) {
    const writtenAuthorisationProofFile = writtenAuthorisationProofFiles.find(item => item.id === id)
    fileLocation = writtenAuthorisationProofFile.location
    filename = fileLocation === null ? '' : path.parse(fileLocation).base
    fileSize = writtenAuthorisationProofFile.fileSize
    humanReadableFileSize = getHumanReadableFileSize(fileSize)
  }
  return {
    filename,
    fileSize: humanReadableFileSize,
    fileLocation,
    fileId: id
  }
}
export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_CHECK_WRITTEN_AUTHORISATION_FILE,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_CHECK_WRITTEN_AUTHORISATION_FILE,
  handler: handlers.post
}]
