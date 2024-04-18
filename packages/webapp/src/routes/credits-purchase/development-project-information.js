import creditsConstants from '../../utils/credits-purchase-constants.js'
import constants from '../../utils/loj-constants.js'
import { getLpaNames } from '../../utils/get-lpas.js'
import {
  validateIdGetSchemaOptional
} from '../../utils/helpers.js'
const filePathAndName = './src/utils/ref-data/lpas-names-and-ids.json'

const handlers = {
  get: (request, h) => {
    const lpaNames = getLpaNames(filePathAndName)

    request.yar.set(constants.redisKeys.REF_LPA_NAMES, lpaNames)

    const selectedLpa = request.yar.get(creditsConstants.redisKeys.CREDITS_PURCHASE_PLANNING_AUTHORITY_LIST)
    const planningApplicationRef = request.yar.get(creditsConstants.redisKeys.CREDITS_PURCHASE_PLANNING_APPLICATION_REF)
    const developmentName = request.yar.get(creditsConstants.redisKeys.CREDITS_PURCHASE_DEVELOPMENT_NAME)

    return h.view(creditsConstants.views.CREDITS_PURCHASE_DEVELOPMENT_PROJECT_INFORMATION, {
      selectedLpa,
      lpaNames,
      planningApplicationRef,
      developmentName
    })
  },
  post: (request, h) => {
    const { localPlanningAuthority, planningApplicationRef, developmentName } = request.payload
    const refLpaNames = request.yar.get(constants.redisKeys.REF_LPA_NAMES) ?? []
    const { lpaList, errors } = lpaHandler(localPlanningAuthority, refLpaNames, request, h)

    if (!planningApplicationRef) {
      errors.planningApplicationRefError = {
        text: 'Enter a planning application reference',
        href: 'planningApplicationRef'
      }
    }

    if (!developmentName) {
      errors.developmentNameError = {
        text: 'Enter a development reference',
        href: 'developmentName'
      }
    }

    if (errors && Object.values(errors).some((el) => el !== undefined)) {
      const err = []
      Object.keys(errors).forEach(item => {
        err.push(errors[item])
      })

      // If there are no errors in local planning authority then we want to show what user selected
      let selectedLpa
      if (!errors?.emptyLocalPlanningAuthority || !errors?.invalidLocalPlanningAuthorityError) {
        selectedLpa = lpaList[0]
      }

      return h.view(creditsConstants.views.CREDITS_PURCHASE_DEVELOPMENT_PROJECT_INFORMATION, {
        err,
        errors,
        lpaNames: refLpaNames,
        selectedLpa,
        planningApplicationRef,
        developmentName
      })
    } else {
      request.yar.set(creditsConstants.redisKeys.CREDITS_PURCHASE_PLANNING_AUTHORITY_LIST, lpaList)
      request.yar.set(creditsConstants.redisKeys.CREDITS_PURCHASE_PLANNING_APPLICATION_REF, planningApplicationRef)
      request.yar.set(creditsConstants.redisKeys.CREDITS_PURCHASE_DEVELOPMENT_NAME, developmentName)
      return h.redirect(creditsConstants.routes.CREDITS_PURCHASE_TASK_LIST)
    }
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
 * @returns {Object} Object containing List of Local planning authorities selected and errors
 */
const lpaHandler = (localPlanningAuthority, refLpaNames, request, h) => {
  const selectedLpa = Array.isArray(localPlanningAuthority) ? localPlanningAuthority[0] : localPlanningAuthority
  const lpaList = request.yar.get(creditsConstants.redisKeys.CREDITS_PURCHASE_PLANNING_AUTHORITY_LIST) ?? []
  const errors = {}

  if (!selectedLpa) {
    errors.emptyLocalPlanningAuthority = {
      text: 'Enter a local planning authority',
      href: 'localPlanningAuthorityErr'
    }

    return { lpaList, errors }
  }

  if (refLpaNames.length > 0 && !refLpaNames.includes(selectedLpa)) {
    errors.invalidLocalPlanningAuthorityError = {
      text: 'Enter a valid local planning authority',
      href: 'localPlanningAuthorityErr'
    }

    return { lpaList, errors }
  }

  /* lpaList in this case always has only 1 item.
  The reason its an array is because view(select-local-planning-authority.html) is reused and other place its used requires it to be an array */
  lpaList[0] = selectedLpa

  return { lpaList, errors }
}
