import constants from '../../utils/constants.js'
import { getLegalAgreementDocumentType } from '../../utils/helpers.js'
import { getNextStep } from '../../journey-validation/task-list-generator.js'

const getCustomizedHTML = (item, index, isCombinedCase) => {
  if (item.type === constants.individualOrOrganisationTypes.INDIVIDUAL) {
    const textToDisplay = `${item.firstName} ${item.lastName} (${item.emailAddress})`
    return {
      key: {
        text: textToDisplay,
        classes: 'govuk-summary-list govuk-!-font-weight-regular hmrc-list-with-actions hmrc-list-with-actions--short'
      },
      actions: {
        items: [{
          href: `${isCombinedCase ? constants.reusedRoutes.COMBINED_CASE_ADD_LANDOWNER_INDIVIDUAL : constants.routes.ADD_LANDOWNER_INDIVIDUAL}?id=${index}`,
          text: 'Change'
        }, {
          href: `${isCombinedCase ? constants.reusedRoutes.COMBINED_CASE_REMOVE_LANDOWNER : constants.routes.REMOVE_LANDOWNER}?id=${index}`,
          text: 'Remove'
        }],
        classes: 'govuk-summary-list__key govuk-!-font-weight-regular hmrc-summary-list__key'
      },
      class: 'govuk-summary-list__row'
    }
  } else {
    const textToDisplay = `${item.organisationName} (${item.emailAddress})`

    return {
      key: {
        text: textToDisplay,
        classes: 'govuk-summary-list govuk-!-font-weight-regular hmrc-list-with-actions hmrc-list-with-actions--short'
      },
      actions: {
        items: [{
          href: `${isCombinedCase ? constants.reusedRoutes.COMBINED_CASE_ADD_LANDOWNER_ORGANISATION : constants.routes.ADD_LANDOWNER_ORGANISATION}?id=${index}`,
          text: 'Change'
        }, {
          href: `${isCombinedCase ? constants.reusedRoutes.COMBINED_CASE_REMOVE_LANDOWNER : constants.routes.REMOVE_LANDOWNER}?id=${index}`,
          text: 'Remove'
        }],
        classes: 'govuk-summary-list__key govuk-!-font-weight-regular hmrc-summary-list__key'
      },
      class: 'govuk-summary-list__row'
    }
  }
}
const handlers = {
  get: async (request, h) => {
    const landOwnerConservationConvenants = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS)
    if (landOwnerConservationConvenants.length === 0) {
      return h.redirect(constants.routes.NEED_ADD_ALL_LANDOWNERS)
    }
    const isCombinedCase = (request?._route?.path || '').startsWith('/combined-case')
    const landOwnerConservationConvenantsWithAction = landOwnerConservationConvenants.map((currElement, index) => getCustomizedHTML(currElement, index, isCombinedCase))

    const { ADD_LANDOWNER_INDIVIDUAL, REMOVE_LANDOWNER } = constants.routes
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()

    return h.view(constants.views.CHECK_LANDOWNERS, {
      landOwnerConservationConvenantsWithAction,
      landOwnerConservationConvenants,
      legalAgreementType,
      routes: { ADD_LANDOWNER_INDIVIDUAL, REMOVE_LANDOWNER }
    })
  },
  post: async (request, h) => {
    const { addAnotherLandowner } = request.payload
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    const landOwnerConservationConvenants = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS)
    if (!addAnotherLandowner) {
      const landOwnerConservationConvenantsWithAction = landOwnerConservationConvenants.map((currElement, index) => getCustomizedHTML(currElement, index))

      return h.view(constants.views.CHECK_LANDOWNERS, {
        landOwnerConservationConvenants,
        landOwnerConservationConvenantsWithAction,
        legalAgreementType,
        routes: constants.routes,
        err: [{
          text: 'Select yes if you have added all landowners or leaseholders',
          href: '#addAnotherLandowner'
        }]
      })
    }
    return getNextStep(request, h)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_LANDOWNERS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_LANDOWNERS,
  handler: handlers.post
}]
