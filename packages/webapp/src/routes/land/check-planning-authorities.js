import constants from '../../utils/constants.js'
import {
  processRegistrationTask,
  getLegalAgreementDocumentType
} from '../../utils/helpers.js'

const getCustomizedHTML = (item, index) => {
  return {
    key: {
      text: item,
      classes: 'govuk-summary-list govuk-!-font-weight-regular hmrc-list-with-actions hmrc-list-with-actions--short'
    },
    actions: {
      items: [{
        href: `${constants.routes.ADD_PLANNING_AUTHORITY}?id=${index}`,
        text: 'Change'
      }, {
        href: `${constants.routes.REMOVE_LOCAL_PLANNING_AUTHORITY}?id=${index}`,
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
      inProgressUrl: constants.routes.CHECK_PLANNING_AUTHORITIES
    })

    const lpaList = request.yar.get(constants.redisKeys.PLANNING_AUTHORTITY_LIST)

    if (lpaList && lpaList.length === 0) {
      return h.redirect(constants.routes.NEED_ADD_ALL_PLANNING_AUTHORITIES)
    }
    const lpaListItems = []
    lpaList && Object.values(lpaList).forEach(lpa => lpaListItems.push(lpa))

    const lpaListWithAction = lpaListItems.map((currElement, index) => getCustomizedHTML(currElement, index))
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()

    return h.view(constants.views.CHECK_PLANNING_AUTHORITIES, {
      lpaList,
      lpaListWithAction,
      legalAgreementType
    })
  },
  post: async (request, h) => {
    const { addAnotherplanningAuthority } = request.payload

    const lpaList = request.yar.get(constants.redisKeys.PLANNING_AUTHORTITY_LIST)
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()

    if (!addAnotherplanningAuthority) {
      return h.view(constants.views.CHECK_PLANNING_AUTHORITIES, {
        lpaList,
        legalAgreementType,
        routes: constants.routes,
        err: [{
          text: 'Select yes if you have added all local planning authorities',
          href: '#addAnotherLocalPlanningAuthority'
        }]
      })
    }

    if (addAnotherplanningAuthority === 'yes') {
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.NEED_ADD_ALL_LANDOWNERS_CONSERVATION_COVENANT)
    }

    if (addAnotherplanningAuthority === 'no') {
      return h.redirect(constants.routes.ADD_PLANNING_AUTHORITY)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_PLANNING_AUTHORITIES,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_PLANNING_AUTHORITIES,
  handler: handlers.post
}]
