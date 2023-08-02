import { getMaximumFileSizeExceededView } from './helpers.js'

export function generatePayloadOptions (href, maximumFileSize, view) {
  return {
    payload: {
      maxBytes: (parseInt(maximumFileSize) + 1) * 1024 * 1024,
      multipart: true,
      timeout: false,
      output: 'stream',
      parse: false,
      allow: 'multipart/form-data',
      failAction: (request, h, err) => {
        console.log('File upload too large', request.path)
        if (err.output.statusCode === 413) { // Request entity too large
          return maximumFileSizeExceeded(h, href, maximumFileSize, view).takeover()
        } else {
          throw err
        }
      }
    }
  }
}

export const maximumFileSizeExceeded = (h, href, maximumFileSize, view) => {
  return getMaximumFileSizeExceededView({
    h,
    href: href,
    maximumFileSize: maximumFileSize,
    view: view
  })
}
