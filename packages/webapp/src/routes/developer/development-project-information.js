import constants from '../../utils/constants.js'
import { getLpaNames } from '../../utils/get-lpas.js'
import {
  validateIdGetSchemaOptional
} from '../../utils/helpers.js'
import { getNextStep } from '../../journey-validation/task-list-generator.js'
const filePathAndName = './src/utils/ref-data/lpas-names-and-ids.js'

const handlers = {
  get: (request, h) => {
    const lpaNames = getLpaNames(filePathAndName)

    const selectedLpa = request.yar.get(constants.redisKeys.DEVELOPER_PLANNING_AUTHORITY_LIST)
    const planningApplicationRef = request.yar.get(constants.redisKeys.DEVELOPER_PLANNING_APPLICATION_REF)
    const developmentName = request.yar.get(constants.redisKeys.DEVELOPER_DEVELOPMENT_NAME)
    return h.view(constants.views.DEVELOPER_DEVELOPMENT_PROJECT_INFORMATION, {
      selectedLpa,
      lpaNames,
      planningApplicationRef,
      developmentName
    })
  },
  post: (request, h) => {
    const { localPlanningAuthority, planningApplicationRef, developmentName } = request.payload

    const lpaNames = getLpaNames(filePathAndName) ?? []
    const selectedLpa = Array.isArray(localPlanningAuthority) ? localPlanningAuthority[0] : localPlanningAuthority

    const errors = lpaErrorHandler(selectedLpa, lpaNames)

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

      return h.view(constants.views.DEVELOPER_DEVELOPMENT_PROJECT_INFORMATION, {
        err,
        errors,
        lpaNames,
        selectedLpa,
        planningApplicationRef,
        developmentName
      })
    } else {
      request.yar.set(constants.redisKeys.DEVELOPER_PLANNING_AUTHORITY_LIST, selectedLpa)
      request.yar.set(constants.redisKeys.DEVELOPER_PLANNING_APPLICATION_REF, planningApplicationRef)
      request.yar.set(constants.redisKeys.DEVELOPER_DEVELOPMENT_NAME, developmentName)
      return getNextStep(request, h)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_DEVELOPMENT_PROJECT_INFORMATION,
  handler: handlers.get,
  options: validateIdGetSchemaOptional
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_DEVELOPMENT_PROJECT_INFORMATION,
  handler: handlers.post,
  options: validateIdGetSchemaOptional
}]

/**
 * Handles Local Planning Authority errors
 * @param {string} selectedLpa
 * @param {Array<string>} lpaNames
 * @returns {Object} Local planning authority errors object
 */
const lpaErrorHandler = (selectedLpa, lpaNames) => {
  const errors = {}

  if (!selectedLpa) {
    errors.emptyLocalPlanningAuthority = {
      text: 'Enter a local planning authority',
      href: '#localPlanningAuthority'
    }

    return errors
  }

  if (lpaNames.length > 0 && !lpaNames.includes(selectedLpa)) {
    errors.invalidLocalPlanningAuthorityError = {
      text: 'Enter a valid local planning authority',
      href: '#localPlanningAuthority'
    }

    return errors
  }

  return errors
}
