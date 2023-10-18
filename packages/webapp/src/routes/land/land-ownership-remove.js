import constants from '../../utils/constants.js'
import path from 'path'
// import { processRegistrationTask } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    // processRegistrationTask(request, {
    //   taskTitle: 'Legal information',
    //   title: 'Legal party remove'
    // }, {
    //   inProgressUrl: constants.routes.LAND_OWNERSHIP_REMOVE
    // })

    const { id } = request.query

    const landOwnerships = request.yar.get(constants.redisKeys.LAND_OWNERSHIP_PROOFS)
    const ownershipProofToRemove = landOwnerships[id]

    return h.view(constants.views.LAND_OWNERSHIP_REMOVE, {
      ownershipProofToRemove
    })
  },
  post: async (request, h) => {
    const { id } = request.query
    const { ownershipProofRemove } = request.payload
    const landOwnerships = request.yar.get(constants.redisKeys.LAND_OWNERSHIP_PROOFS)

    if (!ownershipProofRemove) {
      const ownershipProofToRemove = landOwnerships[id]
      const filename = path.basename(landOwnerships[id]?.location) || ""
      return h.view(constants.views.LAND_OWNERSHIP_REMOVE, {
        ownershipProofToRemove,
        err: [{
          text: `Select yes if you want to remove ${filename} as proof of land ownership`,
          href: '#remove-op-yes'
        }]
      })
    }

    if (ownershipProofRemove === 'yes') {
      landOwnerships.splice(id, 1)
      request.yar.set(constants.redisKeys.LAND_OWNERSHIP_PROOFS, landOwnerships)
    }
    return h.redirect(landOwnerships.length > 0 ? constants.routes.LAND_OWNERSHIP_LIST : constants.routes.UPLOAD_LAND_OWNERSHIP)
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
