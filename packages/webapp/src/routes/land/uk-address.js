import constants from '../../utils/constants.js'
import { isValidPostcode } from '../../utils/helpers.js'
const handlers = {
  get: async (request, h) => {
    const isApplicantAgent = request.yar.get(constants.redisKeys.APPLICANT_DETAILS_IS_AGENT)
    const ukAddress = request.yar.get(constants.redisKeys.UK_ADDRESS)
    return h.view(constants.views.UK_ADDRESS, {
      isApplicantAgent,
      ukAddress
    })
  },
  post: async (request, h) => {
    const isApplicantAgent = request.yar.get(constants.redisKeys.APPLICANT_DETAILS_IS_AGENT)
    const isIndividualOrOrganisation = request.yar.get(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION)
    const { addressLine1, addressLine2, town, county, postcode } = request.payload
    const ukAddress = {
      addressLine1,
      addressLine2,
      town,
      county,
      postcode
    }

    const errors = validateAddress(ukAddress)
    if (errors) {
      const err = []
      Object.keys(errors).forEach(item => {
        err.push(errors[item])
      })
      return h.view(constants.views.UK_ADDRESS, {
        err,
        isApplicantAgent,
        ukAddress,
        ...errors
      })
    } else {
      request.yar.set(constants.redisKeys.UK_ADDRESS, ukAddress)
      if (isApplicantAgent === 'no') {
        return h.redirect(constants.routes.CHECK_APPLICANT_INFORMATION)
      } else {
        if (isIndividualOrOrganisation === constants.landownerTypes.INDIVIDUAL) {
          return h.redirect(constants.routes.CLIENTS_EMAIL_ADDRESS)
        } else {
          return h.redirect(constants.routes.UPLOAD_WRITTEN_AUTHORISATION)
        }
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
  if (!address.postcode || address.postcode.length === 0) {
    errors.postcodeError = {
      text: 'Enter postcode',
      href: '#postcode'
    }
  } else {
    // check valid postcode
    if (!isValidPostcode(address.postcode)) {
      errors.postcodeError = {
        text: 'Enter a full UK postcode',
        href: '#postcode'
      }
    }
  }
  return Object.keys(errors).length > 0 ? errors : null
}

export default [{
  method: 'GET',
  path: constants.routes.UK_ADDRESS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.UK_ADDRESS,
  handler: handlers.post
}]
