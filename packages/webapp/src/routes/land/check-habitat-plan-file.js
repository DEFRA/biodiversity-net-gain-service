import constants from '../../utils/constants.js'
import path from 'path'
import { checkApplicantDetails, getHumanReadableFileSize, processRegistrationTask } from '../../utils/helpers.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Check Habitat plan file'
    }, {
      inProgressUrl: constants.routes.CHECK_HABITAT_PLAN_FILE
    })
    return h.view(constants.views.CHECK_HABITAT_PLAN_FILE, getContext(request))
  },
  post: async (request, h) => {
    const checkHabitatPlan = request.payload.checkHabitatPlan
    const context = getContext(request)
    request.yar.set(constants.redisKeys.HABITAT_PLAN_CHECKED, checkHabitatPlan)
    if (checkHabitatPlan === 'no') {
      await deleteBlobFromContainers(context.fileLocation)
      request.yar.clear(constants.redisKeys.HABITAT_PLAN_LOCATION)
      request.yar.set(constants.redisKeys.HABITAT_PLAN_FILE_OPTION, 'no')
      return h.redirect(constants.routes.UPLOAD_HABITAT_PLAN)
    } else if (checkHabitatPlan === 'yes') {
      request.yar.set(constants.redisKeys.HABITAT_PLAN_FILE_OPTION, 'yes')

      const redirectUrl = request.yar.get(constants.redisKeys.REFERER, true) ||
                          constants.routes.LEGAL_AGREEMENT_START_DATE
      return h.redirect(redirectUrl)
    } else {
      context.err = [{
        text: 'Select yes if this is the correct file',
        href: '#check-upload-correct-yes'
      }]
      return h.view(constants.views.CHECK_HABITAT_PLAN_FILE, context)
    }
  }
}

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

export default [{
  method: 'GET',
  path: constants.routes.CHECK_HABITAT_PLAN_FILE,
  handler: handlers.get,
  config: {
    pre: [checkApplicantDetails]
  }
}, {
  method: 'POST',
  path: constants.routes.CHECK_HABITAT_PLAN_FILE,
  handler: handlers.post
}]
