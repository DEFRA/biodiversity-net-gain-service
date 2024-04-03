import { getMaximumFileSizeExceededView } from './helpers.js'

const maximumFileSizeExceeded = (h, fileId, maxSize, fileView) => {
  return getMaximumFileSizeExceededView({
    h,
    href: fileId,
    maximumFileSize: maxSize,
    view: fileView
  })
}

export { maximumFileSizeExceeded }
