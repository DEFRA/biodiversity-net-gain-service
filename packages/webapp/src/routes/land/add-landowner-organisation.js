import isEmpty from 'lodash/isEmpty.js'
import constants from '../../utils/constants.js'
import { validateTextInput, checkForDuplicate, emailValidator, getLegalAgreementDocumentType, validateIdGetSchemaOptional, getValidReferrerUrl } from '../../utils/helpers.js'

const organisationNameID = '#organisationName'
const emailID = '#emailAddress'
const validateOrganisation = organisation => {
  const errors = {}
  const organisationNameError = validateTextInput(organisation.organisationName, organisationNameID, 'Organisation name', 50, 'landowner or leaseholder')
  if (organisationNameError) {
    errors.organisationNameError = organisationNameError.err[0]
  }
  const emailAddressError = emailValidator(organisation.emailAddress, emailID)
  if (emailAddressError?.err?.length > 0) {
    errors.emailAddressError = emailAddressError.err[0]
  }
  return errors
}
const handlers = {
  get: async (request, h) => {
    const { id } = request.query
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    let organisation = {
      organisationName: '',
      emailAddress: ''
    }
    const landownerOrganisations = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS)
    if (id) {
      organisation = landownerOrganisations[id]
    }
    return h.view(constants.views.ADD_LANDOWNER_ORGANISATION, {
      legalAgreementType,
      organisation
    })
  },
  post: async (request, h) => {
    const organisation = request.payload
    organisation.type = constants.individualOrOrganisationTypes.ORGANISATION
    const { id } = request.query
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    let errors = {}
    const landownerOrganisations = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS) ?? []
    const excludeIndex = id !== undefined ? parseInt(id, 10) : null

    errors = validateOrganisation(organisation)
    if (isEmpty(errors)) {
      const duplicateError = checkForDuplicate(
        landownerOrganisations,
        'organisationName',
        organisation.organisationName,
        '#organisationName',
        'This organisation has already been added - enter a different organisation, if there is one',
        excludeIndex
      )
      if (duplicateError) {
        errors.organisationNameError = duplicateError.err
      }
    }
    if (!isEmpty(errors)) {
      return h.view(constants.views.ADD_LANDOWNER_ORGANISATION, {
        organisation,
        legalAgreementType,
        emailAddressError: errors.emailAddressError,
        err: Object.values(errors),
        ...errors
      })
    }

    if (id) {
      landownerOrganisations.splice(id, 1, organisation)
    } else {
      landownerOrganisations.push(organisation)
    }
    request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS, landownerOrganisations)
    const referrerUrl = getValidReferrerUrl(request.yar, constants.LAND_LEGAL_AGREEMENT_VALID_REFERRERS)
    const isCombinedCase = (request?._route?.path || '').startsWith('/combined-case')
    const checkLandownersUrl = isCombinedCase ? constants.reusedRoutes.COMBINED_CASE_CHECK_LANDOWNERS : constants.routes.CHECK_LANDOWNERS
    return h.redirect(referrerUrl || checkLandownersUrl)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.ADD_LANDOWNER_ORGANISATION,
  handler: handlers.get,
  options: validateIdGetSchemaOptional
}, {
  method: 'POST',
  path: constants.routes.ADD_LANDOWNER_ORGANISATION,
  handler: handlers.post,
  options: validateIdGetSchemaOptional
}]
