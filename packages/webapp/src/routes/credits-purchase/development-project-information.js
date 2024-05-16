import creditsConstants from '../../utils/credits-purchase-constants.js'
import constants from '../../utils/loj-constants.js'
import { getLpaNames } from '../../utils/get-lpas.js'
import {
  validateIdGetSchemaOptional, getValidReferrerUrl
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
    const selectedLpa = Array.isArray(localPlanningAuthority) ? localPlanningAuthority[0] : localPlanningAuthority

    const errors = lpaErrorHandler(selectedLpa, refLpaNames)

    if (!planningApplicationRef) {
      errors.planningApplicationRefError = {
        text: 'Enter a planning application reference',
        href: '#planning-application-reference-value'
      }
    }

    if (!developmentName) {
      errors.developmentNameError = {
        text: 'Enter a development reference',
        href: '#development-name-value'
      }
    }

    if (errors && Object.values(errors).some((el) => el !== undefined)) {
      const err = []
      Object.keys(errors).forEach(item => {
        err.push(errors[item])
      })

      return h.view(creditsConstants.views.CREDITS_PURCHASE_DEVELOPMENT_PROJECT_INFORMATION, {
        err,
        errors,
        lpaNames: refLpaNames,
        selectedLpa,
        planningApplicationRef,
        developmentName
      })
    } else {
      request.yar.set(creditsConstants.redisKeys.CREDITS_PURCHASE_PLANNING_AUTHORITY_LIST, selectedLpa)
      request.yar.set(creditsConstants.redisKeys.CREDITS_PURCHASE_PLANNING_APPLICATION_REF, planningApplicationRef)
      request.yar.set(creditsConstants.redisKeys.CREDITS_PURCHASE_DEVELOPMENT_NAME, developmentName)
      const referrerUrl = getValidReferrerUrl(request.yar, ['/credits-purchase/check-and-submit'])
      return h.redirect(referrerUrl || creditsConstants.routes.CREDITS_PURCHASE_TASK_LIST)
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
 * Handles Local Planning Authority errors
 * @param {string} selectedLpa
 * @param {Array<string>} refLpaNames
 * @returns {Object} Local planning authority errors object
 */
const lpaErrorHandler = (selectedLpa, refLpaNames) => {
  const errors = {}

  if (!selectedLpa) {
    errors.emptyLocalPlanningAuthority = {
      text: 'Enter and select a local planning authority',
      href: '#localPlanningAuthorityErr'
    }

    return errors
  }

  if (refLpaNames.length > 0 && !refLpaNames.includes(selectedLpa)) {
    errors.invalidLocalPlanningAuthorityError = {
      text: 'Enter a valid local planning authority',
      href: '#invalidLocalPlanningAuthorityError'
    }

    return errors
  }

  return errors
}
