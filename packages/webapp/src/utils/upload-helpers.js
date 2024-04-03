import { getMaximumFileSizeExceededView } from './helpers.js'

const maximumFileSizeExceeded = (h, fileId, fileView) => {
  return getMaximumFileSizeExceededView({
    h,
    href: fileId,
    maximumFileSize: process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB,
    view: fileView
  })
}

export { maximumFileSizeExceeded }
