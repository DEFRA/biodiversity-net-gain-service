import constants from '../../utils/constants.js'
import path from 'path'
import { processRegistrationTask } from '../../utils/helpers.js'

const getClientName = (session, isIndividual) => {
  if (isIndividual) {
    const name = session.get(constants.redisKeys.CLIENTS_NAME).value
    return `${name.firstName} ${name.middleNames} ${name.lastName}`
  }

  return session.get(constants.redisKeys.CLIENTS_ORGANISATION_NAME)
}

const addOptionalAddressLine = (line) => line.trim() ? `${line}, ` : ''

const getAddress = (session, addressIsUK) => {
  if (addressIsUK) {
    const ukAddress = session.get(constants.redisKeys.UK_ADDRESS)
    return `${ukAddress.addressLine1}, ` +
      addOptionalAddressLine(ukAddress.addressLine2) +
      `${ukAddress.town}, ` +
      addOptionalAddressLine(ukAddress.county) +
      `${ukAddress.postcode}`
  }

  const internationalAddress = session.get(constants.redisKeys.NON_UK_ADDRESS)
  return `${internationalAddress.addressLine1}, ` +
    addOptionalAddressLine(internationalAddress.addressLine2) +
    addOptionalAddressLine(internationalAddress.addressLine3) +
    `${internationalAddress.town}, ` +
    addOptionalAddressLine(internationalAddress.postcode) +
    `${internationalAddress.country}`
}

const getContext = session => {
  const context = {}

  context.actingForClient = session.get(constants.redisKeys.APPLICANT_DETAILS_IS_AGENT) === 'yes'
  context.accountDetailsUpToDate = session.get(constants.redisKeys.DEFRA_ACCOUNT_DETAILS_CONFIRMED) === 'true'
  context.addressIsUK = session.get(constants.redisKeys.IS_ADDRESS_UK) === 'yes'

  if (context.actingForClient) {
    context.clientIsIndividual = session.get(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION) === constants.landownerTypes.INDIVIDUAL
    context.clientName = getClientName(session, context.clientIsIndividual)
    context.clientAddress = getAddress(session, context.addressIsUK)
    context.authorisationFile = path.basename(session.get(constants.redisKeys.WRITTEN_AUTHORISATION_LOCATION))

    if (context.clientIsIndividual) {
      context.clientEmail = session.get(constants.redisKeys.CLIENTS_EMAIL_ADDRESS)
      context.clientPhone = session.get(constants.redisKeys.CLIENTS_PHONE_NUMBER)
    }
  } else {
    context.applicantIsIndividual = session.get(constants.redisKeys.LANDOWNER_TYPE) === constants.landownerTypes.INDIVIDUAL
    context.applicantAddress = getAddress(session, context.addressIsUK)
  }

  return context
}

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Applicant information',
      title: 'Add details about the person applying'
    }, {
      status: constants.IN_PROGRESS_REGISTRATION_TASK_STATUS,
      inProgressUrl: constants.routes.CHECK_APPLICANT_INFORMATION
    })
    return h.view(constants.views.CHECK_APPLICANT_INFORMATION, getContext(request.yar))
  },
  post: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Applicant information',
      title: 'Add details about the person applying'
    }, {
      status: constants.COMPLETE_REGISTRATION_TASK_STATUS
    })
    return h.redirect(constants.routes.REGISTER_LAND_TASK_LIST)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_APPLICANT_INFORMATION,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_APPLICANT_INFORMATION,
  handler: handlers.post
}]
