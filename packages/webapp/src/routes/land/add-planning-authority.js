import constants from '../../utils/constants.js'
import { getLpaNames } from '../../utils/get-lpas.js'
import {
  processRegistrationTask,
  getLegalAgreementDocumentType,
  checkForDuplicate,
  validateIdGetSchemaOptional
} from '../../utils/helpers.js'
const filePathAndName = './src/utils/ref-data/lpas-names-and-ids.json'

const handlers = {
  get: (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Add legal agreement details'
    }, {
      inProgressUrl: constants.routes.ADD_PLANNING_AUTHORITY
    })

    const { id } = request.query
    const lpaNames = getLpaNames(filePathAndName)

    request.yar.set(constants.cacheKeys.REF_LPA_NAMES, lpaNames)
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.cacheKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    const lpaList = request.yar.get(constants.cacheKeys.PLANNING_AUTHORTITY_LIST)

    let localPlanningAuthority
    if (id) {
      localPlanningAuthority = lpaList[id]
    }

    return h.view(constants.views.ADD_PLANNING_AUTHORITY, {
      localPlanningAuthority,
      legalAgreementType,
      lpaNames
    })
  },
  post: (request, h) => {
    const { id } = request.query
    const { localPlanningAuthority } = request.payload
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.cacheKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    const selectedLpa = Array.isArray(localPlanningAuthority) ? localPlanningAuthority[0] : localPlanningAuthority
    const lpaList = request.yar.get(constants.cacheKeys.PLANNING_AUTHORTITY_LIST) ?? []
    let localPlanningAuthorityNameErr
    const refLpaNames = request.yar.get(constants.cacheKeys.REF_LPA_NAMES) ?? []

    if (!selectedLpa) {
      localPlanningAuthorityNameErr = [{
        text: 'Enter a local planning authority',
        href: 'localPlanningAuthority'
      }]
      return h.view(constants.views.ADD_PLANNING_AUTHORITY, {
        err: Object.values(localPlanningAuthorityNameErr),
        localPlanningAuthorityNameErr,
        legalAgreementType,
        lpaNames: refLpaNames
      })
    }

    if (refLpaNames.length > 0 && !refLpaNames.includes(selectedLpa)) {
      const localPlanningAuthorityNameErr = [{
        text: 'Enter a valid local planning authority',
        href: 'localPlanningAuthority'
      }]
      return h.view(constants.views.ADD_PLANNING_AUTHORITY, {
        err: Object.values(localPlanningAuthorityNameErr),
        localPlanningAuthorityNameErr,
        legalAgreementType,
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
      return h.view(constants.views.ADD_PLANNING_AUTHORITY, {
        err: Object.values(duplicateError),
        localPlanningAuthorityNameErr,
        legalAgreementType,
        lpaNames: refLpaNames
      })
    }
    if (id) {
      lpaList.splice(id, 1, selectedLpa)
    } else {
      lpaList.push(selectedLpa)
    }
    request.yar.set(constants.cacheKeys.PLANNING_AUTHORTITY_LIST, lpaList)
    return h.redirect(constants.routes.CHECK_PLANNING_AUTHORITIES)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.ADD_PLANNING_AUTHORITY,
  handler: handlers.get,
  options: validateIdGetSchemaOptional
}, {
  method: 'POST',
  path: constants.routes.ADD_PLANNING_AUTHORITY,
  handler: handlers.post,
  options: validateIdGetSchemaOptional
}]
