import constants from '../../utils/constants.js'
import { processRegistrationTask } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Consent to register the biodiversity gain site'
    }, {
      status: constants.IN_PROGRESS_REGISTRATION_TASK_STATUS,
      inProgressUrl: constants.routes.LANDOWNER_CONSENT
    })

    const consent = request.yar.get(constants.redisKeys.LANDOWNER_CONSENT_KEY)
    const name = getName(request.auth.credentials.account)

    return h.view(constants.views.LANDOWNER_CONSENT, { consent, name })
  },
  post: async (request, h) => {
    const consent = request.payload.landownerConsent
    const name = getName(request.auth.credentials.account)
    if (!consent) {
      return h.view(constants.views.LANDOWNER_CONSENT, {
        name,
        err: [{
          text: 'Agree to the landowner consent declaration to continue',
          href: '#landownerConsent'
        }]
      })
    }

    if (consent === 'yes') {
      const taskInformation = {
        taskTitle: 'Land information',
        title: 'Add land ownership details'
      }
      const taskStatus = {
        status: constants.COMPLETE_REGISTRATION_TASK_STATUS
      }
      processRegistrationTask(request, taskInformation, taskStatus)
      request.yar.set(constants.redisKeys.LANDOWNER_CONSENT_KEY, consent)
      return h.redirect(constants.routes.REGISTER_LAND_TASK_LIST)
    } else {
      request.yar.set(constants.redisKeys.LANDOWNER_CONSENT_KEY, consent)
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.LANDOWNER_PERMISSION_UPLOAD)
    }
  }
}

const getName = account => `${account.idTokenClaims.firstName} ${account.idTokenClaims.lastName}`

export default [{
  method: 'GET',
  path: constants.routes.LANDOWNER_CONSENT,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.LANDOWNER_CONSENT,
  handler: handlers.post
}]
