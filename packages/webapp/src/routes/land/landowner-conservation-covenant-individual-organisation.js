import constants from '../../utils/constants.js'
import { processRegistrationTask, getLegalAgreementDocumentType } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Add legal agreement details'
    }, {
      inProgressUrl: constants.routes.LANDOWNER_CONSERVATION_COVENANT_INDIVIDUAL_ORGANISATION
    })
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    return h.view(constants.views.LANDOWNER_CONSERVATION_COVENANT_INDIVIDUAL_ORGANISATION, {
      legalAgreementType
    })
  },
  post: async (request, h) => {
    const { individualOrOrganisation } = request.payload
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    if (!individualOrOrganisation) {
      return h.view(constants.views.LANDOWNER_CONSERVATION_COVENANT_INDIVIDUAL_ORGANISATION, {
        legalAgreementType,
        err: [{
          text: 'Select if the landowner or leaseholder is an individual or organisation',
          href: '#individualOrOrganisation'
        }]
      })
    }
    if (individualOrOrganisation === constants.individualOrOrganisationTypes.INDIVIDUAL) {
      return h.redirect(constants.routes.ADD_LANDOWNER_INDIVIDUAL_CONSERVATION_COVENANT)
    } else {
      return h.redirect(constants.routes.ADD_LANDOWNER_ORGANISATION_CONSERVATION_COVENANT)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.LANDOWNER_CONSERVATION_COVENANT_INDIVIDUAL_ORGANISATION,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.LANDOWNER_CONSERVATION_COVENANT_INDIVIDUAL_ORGANISATION,
  handler: handlers.post
}]
