import constants from '../../utils/constants.js'
import { getLegalAgreementDocumentType, getValidReferrerUrl } from '../../utils/helpers.js'

const getCustomizedHTML = (item, index) => {
  if (item.type === constants.individualOrOrganisationTypes.INDIVIDUAL) {
    const textToDisplay = `${item.firstName} ${item.lastName} (${item.emailAddress})`
    return {
      key: {
        text: textToDisplay,
        classes: 'govuk-summary-list govuk-!-font-weight-regular hmrc-list-with-actions hmrc-list-with-actions--short'
      },
      actions: {
        items: [{
          href: `${constants.routes.ADD_LANDOWNER_INDIVIDUAL}?id=${index}`,
          text: 'Change'
        }, {
          href: `${constants.routes.REMOVE_LANDOWNER}?id=${index}`,
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
          href: `${constants.routes.ADD_LANDOWNER_ORGANISATION}?id=${index}`,
          text: 'Change'
        }, {
          href: `${constants.routes.REMOVE_LANDOWNER}?id=${index}`,
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
    const landOwnerConservationConvenantsWithAction = landOwnerConservationConvenants.map((currElement, index) => getCustomizedHTML(currElement, index))

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

    if (addAnotherLandowner === 'yes') {
      request.yar.set(constants.redisKeys.ADDED_LANDOWNERS_CHECKED, addAnotherLandowner)
      const referrerUrl = getValidReferrerUrl(request.yar, constants.LAND_LEGAL_AGREEMENT_VALID_REFERRERS)
      return h.redirect(referrerUrl || constants.routes.HABITAT_PLAN_LEGAL_AGREEMENT)
    }

    return h.redirect(constants.routes.LANDOWNER_INDIVIDUAL_ORGANISATION)
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
