import { maximumFileSizeExceeded } from './upload-error-handler.js'

function generatePayloadOptions (href, maximumFileSize, view) {
  return {
    payload: {
      maxBytes: (parseInt(maximumFileSize) + 1) * 1024 * 1024,
      multipart: true,
      timeout: false,
      output: 'stream',
      parse: false,
      allow: 'multipart/form-data',
      failAction: (request, h, err) => {
        if (err.output.statusCode === 413) { // Request entity too large
          return maximumFileSizeExceeded(h, href, maximumFileSize, view).takeover()
        } else {
          throw err
        }
      }
    }
  }
}

export { generatePayloadOptions }
