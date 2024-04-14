import constants from '../../utils/constants.js'

const getCustomizedHTML = (item, index) => {
  return {
    key: {
      text: item.fileName,
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
    const landOwnershipProofs = request.yar.get(constants.redisKeys.LAND_OWNERSHIP_PROOFS)
    const landOwnershipsList = (landOwnershipProofs || []).map((currElement, index) => getCustomizedHTML(currElement, index))

    // (Ref:BGNP-4124) Redirecting to the register land task list if there is no one file added.
    // And to avoid looping back navigation from upload ownership proof.
    const { referer } = request.headers || ''
    if (landOwnershipsList.length === 0) {
      if (referer && referer.indexOf(constants.routes.LAND_OWNERSHIP_PROOF_LIST) > -1) {
        return h.redirect(constants.routes.REGISTER_LAND_TASK_LIST)
      } else {
        return h.redirect(constants.routes.UPLOAD_LAND_OWNERSHIP)
      }
    }

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

    if (addAnotherOwnershipProof === 'yes' && landOwnershipProofs.length > 0) {
      request.yar.set(constants.redisKeys.LAND_OWNERSHIP_PROOF_LIST_KEY, addAnotherOwnershipProof)
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
