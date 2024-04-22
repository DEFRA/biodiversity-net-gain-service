import processGeospatialLandBoundaryEvent from './helpers/process-geospatial-land-boundary-event.js'
import { CoordinateSystemValidationError, MalwareDetectedError, ThreatScreeningError, UploadTypeValidationError, ValidationError, uploadGeospatialLandBoundaryErrorCodes } from '@defra/bng-errors-lib'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'

const invalidUploadErrorText = 'The selected file must be a GeoJSON, Geopackage or Shape file'
const uploadGeospatialFileId = '#geospatialLandBoundary'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.UPLOAD_GEOSPATIAL_LAND_BOUNDARY, { maxFileSize: process.env.MAX_GEOSPATIAL_FILE_UPLOAD_MB })
  },
  post: async (request, h) => performUpload(request, h)
}

const performUpload = async (request, h) => {
  const config = buildConfig({
    sessionId: request.yar.id,
    uploadType: constants.uploadTypes.GEOSPATIAL_UPLOAD_TYPE,
    fileExt: constants.geospatialLandBoundaryFileExt,
    maxFileSize: parseInt(process.env.MAX_GEOSPATIAL_FILE_UPLOAD_MB) * 1024 * 1024,
    postProcess: true
  })

  config.fileValidationConfig.maximumDecimalPlaces = 4

  try {
    await deleteBlobFromContainers(request.yar.get(constants.redisKeys.GEOSPATIAL_UPLOAD_LOCATION, true))
    await deleteBlobFromContainers(request.yar.get(constants.redisKeys.ORIGINAL_GEOSPATIAL_UPLOAD_LOCATION, true))
    await deleteBlobFromContainers(request.yar.get(constants.redisKeys.REPROJECTED_GEOSPATIAL_UPLOAD_LOCATION, true))

    const geospatialData = await uploadFile(request.logger, request, config)
    processGeospatialLandBoundaryEvent(geospatialData.postProcess)

    const uploadedFileLocation = `${geospatialData.postProcess.location.substring(0, geospatialData.postProcess.location.lastIndexOf('/'))}/${geospatialData.filename}`
    const geoJsonFilename = geospatialData.postProcess.location.substring(geospatialData.postProcess.location.lastIndexOf('/') + 1)
    request.logger.info(`${new Date().toUTCString()} Received land boundary data for ${geoJsonFilename}`)

    if (!geospatialData.filename.endsWith('.geojson')) {
      // A GeoJSON file was not uploaded.
      // Store the location of the uploaded file so it and the transformed GeoJSON file can be removed if needed.
      request.yar.set(constants.redisKeys.ORIGINAL_GEOSPATIAL_UPLOAD_LOCATION, uploadedFileLocation)
    }

    if (geospatialData.postProcess.reprojectedLocation) {
      // A geospatial upload using the WGS84 Coordinate Reference System has been uploaded.
      // Store the location of the GeoJSON file that has been reprojected to the OSGB36 Coordinate Reference System
      // and its size so that they can be part of the application submission.
      request.yar.set(constants.redisKeys.REPROJECTED_GEOSPATIAL_UPLOAD_LOCATION, geospatialData.postProcess.reprojectedLocation)
      request.yar.set(constants.redisKeys.REPROJECTED_GEOSPATIAL_FILE_SIZE, geospatialData.postProcess.reprojectedFileSize)
    }

    request.yar.set(constants.redisKeys.GEOSPATIAL_UPLOAD_LOCATION, geospatialData.postProcess.location)
    request.yar.set(constants.redisKeys.LAND_BOUNDARY_MAP_CONFIG, geospatialData.postProcess.mapConfig)
    request.yar.set(constants.redisKeys.GEOSPATIAL_FILE_NAME, geospatialData.filename)
    request.yar.set(constants.redisKeys.GEOSPATIAL_FILE_SIZE, geospatialData.fileSize)
    request.yar.set(constants.redisKeys.GEOSPATIAL_FILE_TYPE, geospatialData.fileType)
    request.yar.set(constants.redisKeys.GEOSPATIAL_HECTARES, geospatialData.postProcess.mapConfig.hectares.toFixed(2))
    request.yar.set(constants.redisKeys.GEOSPATIAL_GRID_REFERENCE, geospatialData.postProcess.mapConfig.gridRef)

    // Clear out any land boundary data
    request.yar.clear(constants.redisKeys.LAND_BOUNDARY_FILE_SIZE)
    request.yar.clear(constants.redisKeys.LAND_BOUNDARY_FILE_TYPE)
    request.yar.clear(constants.redisKeys.LAND_BOUNDARY_GRID_REFERENCE)
    request.yar.clear(constants.redisKeys.LAND_BOUNDARY_HECTARES)
    await deleteBlobFromContainers(request.yar.get(constants.redisKeys.LAND_BOUNDARY_LOCATION))
    request.yar.clear(constants.redisKeys.LAND_BOUNDARY_LOCATION)
    return h.redirect(process.env.ENABLE_ROUTE_SUPPORT_FOR_GEOSPATIAL === 'Y' ? constants.routes.CHECK_GEOSPATIAL_FILE : constants.routes.CHECK_LAND_BOUNDARY_DETAILS)
  } catch (err) {
    const errorContext = getErrorContext(err)
    return h.view(constants.views.UPLOAD_GEOSPATIAL_LAND_BOUNDARY, { ...errorContext, maxFileSize: process.env.MAX_GEOSPATIAL_FILE_UPLOAD_MB })
  }
}

const getValidationErrorText = err => {
  let errorText

  switch (err.code) {
    case uploadGeospatialLandBoundaryErrorCodes.INVALID_FEATURE_COUNT:
      errorText = 'The selected file must only contain one polygon'
      break
    case uploadGeospatialLandBoundaryErrorCodes.INVALID_LAYER_COUNT:
      errorText = 'The selected file must only contain one layer'
      break
    case uploadGeospatialLandBoundaryErrorCodes.INVALID_UPLOAD:
      errorText = invalidUploadErrorText
      break
    case uploadGeospatialLandBoundaryErrorCodes.MISSING_COORDINATE_SYSTEM:
      errorText = 'The selected file must specify use of either the Ordnance Survey Great Britain 1936 (OSGB36) or World Geodetic System 1984 (WGS84) coordinate reference system'
      break
    case uploadGeospatialLandBoundaryErrorCodes.OUTSIDE_ENGLAND:
      errorText = 'Entire land boundary must be in England'
      break
    default:
      // An unexpected error code has been received so rethrow the error.
      throw err
  }

  return errorText
}

const processErrorMessage = (errorMessage, error) => {
  switch (errorMessage) {
    case constants.uploadErrors.noFile:
      error.err = [{
        text: 'Select a file showing the land boundary',
        href: uploadGeospatialFileId
      }]
      break
    case constants.uploadErrors.emptyFile:
      error.err = [{
        text: 'The selected file is empty',
        href: uploadGeospatialFileId
      }]
      break
    case constants.uploadErrors.maximumFileSizeExceeded:
      error.err = [{
        text: `The selected file must not be larger than ${process.env.MAX_GEOSPATIAL_FILE_UPLOAD_MB}MB`,
        href: uploadGeospatialFileId
      }]
      break
    default:
      error.err = [{
        text: constants.uploadErrors.uploadFailure,
        href: uploadGeospatialFileId
      }]
      break
  }
}

const getErrorContext = err => {
  const error = {}
  if (err instanceof CoordinateSystemValidationError) {
    error.err = [{
      text: 'The selected file must use either the Ordnance Survey Great Britain 1936 (OSGB36) or World Geodetic System 1984 (WGS84) coordinate reference system',
      href: uploadGeospatialFileId
    }]
  } else if (err instanceof ThreatScreeningError) {
    error.err = [{
      text: constants.uploadErrors.malwareScanFailed,
      href: uploadGeospatialFileId
    }]
  } else if (err instanceof UploadTypeValidationError || err.message === constants.uploadErrors.unsupportedFileExt) {
    error.err = [{
      text: invalidUploadErrorText,
      href: uploadGeospatialFileId
    }]
  } else if (err instanceof ValidationError) {
    error.err = [{
      text: getValidationErrorText(err),
      href: uploadGeospatialFileId
    }]
  } else if (err instanceof MalwareDetectedError) {
    error.err = [{
      text: constants.uploadErrors.threatDetected,
      href: uploadGeospatialFileId
    }]
  } else {
    processErrorMessage(err.message, error)
  }

  if (error.err) {
    // Prepare to redisplay the upload geospatial land boundary view with the configured error.
    return error
  } else {
    // An unexpected error has occurred. Rethrow it so that the default error page is returned.
    throw err
  }
}

export default [{
  method: 'GET',
  path: constants.routes.UPLOAD_GEOSPATIAL_LAND_BOUNDARY,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.UPLOAD_GEOSPATIAL_LAND_BOUNDARY,
  handler: handlers.post,
  options: {
    payload: {
      maxBytes: (parseInt(process.env.MAX_GEOSPATIAL_FILE_UPLOAD_MB) + 1) * 1024 * 1024,
      multipart: true,
      output: 'stream',
      parse: false,
      failAction: (request, h, err) => {
        request.logger.info(`${new Date().toUTCString()} File upload too large ${request.path}`)
        if (err.output.statusCode === 413) { // Request entity too large
          return h.view(constants.views.UPLOAD_GEOSPATIAL_LAND_BOUNDARY, {
            err: [
              {
                text: `The selected file must not be larger than ${process.env.MAX_GEOSPATIAL_FILE_UPLOAD_MB}MB`,
                href: uploadGeospatialFileId
              }
            ],
            maxFileSize: process.env.MAX_GEOSPATIAL_FILE_UPLOAD_MB
          }).takeover()
        } else {
          throw err
        }
      }
    }
  }
}]
