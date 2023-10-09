import constants from '../../utils/constants.js'
import { processRegistrationTask, validateTextInput, getLegalAgreementDocumentType } from '../../utils/helpers.js'
import isEmpty from 'lodash/isEmpty.js'

const organisationNameID = '#organisationName'

const validateOrganisation = organisation => {
  const errors = {}
  const organisationNameError = validateTextInput(organisation.organisationName, organisationNameID, 'Organisation name', null, 'landowner or leaseholder')
  if (organisationNameError) {
    errors.organisationNameError = organisationNameError.err[0]
  }

  return errors
}
const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Add legal agreement details'
    }, {
      inProgressUrl: constants.routes.ADD_LANDOWNER_ORGANISATION_CONSERVATION_COVENANT
    })
    const { id } = request.query
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()

    let organisation = {
      organisationName: ''
    }
    const landownerOrganisations = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENTS)
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
    organisation.type = 'organisation'
    const { id } = request.query
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    const organisationError = validateOrganisation(organisation)
    if (!isEmpty(organisationError)) {
      return h.view(constants.views.ADD_LANDOWNER_ORGANISATION_CONSERVATION_COVENANT, {
        organisation,
        legalAgreementType,
        err: Object.values(organisationError),
        organisationNameError: organisationError?.organisationNameError

      })
    }
    const landownerOrganisations = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENTS) ?? []

    if (id) {
      landownerOrganisations.splice(id, 1, organisation)
    } else {
      landownerOrganisations.push(organisation)
    }

    request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENTS, landownerOrganisations)
    return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.CHECK_LANDOWNERS)
  }

}

export default [{
  method: 'GET',
  path: constants.routes.ADD_LANDOWNER_ORGANISATION_CONSERVATION_COVENANT,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.ADD_LANDOWNER_ORGANISATION_CONSERVATION_COVENANT,
  handler: handlers.post
}]
