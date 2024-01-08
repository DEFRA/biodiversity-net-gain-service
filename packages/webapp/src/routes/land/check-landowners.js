import constants from '../../utils/constants.js'
import { processRegistrationTask, getLegalAgreementDocumentType } from '../../utils/helpers.js'

const getTableData = (landOwnerConservationConvenants) => {
  const rows = landOwnerConservationConvenants.map((item, index) => {
    const name = item.type === constants.landownerTypes.INDIVIDUAL
      ? `${item.firstName} ${item.middleNames ? item.middleNames + ' ' : ''}${item.lastName})`
      : item.organisationName

    const actionsHtml = `
      <a href="${constants.routes.ADD_LANDOWNER_INDIVIDUAL_CONSERVATION_COVENANT}?id=${index}" class="govuk-link" style="border-right: 1px solid #000; padding-right: 8px; margin-right: 8px;">Change</a>
      <a href="${constants.routes.REMOVE_LANDOWNER}?id=${index}" class="govuk-link" style="padding-left: 8px;">Remove</a>
    `

    return [
      { html: name },
      { html: actionsHtml }
    ]
  })

  return { rows }
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
    const tableData = getTableData(landOwnerConservationConvenants)

    return h.view(constants.views.CHECK_LANDOWNERS, {
      tableData,
      landOwnerConservationConvenants,
      legalAgreementType: getLegalAgreementDocumentType(
        request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE)
      )?.toLowerCase(),
      routes: constants.routes
    })
  },
  post: async (request, h) => {
    const { addAnotherLandowner } = request.payload
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE)
    )?.toLowerCase()
    const landOwnerConservationConvenants = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS)

    if (!addAnotherLandowner) {
      const tableData = getTableData(landOwnerConservationConvenants)
      return h.view(constants.views.CHECK_LANDOWNERS, {
        tableData,
        legalAgreementType,
        landOwnerConservationConvenants,
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
