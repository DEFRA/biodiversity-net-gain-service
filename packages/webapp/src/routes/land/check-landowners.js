import constants from '../../utils/constants.js'
import { processRegistrationTask, getLegalAgreementDocumentType } from '../../utils/helpers.js'

const getCustomizedHTML = (item, index) => {
  if (item.type === 'individual') {
    const textToDisplay = `${item.firstName} ${item.middleNames ? item.middleNames + ' ' : ''}${item.lastName}`
    return {
      key: {
        text: textToDisplay,
        classes: 'govuk-summary-list govuk-!-font-weight-regular hmrc-list-with-actions hmrc-list-with-actions--short'
      },
      actions: {
        items: [{
          href: `${constants.routes.ADD_LANDOWNER_INDIVIDUAL_CONSERVATION_COVENANT}?id=${index}`,
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
    const textToDisplay = item.organisationName

    return {
      key: {
        text: textToDisplay,
        classes: 'govuk-summary-list govuk-!-font-weight-regular hmrc-list-with-actions hmrc-list-with-actions--short'
      },
      actions: {
        items: [{
          href: `${constants.routes.ADD_LANDOWNER_ORGANISATION_CONSERVATION_COVENANT}?id=${index}`,
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
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Add legal agreement details'
    }, {
      inProgressUrl: constants.routes.CHECK_LANDOWNERS
    })

    const landOwnerConservationConvenants = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS)
    const landOwnerConservationConvenantsWithAction = landOwnerConservationConvenants.map((currElement, index) => getCustomizedHTML(currElement, index))

    const { ADD_LANDOWNER_INDIVIDUAL_CONSERVATION_COVENANT, REMOVE_LANDOWNER } = constants.routes
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()

    return h.view(constants.views.CHECK_LANDOWNERS, {
      landOwnerConservationConvenantsWithAction,
      landOwnerConservationConvenants,
      legalAgreementType,
      routes: { ADD_LANDOWNER_INDIVIDUAL_CONSERVATION_COVENANT, REMOVE_LANDOWNER }
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
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.HABITAT_PLAN_LEGAL_AGREEMENT)
    }

    return h.redirect(constants.routes.LANDOWNER_CONSERVATION_COVENANT_INDIVIDUAL_ORGANISATION)
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
