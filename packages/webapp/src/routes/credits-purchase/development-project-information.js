import creditsConstants from '../../utils/credits-purchase-constants.js'
import constants from '../../utils/loj-constants.js'
import { getLpaNames } from '../../utils/get-lpas.js'
import {
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
    const { localPlanningAuthority, planningApplicationRef, developmentName } = request.payload

    console.log('request.payload', request.payload)

    const lpaList = lpaHandler(localPlanningAuthority, id, request, h)

    request.yar.set(creditsConstants.redisKeys.CREDITS_PURCHASE_PLANNING_AUTHORITY_LIST, lpaList)
    return h.redirect(creditsConstants.routes.CREDITS_PURCHASE_TASK_LIST)
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

/**
 * Handles Local Planning Authority by validating request payload
 * @param {Object} localPlanningAuthority
 * @param {string} id
 * @param {Object} request
 * @param {Object} h
 * @returns {Array<Object>} List of Local planning authorities selected
 */
const lpaHandler = (localPlanningAuthority, id, request, h) => {
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

  if (id) {
    lpaList.splice(id, 1, selectedLpa)
  } else {
    lpaList.push(selectedLpa)
  }

  return lpaList
}
