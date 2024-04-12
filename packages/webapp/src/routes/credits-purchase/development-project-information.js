import creditsConstants from '../../utils/credits-purchase-constants.js'
import constants from '../../utils/loj-constants.js'
import { getLpaNames } from '../../utils/get-lpas.js'
import {
  checkForDuplicate,
  validateIdGetSchemaOptional
} from '../../utils/helpers.js'
const filePathAndName = './src/utils/ref-data/lpas-names-and-ids.json'

const handlers = {
  get: (request, h) => {
    const { id } = request.query
    const lpaNames = getLpaNames(filePathAndName)

    request.yar.set(constants.redisKeys.REF_LPA_NAMES, lpaNames)

    const lpaList = request.yar.get(creditsConstants.redisKeys.CREDITS_PURCHASE_PLANNING_AUTHORITY_LIST)

    let localPlanningAuthority
    if (id) {
      localPlanningAuthority = lpaList[id]
    }

    return h.view(creditsConstants.views.CREDITS_PURCHASE_DEVELOPMENT_PROJECT_INFORMATION, {
      localPlanningAuthority,
      lpaNames
    })
  },
  post: (request, h) => {
    const { id } = request.query
    const { localPlanningAuthority } = request.payload

    const selectedLpa = Array.isArray(localPlanningAuthority) ? localPlanningAuthority[0] : localPlanningAuthority
    const lpaList = request.yar.get(creditsConstants.redisKeys.CREDITS_PURCHASE_PLANNING_AUTHORITY_LIST) ?? []
    let localPlanningAuthorityNameErr
    const refLpaNames = request.yar.get(constants.redisKeys.REF_LPA_NAMES) ?? []

    if (!selectedLpa) {
      localPlanningAuthorityNameErr = [{
        text: 'Enter a local planning authority',
        href: 'localPlanningAuthority'
      }]
      return h.view(creditsConstants.views.CREDITS_PURCHASE_DEVELOPMENT_PROJECT_INFORMATION, {
        err: Object.values(localPlanningAuthorityNameErr),
        localPlanningAuthorityNameErr,
        lpaNames: refLpaNames
      })
    }

    if (refLpaNames.length > 0 && !refLpaNames.includes(selectedLpa)) {
      const localPlanningAuthorityNameErr = [{
        text: 'Enter a valid local planning authority',
        href: 'localPlanningAuthority'
      }]
      return h.view(creditsConstants.views.CREDITS_PURCHASE_DEVELOPMENT_PROJECT_INFORMATION, {
        err: Object.values(localPlanningAuthorityNameErr),
        localPlanningAuthorityNameErr,
        lpaNames: refLpaNames
      })
    }

    const excludeIndex = id !== undefined ? parseInt(id, 10) : null
    const duplicateError = checkForDuplicate(
      lpaList,
      null,
      selectedLpa,
      '#localPlanningAuthority',
      'This local planning authority has already been added - enter a different local planning authority, if there is one',
      excludeIndex
    )
    if (duplicateError) {
      return h.view(creditsConstants.views.CREDITS_PURCHASE_DEVELOPMENT_PROJECT_INFORMATION, {
        err: Object.values(duplicateError),
        localPlanningAuthorityNameErr,
        lpaNames: refLpaNames
      })
    }
    if (id) {
      lpaList.splice(id, 1, selectedLpa)
    } else {
      lpaList.push(selectedLpa)
    }
    request.yar.set(creditsConstants.redisKeys.CREDITS_PURCHASE_PLANNING_AUTHORITY_LIST, lpaList)
    return h.redirect(creditsConstants.routes.CHECK_PLANNING_AUTHORITIES)
  }
}

export default [{
  method: 'GET',
  path: creditsConstants.routes.CREDITS_PURCHASE_DEVELOPMENT_PROJECT_INFORMATION,
  handler: handlers.get,
  options: validateIdGetSchemaOptional
}, {
  method: 'POST',
  path: creditsConstants.routes.CREDITS_PURCHASE_DEVELOPMENT_PROJECT_INFORMATION,
  handler: handlers.post,
  options: validateIdGetSchemaOptional
}]
