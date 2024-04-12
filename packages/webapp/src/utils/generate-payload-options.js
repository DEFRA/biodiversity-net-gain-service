import { processErrorUpload, maximumFileSizeExceeded } from './upload-error-handler.js'

function generatePayloadOptions (href, maximumFileSize, view) {
  // TODO: delete console.log when you have tested the new function
  console.log('Hello from generatePayloadOptions, ', 'href: ' + href, 'maxFileSize: ' + maximumFileSize, 'view: ' + view)
  return {
    payload: {
      maxBytes: (parseInt(maximumFileSize) + 1) * 1024 * 1024,
      multipart: true,
      timeout: false,
      output: 'stream',
      parse: false,
      allow: 'multipart/form-data',
      failAction: (request, h, err) => {
        console.log('Hello from failAction')
        // TODO: can i eventually get this first if statement moved into the upload-error-handler.js file?
        // For some reason it doesn't return the correct error when i try to move it
        if (err.output.statusCode === 413) { // Request entity too large
          console.log('Hello from failAction: statusCode 413 Request entity too large')
          return maximumFileSizeExceeded(h, href, maximumFileSize, view).takeover()
        } else if (err) {
          // will this ever be hit? I don't think so... can we ensure that we forward to processErrorUpload
          // in the upload-error-handler.js file instead and handle the file size error there?
          console.log('Hello from failAction: err')
          return processErrorUpload(err, h, href, maximumFileSize, view).takeover()
        } else {
          console.log('Hello from failAction: else')
          throw err
        }
      }
    }
  }
}

export { generatePayloadOptions }
