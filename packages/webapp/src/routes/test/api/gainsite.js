import constants from '../../../utils/constants.js'

const statuses = ['active', 'registered', 'rejected', 'removed', 'inactive', 'internally-removed', 'default-error']

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

    const gainsiteStatus = status[0].toUpperCase() + status.slice(1).toLowerCase()

    return {
      gainsiteStatus,
      gainsiteNumber: bgsNumber,
      habitats: [
        {
          habitatId: 'HAB-12345678-ABCDE'
        },
        {
          habitatId: 'HAB-87654321-EDCBA'
        }
      ]
    }
  }
}]
