import constants from '../../../utils/constants.js'

// Active - when a Gain Site is in the system but has not yet been approved and is not yet on the Public Register
// Registered - when a Gain Site application has been approved and is on the PR
// Rejected - when a Gain Site application was rejected and the Gain Site is not on the PR
// Removed - when a previously registered Gain Site has been removed from the PR
// Inactive - a Gain Site status would be Inactive if the

const statuses = ['active', 'registered', 'rejected', 'removed', 'inactive']

export default [{
  method: 'GET',
  path: `${constants.routes.TEST_API_GAINSITE}/{gainSiteNumber}`,
  options: {
    auth: false
  },
  handler: async (request, h) => {
    const bgsNumber = request.params.gainSiteNumber

    if (bgsNumber === 'doesNotExist') {
      return h.response({
        error: 'Gain site number not found'
      }).code(404)
    }

    let status

    if (statuses.includes(bgsNumber)) {
      status = bgsNumber
    } else {
      status = 'registered'
    }

    return {
      status,
      bgs: bgsNumber
    }
  }
}]
