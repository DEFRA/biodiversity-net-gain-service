import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const { id } = request.query

    const landOwnershipProofs = request.yar.get(constants.cacheKeys.LAND_OWNERSHIP_PROOFS) || []
    const ownershipProofToRemove = landOwnershipProofs[id]?.fileName

    if (!ownershipProofToRemove) {
      return h.redirect(constants.routes.LAND_OWNERSHIP_PROOF_LIST)
    }

    return h.view(constants.views.LAND_OWNERSHIP_REMOVE, {
      ownershipProofToRemove
    })
  },
  post: async (request, h) => {
    const { id } = request.query
    let { ownershipProofToRemove } = request.payload
    const landOwnershipProofs = request.yar.get(constants.cacheKeys.LAND_OWNERSHIP_PROOFS) || []

    if (!ownershipProofToRemove) {
      ownershipProofToRemove = landOwnershipProofs[id].fileName
      return h.view(constants.views.LAND_OWNERSHIP_REMOVE, {
        ownershipProofToRemove,
        err: [{
          text: `Select yes if you want to remove ${landOwnershipProofs[id].fileName} as proof of land ownership`,
          href: '#remove-op-yes'
        }]
      })
    }

    if (landOwnershipProofs.length > 0 && ownershipProofToRemove === 'yes') {
      landOwnershipProofs.splice(id, 1)
      request.yar.set(constants.cacheKeys.LAND_OWNERSHIP_PROOFS, landOwnershipProofs)
    }
    return h.redirect(landOwnershipProofs.length > 0 ? constants.routes.LAND_OWNERSHIP_PROOF_LIST : constants.routes.UPLOAD_LAND_OWNERSHIP)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.LAND_OWNERSHIP_REMOVE,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.LAND_OWNERSHIP_REMOVE,
  handler: handlers.post
}]
