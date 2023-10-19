import constants from '../../utils/constants.js'
import path from 'path'
import { processRegistrationTask } from '../../utils/helpers.js'

const getCustomizedHTML = (item, index) => {
  return {
    key: {
      text: path.basename(item.location),
      classes: 'govuk-summary-list govuk-!-font-weight-regular hmrc-list-with-actions hmrc-list-with-actions--short'
    },
    actions: {
      items: [{
        href: `${constants.routes.LAND_OWNERSHIP_REMOVE}?id=${index}`,
        text: 'Remove',
        visuallyHiddenText: 'Remove ' + path.basename(item.location) + ' from the list'
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
      inProgressUrl: constants.routes.LAND_OWNERSHIP_LIST
    })

    const landOwnershipProofs = request.yar.get(constants.redisKeys.LAND_OWNERSHIP_PROOFS)
    const landOwnershipsList = (landOwnershipProofs || []).map((currElement, index) => getCustomizedHTML(currElement, index))

    return h.view(constants.views.LAND_OWNERSHIP_LIST, {
      landOwnershipsList,
      landOwnershipProofs
    })
  },
  post: async (request, h) => {
    const { addAnotherOwnershipProof } = request.payload
    const landOwnershipProofs = request.yar.get(constants.redisKeys.LAND_OWNERSHIP_PROOFS)

    if (!addAnotherOwnershipProof) {
      return h.view(constants.views.LAND_OWNERSHIP_LIST, {
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
  path: constants.routes.LAND_OWNERSHIP_LIST,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.LAND_OWNERSHIP_LIST,
  handler: handlers.post
}]
