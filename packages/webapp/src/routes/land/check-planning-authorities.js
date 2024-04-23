import constants from '../../utils/constants.js'
import {
  getLegalAgreementDocumentType,
  getValidReferrerUrl
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
    const { addAnotherPlanningAuthority } = request.payload
    const lpaList = request.yar.get(constants.redisKeys.PLANNING_AUTHORTITY_LIST)
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    if (!addAnotherPlanningAuthority) {
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
    if (addAnotherPlanningAuthority === 'yes') {
      request.yar.set(constants.redisKeys.PLANNING_AUTHORITIES_CHECKED, addAnotherPlanningAuthority)
      const referrerUrl = getValidReferrerUrl(request, constants.LAND_LEGAL_AGREEMENT_VALID_REFERRERS)
      return h.redirect(referrerUrl || constants.routes.ANY_OTHER_LANDOWNERS)
    }
    if (addAnotherPlanningAuthority === 'no') {
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
