import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const isApplicantAgent = request.yar.get(constants.redisKeys.APPLICANT_DETAILS_IS_AGENT)
    const nonUkAddress = request.yar.get(constants.redisKeys.NON_UK_ADDRESS)
    return h.view(constants.views.NON_UK_ADDRESS, {
      isApplicantAgent,
      nonUkAddress
    })
  },
  post: async (request, h) => {
    const isApplicantAgent = request.yar.get(constants.redisKeys.APPLICANT_DETAILS_IS_AGENT)
    const isIndividualOrOrganisation = request.yar.get(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION)
    const { addressLine1, addressLine2, addressLine3, town, postcode, country } = request.payload
    const nonUkAddress = {
      addressLine1,
      addressLine2,
      addressLine3,
      town,
      postcode,
      country
    }
    const errors = validateAddress(nonUkAddress)
    if (errors) {
      const err = []
      Object.keys(errors).forEach(item => {
        err.push(errors[item])
      })
      return h.view(constants.views.NON_UK_ADDRESS, {
        err,
        isApplicantAgent,
        nonUkAddress,
        ...errors
      })
    } else {
      request.yar.set(constants.redisKeys.NON_UK_ADDRESS, nonUkAddress)
      if (isApplicantAgent === 'no') {
        return h.redirect(constants.routes.CHECK_APPLICANT_INFORMATION)
      }
      if (isIndividualOrOrganisation === constants.landownerTypes.INDIVIDUAL) {
        return h.redirect(constants.routes.CLIENTS_EMAIL_ADDRESS)
      } else {
        return h.redirect(constants.routes.UPLOAD_WRITTEN_AUTHORISATION)
      }
    }
  }
}

const validateAddress = (address) => {
  const errors = {}
  if (!address.addressLine1 || address.addressLine1.length === 0) {
    errors.addressLine1Error = {
      text: 'Enter address line 1',
      href: '#addressLine1'
    }
  }
  if (!address.town || address.town.length === 0) {
    errors.townError = {
      text: 'Enter town or city',
      href: '#town'
    }
  }
  if (!address.country || address.country.length === 0) {
    errors.countryError = {
      text: 'Enter country',
      href: '#country'
    }
  }
  return Object.keys(errors).length > 0 ? errors : null
}
export default [{
  method: 'GET',
  path: constants.routes.NON_UK_ADDRESS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.NON_UK_ADDRESS,
  handler: handlers.post
}]
