import constants from './constants.js'
import creditsPurchaseConstants from './credits-purchase-constants.js'
import saveApplicationSessionIfNeeded from './save-application-session-if-needed.js'

const newDevelopmentProject = async (request, h) => newApplication(request, h, constants.applicationTypes.ALLOCATION)

const newRegistration = async (request, h) => newApplication(request, h, constants.applicationTypes.REGISTRATION)

const newCreditsPurchase = async (request, h) => newApplication(request, h, constants.applicationTypes.CREDITS_PURCHASE)

const newApplication = async (request, h, applicationType) => {
  await saveApplicationSessionIfNeeded(request.yar, true)
  request.yar.set(constants.redisKeys.APPLICATION_TYPE, applicationType)

  if (applicationType === constants.applicationTypes.REGISTRATION) {
    return h.redirect(constants.routes.REGISTER_LAND_TASK_LIST)
  }

  if (applicationType === constants.applicationTypes.ALLOCATION) {
    return h.redirect(constants.routes.DEVELOPER_TASKLIST)
  }

  if (applicationType === constants.applicationTypes.CREDITS_PURCHASE) {
    return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASK_LIST)
  }

  return h.redirect('/')
}

export {
  newDevelopmentProject,
  newRegistration,
  newCreditsPurchase
}
