import isEmpty from 'lodash/isEmpty.js'
import constants from '../../utils/constants.js'
import {
  validateTextInput,
  checkForDuplicateConcatenated,
  getLegalAgreementDocumentType,
  validateIdGetSchemaOptional,
  emailValidator,
  getValidReferrerUrl
} from '../../utils/helpers.js'

const firstNameID = '#firstName'
const lastNameID = '#lastName'
const emailID = '#emailAddress'

const validateIndividual = individual => {
  const errors = {}
  const firstNameError = validateTextInput(individual.firstName, firstNameID, 'First name', 50, 'landowner or leaseholder')
  if (firstNameError) {
    errors.firstNameError = firstNameError.err[0]
  }
  const lastNameError = validateTextInput(individual.lastName, lastNameID, 'Last name', 50, 'landowner or leaseholder')
  if (lastNameError) {
    errors.lastNameError = lastNameError.err[0]
  }
  const emailAddressError = emailValidator(individual.emailAddress, emailID)
  if (emailAddressError?.err?.length > 0) {
    errors.emailAddressError = emailAddressError.err[0]
  }
  return errors
}
const handlers = {
  get: async (request, h) => {
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.cacheKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    const { id } = request.query
    let individual = {
      firstName: '',
      lastName: '',
      emailAddress: ''
    }
    const landownerIndividuals = request.yar.get(constants.cacheKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS)
    if (id) {
      individual = landownerIndividuals[id]
    }
    return h.view(constants.views.ADD_LANDOWNER_INDIVIDUAL_CONSERVATION_COVENANT, {
      legalAgreementType,
      individual
    })
  },
  post: async (request, h) => {
    const individual = request.payload
    individual.type = constants.individualOrOrganisationTypes.INDIVIDUAL
    const { id } = request.query
    const errors = {}
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.cacheKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    const landownerIndividuals = request.yar.get(constants.cacheKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS) ?? []
    const individualError = validateIndividual(individual)
    if (isEmpty(individualError)) {
      const excludeIndex = id !== undefined ? parseInt(id, 10) : null
      const personDuplicateError = checkForDuplicateConcatenated(
        landownerIndividuals,
        ['firstName', 'lastName'],
        individual,
        '#personName',
        'This landowner or leaseholder has already been added - enter a different landowner or leaseholder, if there is one',
        excludeIndex
      )
      if (personDuplicateError) {
        errors.fullNameError = personDuplicateError
      }
    } else {
      errors.individualError = individualError
    }

    if (!isEmpty(errors)) {
      return h.view(constants.views.ADD_LANDOWNER_INDIVIDUAL_CONSERVATION_COVENANT, {
        individual,
        legalAgreementType,
        err: !isEmpty(errors.individualError) ? Object.values(errors.individualError) : Object.values(errors.fullNameError),
        fullNameError: errors.fullNameError,
        firstNameError: errors.individualError?.firstNameError,
        lastNameError: errors.individualError?.lastNameError,
        emailAddressError: errors.individualError?.emailAddressError
      })
    }
    if (id) {
      landownerIndividuals.splice(id, 1, individual)
    } else {
      landownerIndividuals.push(individual)
    }
    request.yar.set(constants.cacheKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS, landownerIndividuals)
    const referrerUrl = getValidReferrerUrl(request.yar, constants.LAND_LEGAL_AGREEMENT_VALID_REFERRERS)
    return h.redirect(referrerUrl || constants.routes.CHECK_LANDOWNERS)
  }

}

export default [{
  method: 'GET',
  path: constants.routes.ADD_LANDOWNER_INDIVIDUAL_CONSERVATION_COVENANT,
  handler: handlers.get,
  options: validateIdGetSchemaOptional

}, {
  method: 'POST',
  path: constants.routes.ADD_LANDOWNER_INDIVIDUAL_CONSERVATION_COVENANT,
  handler: handlers.post,
  options: validateIdGetSchemaOptional
}]
