import isEmpty from 'lodash/isEmpty.js'
import constants from '../../utils/constants.js'
import {
  processRegistrationTask,
  validateTextInput,
  checkForDuplicateConcatenated,
  getLegalAgreementDocumentType,
  validateIdGetSchemaOptional,
  emailValidator,
  validateLengthOfCharsLessThan50
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
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Add legal agreement details'
    }, {
      inProgressUrl: constants.routes.ADD_LANDOWNER_INDIVIDUAL_CONSERVATION_COVENANT
    })
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    const { id } = request.query
    let individual = {
      firstName: '',
      middleNames: '',
      lastName: '',
      emailAddress: ''
    }
    const landownerIndividuals = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS)
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
    individual.type = constants.landownerTypes.INDIVIDUAL
    const { id } = request.query
    const errors = {}
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    const landownerIndividuals = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS) ?? []
    const individualError = validateIndividual(individual)
    if (isEmpty(individualError)) {
      const excludeIndex = id !== undefined ? parseInt(id, 10) : null
      const personDuplicateError = checkForDuplicateConcatenated(
        landownerIndividuals,
        ['firstName', 'middleNames', 'lastName'],
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

    const middleNameError = validateLengthOfCharsLessThan50(individual.middleNames, 'middle name', 'middleNameId')

    if (middleNameError) {
      errors.individualError = { ...individualError, ...{ middleNameError: middleNameError?.err[0] } }
    }

    if (!isEmpty(errors)) {
      return h.view(constants.views.ADD_LANDOWNER_INDIVIDUAL_CONSERVATION_COVENANT, {
        individual,
        legalAgreementType,
        err: !isEmpty(errors.individualError) ? Object.values(errors.individualError) : Object.values(errors.fullNameError),
        fullNameError: errors.fullNameError,
        firstNameError: errors.individualError?.firstNameError,
        lastNameError: errors.individualError?.lastNameError,
        middleNameError: errors.individualError?.middleNameError,
        emailAddressError: errors.individualError?.emailAddressError
      })
    }
    if (id) {
      landownerIndividuals.splice(id, 1, individual)
    } else {
      landownerIndividuals.push(individual)
    }
    request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS, landownerIndividuals)
    return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.CHECK_LANDOWNERS)
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
