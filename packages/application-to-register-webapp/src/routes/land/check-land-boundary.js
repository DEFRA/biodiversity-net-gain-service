import constants from '../../utils/constants.js'
import path from 'path'
import { blobStorageConnector } from '@defra/bng-connectors-lib'

const href = 'check-upload-correct'
const handlers = {
  get: async (request, h) => {
    const context = await getContext(request)
    return h.view(constants.views.CHECK_LAND_BOUNDARY, context)
  },
  post: async (request, h) => {
    const checkLandBoundary = request.payload.checkLandBoundary
    const landBoundaryLocation = request.yar.get(constants.redisKeys.LAND_BOUNDARY_LOCATION)
    request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_CHECKED, checkLandBoundary)
    if (checkLandBoundary === 'no') {
      // delete the file from blob storage
      const config = {
        containerName: 'trusted',
        blobName: landBoundaryLocation
      }
      await blobStorageConnector.deleteBlobIfExists(config)
      request.yar.clear(constants.redisKeys.LEGAL_AGREEMENT_LOCATION)
      return h.redirect(constants.routes.UPLOAD_LAND_BOUNDARY)
    } else if (checkLandBoundary === 'yes') {
      return h.redirect('/' + constants.views.CHECK_LAND_BOUNDARY, {
        filename: landBoundaryLocation === null ? '' : path.basename(landBoundaryLocation),
        fileSize: request.yar.get(constants.redisKeys.LAND_BOUNDARY_FILE_SIZE),
        err: { text: '!TODO: Journey continuation not implemented' }
      })
    } else {
      return h.view(constants.views.CHECK_LAND_BOUNDARY, {
        filename: path.basename(landBoundaryLocation),
        err: [
          {
            text: 'Select yes if this is the correct file',
            href: href
          }
        ]
      })
      // return h.view(constants.views.CHECK_LAND_BOUNDARY, { filename: path.basename(legalAgreementLocation), err: { text: 'Select yes if this is the correct file' } })
    }
  }
}

const getContext = async request => {
  const fileLocation = request.yar.get(constants.redisKeys.LAND_BOUNDARY_LOCATION)
  return {
    filename: fileLocation === null ? '' : path.parse(fileLocation).base,
    fileSize: request.yar.get(constants.redisKeys.LAND_BOUNDARY_FILE_SIZE)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_LAND_BOUNDARY,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_LAND_BOUNDARY,
  handler: handlers.post
}]
