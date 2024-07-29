import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { processSuccessfulUpload, processErrorUpload, maximumFileSizeExceeded } from '../../utils/developer-upload-metric.js'
import { addRedirectViewUsed } from '../../utils/redirect-view-handler.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.DEVELOPER_UPLOAD_METRIC),
  post: async (request, h) => {
    const uploadConfig = buildConfig({
      sessionId: request.yar.id,
      fileExt: constants.metricFileExt,
      maxFileSize: parseInt(process.env.MAX_METRIC_UPLOAD_MB) * 1024 * 1024,
      uploadType: constants.uploadTypes.DEVELOPER_METRIC_UPLOAD_TYPE,
      postProcess: true
    })

    try {
      const result = await uploadFile(request.logger, request, uploadConfig)
      return await processSuccessfulUpload(result, request, h, constants.views.DEVELOPER_UPLOAD_METRIC)
    } catch (err) {
      request.logger.error(`${new Date().toUTCString()} Problem uploading file ${err}`)
      return processErrorUpload(err, h, constants.views.DEVELOPER_UPLOAD_METRIC)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_UPLOAD_METRIC,
  handler: addRedirectViewUsed(handlers.get)
},
{
  method: 'POST',
  path: constants.routes.DEVELOPER_UPLOAD_METRIC,
  config: {
    handler: addRedirectViewUsed(handlers.post),
    payload: {
      maxBytes: (parseInt(process.env.MAX_METRIC_UPLOAD_MB) + 1) * 1024 * 1024,
      output: 'stream',
      parse: false,
      multipart: true,
      timeout: false,
      allow: 'multipart/form-data',
      failAction: (_request, h, err) => {
        if (err.output.statusCode === 413) {
          return maximumFileSizeExceeded(h, constants.views.DEVELOPER_UPLOAD_METRIC).takeover()
        } else {
          throw err
        }
      }
    }
  }
}
]
