import constants from '../../utils/constants.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import { getValidReferrerUrl } from '../../utils/helpers.js'
const handlers = {
  get: async (request, h) => {
    const isHabitatIncludeLegalAgreement = request.yar.get(constants.redisKeys.HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO)
    return h.view(constants.views.HABITAT_PLAN_LEGAL_AGREEMENT, { isHabitatIncludeLegalAgreement })
  },
  post: async (request, h) => {
    const { isHabitatIncludeLegalAgreement } = request.payload
    if (!isHabitatIncludeLegalAgreement) {
      return h.view(constants.views.HABITAT_PLAN_LEGAL_AGREEMENT, {

        routes: constants.routes,
        err: [{
          text: 'Select yes if the habitat management and monitoring plan is included in the legal agreement',
          href: '#isHabitatIncludeLegalAgreement'
        }]
      })
    }
    if (isHabitatIncludeLegalAgreement === 'Yes') {
      request.yar.set(constants.redisKeys.HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO, isHabitatIncludeLegalAgreement)
      const habitatPlanLocation = request.yar.get(constants.redisKeys.HABITAT_PLAN_LOCATION)
      await deleteBlobFromContainers(habitatPlanLocation)
      request.yar.clear(constants.redisKeys.HABITAT_PLAN_LOCATION)
      request.yar.set(constants.redisKeys.HABITAT_PLAN_FILE_OPTION, 'no')
      const referrerUrl = getValidReferrerUrl(request, constants.LAND_LEGAL_AGREEMENT_VALID_REFERRERS)
      return h.redirect(referrerUrl || constants.routes.ENHANCEMENT_WORKS_START_DATE)
    }
    request.yar.set(constants.redisKeys.HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO, 'No')
    return h.redirect(constants.routes.UPLOAD_HABITAT_PLAN)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.HABITAT_PLAN_LEGAL_AGREEMENT,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.HABITAT_PLAN_LEGAL_AGREEMENT,
  handler: handlers.post
}]
