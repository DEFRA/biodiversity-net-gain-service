import isEmpty from 'lodash/isEmpty.js'
import constants from '../../utils/constants.js'
import { validateTextInput, checkForDuplicate, getLegalAgreementDocumentType, validateIdGetSchemaOptional, getValidReferrerUrl } from '../../utils/helpers.js'

const organisationNameID = '#organisationName'
const validateOrganisation = organisation => {
  const errors = {}
  const organisationNameError = validateTextInput(organisation.organisationName, organisationNameID, 'Organisation name', 50, 'landowner or leaseholder')
  if (organisationNameError) {
    errors.organisationNameError = organisationNameError.err[0]
  }
  return errors
}
const handlers = {
  get: async (request, h) => {
    const { id } = request.query
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    let organisation = {
      organisationName: ''
    }
    const landownerOrganisations = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS)
    if (id) {
      organisation = landownerOrganisations[id]
    }
    return h.view(constants.views.ADD_LANDOWNER_ORGANISATION_CONSERVATION_COVENANT, {
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
      return h.view(constants.views.ADD_LANDOWNER_ORGANISATION_CONSERVATION_COVENANT, {
        organisation,
        legalAgreementType,
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
    return h.redirect(referrerUrl || constants.routes.CHECK_LANDOWNERS)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.ADD_LANDOWNER_ORGANISATION_CONSERVATION_COVENANT,
  handler: handlers.get,
  options: validateIdGetSchemaOptional
}, {
  method: 'POST',
  path: constants.routes.ADD_LANDOWNER_ORGANISATION_CONSERVATION_COVENANT,
  handler: handlers.post,
  options: validateIdGetSchemaOptional
}]
