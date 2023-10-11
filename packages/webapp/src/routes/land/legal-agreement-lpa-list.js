import constants from '../../utils/constants.js'
import {
  processRegistrationTask,
  getLegalAgreementDocumentType,
  buildFullName
} from '../../utils/helpers.js'

const getCustomizedHTML = (item, index) => {
  const value = (item.type === 'individual')
    ? buildFullName(item)
    : item.value

  const changeLink = (item.type === 'individual') ? constants.routes.ADD_LANDOWNER_INDIVIDUAL : constants.routes.ADD_LANDOWNER_ORGANISATION

  return {
    key: {
      text: value,
      classes: 'govuk-summary-list govuk-!-font-weight-regular hmrc-list-with-actions hmrc-list-with-actions--short'
    },
    actions: {
      items: [{
        href: `${changeLink}?id=${index}`,
        text: 'Change'
      }, {
        href: `${constants.routes.LEGAL_AGREEMENT_LPA_REMOVE}?id=${index}`,
        text: 'Remove'
      }],
      classes: 'govuk-summary-list__key govuk-!-font-weight-regular hmrc-summary-list__key'
    },
    class: 'govuk-summary-list__row'
  }
}
const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Add legal agreement details'
    }, {
      inProgressUrl: constants.routes.LEGAL_AGREEMENT_LPA_LIST
    })

    const lpaList = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LPA_LIST)

    const lpaListItems = []
    lpaList && Object.values(lpaList).forEach(lpa => lpaListItems.push(lpa))

    const legalAgreementLpaListWithAction = lpaListItems.map((currElement, index) => getCustomizedHTML(currElement, index))
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()

    return h.view(constants.views.LEGAL_AGREEMENT_LPA_LIST, {
      lpaList,
      legalAgreementLpaListWithAction,
      legalAgreementType
    })
  },
  post: async (request, h) => {
    const { allLpa } = request.payload

    const legalAgreementLpaList = request.yar.get(constants.redisKeys.ALL_LPA)
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()

    if (!allLpa) {
      return h.view(constants.views.LEGAL_AGREEMENT_LPA_LIST, {
        legalAgreementLpaList,
        legalAgreementType,
        routes: constants.routes,
        err: [{
          text: 'Select yes if you have added all landowners or leaseholders',
          href: '#allLpa'
        }]
      })
    }

    if (allLpa === 'yes') {
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.ADD_LEGAL_AGREEMENT_PARTIES)
    }

    if (allLpa === 'no') {
      return h.redirect(constants.routes.LEGAL_PARTY_ADD_TYPE)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.LEGAL_AGREEMENT_LPA_LIST,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.LEGAL_AGREEMENT_LPA_LIST,
  handler: handlers.post
}]
