import constants from '../../utils/constants.js'
import { processRegistrationTask } from '../../utils/helpers.js'

const getCustomizedHTML = (item, index) => {
  return {
    key: {
      text: item,
      classes: 'govuk-summary-list govuk-!-font-weight-regular hmrc-list-with-actions hmrc-list-with-actions--short'
    },
    actions: {
      items: [{
        href: `${constants.routes.LAND_OWNERSHIP_REMOVE}?id=${index}`,
        text: 'Remove',
        visuallyHiddenText: 'Remove ' + item + ' from the list'
      }],
      classes: 'govuk-summary-list__key govuk-!-font-weight-regular hmrc-summary-list__key'
    },
    class: 'govuk-summary-list__row'
  }
}
const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Land information',
      title: 'Add land ownership details'
    }, {
      inProgressUrl: constants.routes.LAND_OWNERSHIP_PROOF_LIST
    })

    const landOwnershipProofs = request.yar.get(constants.redisKeys.LAND_OWNERSHIP_PROOFS)
    const landOwnershipsList = (landOwnershipProofs || []).map((currElement, index) => getCustomizedHTML(currElement, index))

    return h.view(constants.views.LAND_OWNERSHIP_PROOF_LIST, {
      landOwnershipsList,
      landOwnershipProofs
    })
  },
  post: async (request, h) => {
    const { addAnotherOwnershipProof } = request.payload
    const landOwnershipProofs = request.yar.get(constants.redisKeys.LAND_OWNERSHIP_PROOFS)

    if (!addAnotherOwnershipProof) {
      return h.view(constants.views.LAND_OWNERSHIP_PROOF_LIST, {
        landOwnershipProofs,
        routes: constants.routes,
        err: [{
          text: 'Select yes if you have added all proof of land ownership files',
          href: '#add-another-op-yes'
        }]
      })
    }

    if (addAnotherOwnershipProof === 'yes') {
      processRegistrationTask(request, { taskTitle: 'Land information', title: 'Add land ownership details' }, { status: constants.COMPLETE_REGISTRATION_TASK_STATUS })
      return h.redirect(constants.routes.REGISTER_LAND_TASK_LIST)
    }

    return h.redirect(constants.routes.UPLOAD_LAND_OWNERSHIP)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.LAND_OWNERSHIP_PROOF_LIST,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.LAND_OWNERSHIP_PROOF_LIST,
  handler: handlers.post
}]
