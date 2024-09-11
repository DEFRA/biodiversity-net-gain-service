import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { processSuccessfulUpload, processErrorUpload, maximumFileSizeExceeded } from '../../utils/developer-upload-metric.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'

const handlers = {
  get: async (request, h) => {
    const applicationType = request.yar.get(constants.redisKeys.APPLICATION_TYPE)
    return h.view(constants.views.COMBINED_CASE_UPLOAD_ALLOCATION_METRIC, {
      isAllocation: applicationType === constants.applicationTypes.ALLOCATION
    })
  },
  post: async (request, h) => {
    const metricUploadLocation = request.yar.get(constants.redisKeys.DEVELOPER_METRIC_LOCATION)

    if (metricUploadLocation) {
      await deleteBlobFromContainers(metricUploadLocation)
      request.yar.clear(constants.redisKeys.DEVELOPER_METRIC_LOCATION)
      request.yar.clear(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER)
      request.yar.clear(constants.redisKeys.DEVELOPER_OFF_SITE_GAIN_CONFIRMED)
      request.yar.clear(constants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS)
      request.yar.clear(constants.redisKeys.COMBINED_CASE_MATCH_AVAILABLE_HABITATS_COMPLETE)
    }

    const uploadConfig = buildConfig({
      sessionId: request.yar.id,
      fileExt: constants.metricFileExt,
      maxFileSize: parseInt(process.env.MAX_METRIC_UPLOAD_MB) * 1024 * 1024,
      uploadType: constants.uploadTypes.DEVELOPER_METRIC_UPLOAD_TYPE,
      postProcess: true
    })

    try {
      const result = await uploadFile(request.logger, request, uploadConfig)
      return await processSuccessfulUpload(result, request, h, constants.views.COMBINED_CASE_UPLOAD_ALLOCATION_METRIC)
    } catch (err) {
      request.logger.error(`${new Date().toUTCString()} Problem uploading file ${err}`)
      return processErrorUpload(err, h, constants.views.COMBINED_CASE_UPLOAD_ALLOCATION_METRIC)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.COMBINED_CASE_UPLOAD_ALLOCATION_METRIC,
  handler: handlers.get
},
{
  method: 'POST',
  path: constants.routes.COMBINED_CASE_UPLOAD_ALLOCATION_METRIC,
  config: {
    handler: handlers.post,
    payload: {
      maxBytes: (parseInt(process.env.MAX_METRIC_UPLOAD_MB) + 1) * 1024 * 1024,
      output: 'stream',
      parse: false,
      multipart: true,
      timeout: false,
      allow: 'multipart/form-data',
      failAction: (_request, h, err) => {
        if (err.output.statusCode === 413) {
          return maximumFileSizeExceeded(h, constants.views.COMBINED_CASE_UPLOAD_ALLOCATION_METRIC).takeover()
        } else {
          throw err
        }
      }
    }
  }
}
]
