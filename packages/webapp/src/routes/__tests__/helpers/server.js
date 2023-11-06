import { createServer, init } from '../../../server.js'
import { getServer } from '../../../../.jest/setup.js'
import FormData from 'form-data'
import fs from 'fs'
import streamToPromise from 'stream-to-promise'
import { isUploadComplete } from '@defra/bng-azure-storage-test-utils'
import { CoordinateSystemValidationError, ThreatScreeningError, ValidationError, uploadGeospatialLandBoundaryErrorCodes, uploadWrittenConsentErrorCodes, MalwareDetectedError } from '@defra/bng-errors-lib'
import constants from '../../../utils/constants.js'
import onPreAuth from '../../../__mocks__/on-pre-auth.js'

jest.mock('../../../utils/file-post-process.js')

const startServer = async (options) => {
  const server = await createServer(options)
  await init(server)
  return server
}

const getExpectedErrorCode = (uploadConfig) => {
  if (uploadConfig.hasError !== undefined && uploadConfig.hasError) {
    return 200
  }
  if (uploadConfig.hasError !== undefined && !uploadConfig.hasError) {
    return 302
  } else if (uploadConfig.generateHandleEventsError || uploadConfig.generateUnexpectedValidationError || uploadConfig.generateFormDataError || !uploadConfig.filePath) {
    return 500
  }
  return 302
}

const uploadFile = async (uploadConfig) => {
  const expectedResponseCode = getExpectedErrorCode(uploadConfig)

  const formData = new FormData()

  if (uploadConfig.filePath) {
    const stream = fs.createReadStream(uploadConfig.filePath)
    formData.append(uploadConfig.formName, stream, uploadConfig.filePath)
  } else {
    formData.append(uploadConfig.formName, 'non-form data')
  }
  const requestHeaders = formData.getHeaders()
  if (uploadConfig.headers !== undefined) {
    Object.keys(uploadConfig.headers).forEach(header => {
      requestHeaders[header] = uploadConfig.headers[header]
    })
  }
  const payload = await streamToPromise(formData)
  const options = {
    url: uploadConfig.url,
    method: 'POST',
    headers: requestHeaders,
    payload
  }

  if (uploadConfig.generateFormDataError) {
    delete options.headers
  }

  const expectedNumberOfPostJsonCalls =
    uploadConfig.hasError ||
    uploadConfig.generateFormDataError ||
    uploadConfig.generateInvalidCoordinateReferenceSystemError ||
    uploadConfig.generateMissingCoordinateReferenceSystemError ||
    uploadConfig.generateInvalidLayerCountError ||
    uploadConfig.generateInvalidFeatureCountError ||
    uploadConfig.generateOutsideEnglandError ||
    uploadConfig.generateInvalidUploadError ||
    uploadConfig.generateUnexpectedValidationError ||
    uploadConfig.generateThreatDetectedError ||
    uploadConfig.generateThreatScreeningFailure ||
    uploadConfig.generateHandleEventsError
      ? 0
      : 1

  const { postProcess } = require('../../../utils/file-post-process.js')
  postProcess.mockImplementation(async (uploadType, blobName, containerName) => {
    let uploadComplete = await isUploadComplete('customer-uploads', blobName, 1000)
    if (uploadConfig.generateUploadTimeoutError) {
      uploadComplete = false
    }

    if (uploadConfig.generateInvalidCoordinateReferenceSystemError) {
      const errorMessage = 'The selected file must use either the Ordnance Survey Great Britain 1936 (OSGB36) or World Geodetic System 1984 (WGS84) coordinate reference system'
      throw new CoordinateSystemValidationError(
        'mockAuthorityCode', uploadGeospatialLandBoundaryErrorCodes.INVALID_COORDINATE_SYSTEM, errorMessage)
    } else if (uploadConfig.generateMissingCoordinateReferenceSystemError) {
      const errorMessage = 'The selected file must specify use of either the Ordnance Survey Great Britain 1936 (OSGB36) or World Geodetic System 1984 (WGS84) coordinate reference system'
      throw new ValidationError(uploadGeospatialLandBoundaryErrorCodes.MISSING_COORDINATE_SYSTEM, errorMessage)
    } else if (uploadConfig.generateInvalidLayerCountError) {
      const errorMessage = 'The selected file must only contain one layer'
      throw new ValidationError(uploadGeospatialLandBoundaryErrorCodes.INVALID_LAYER_COUNT, errorMessage)
    } else if (uploadConfig.generateInvalidFeatureCountError) {
      const errorMessage = 'The selected file must only contain one polygon'
      throw new ValidationError(uploadGeospatialLandBoundaryErrorCodes.INVALID_FEATURE_COUNT, errorMessage)
    } else if (uploadConfig.generateOutsideEnglandError) {
      const errorMessage = 'Entire land boundary must be in England'
      throw new ValidationError(uploadGeospatialLandBoundaryErrorCodes.OUTSIDE_ENGLAND, errorMessage)
    } else if (uploadConfig.generateInvalidUploadError) {
      const errorMessage = 'The selected file must be a GeoJSON, Geopackage or Shape file'
      throw new ValidationError(uploadGeospatialLandBoundaryErrorCodes.INVALID_UPLOAD, errorMessage)
    } else if (uploadConfig.generateUnexpectedValidationError) {
      const errorMessage = 'Unexpected valdation error'
      throw new ValidationError('UNEXPECTED-ERROR-CODE', errorMessage)
    } else if (uploadConfig.generateThreatDetectedError) {
      throw new MalwareDetectedError(constants.uploadErrors.threatDetected)
    } else if (uploadConfig.generateThreatScreeningFailure) {
      throw new ThreatScreeningError({
        Status: constants.threatScreeningStatusValues.FAILED_TO_VIRUS_SCAN
      })
    } else if (uploadConfig.generateHandleEventsError || !uploadComplete) {
      throw new Error(`Upload of ${uploadConfig.filePath} ${uploadConfig.generateHandleEventsError ? 'failed' : 'timed out'}`)
    } else if (uploadConfig.generateEmptyFileUploadError) {
      const errorMessage = 'The selected file is empty'
      throw new ValidationError(uploadWrittenConsentErrorCodes.EMPTY_FILE_UPLOAD, errorMessage)
    } else {
      return uploadConfig.postProcess
    }
  })

  if (uploadConfig.sessionData) await addOnPreAuth(uploadConfig.sessionData)
  const response = await submitRequest(options, expectedResponseCode, { expectedNumberOfPostJsonCalls })
  return response
}

const submitGetRequest = async (options, expectedResponseCode = 200, sessionData, config = { expectedNumberOfPostJsonCalls: sessionData && sessionData[constants.redisKeys.SAVE_APPLICATION_SESSION_ON_SIGNOUT_OR_JOURNEY_CHANGE] ? 1 : 0 }) => {
  await addOnPreAuth(sessionData)
  options.method = 'GET'
  return submitRequest(options, expectedResponseCode, config)
}

const submitPostRequest = async (options, expectedResponseCode = 302, sessionData, config = { expectedNumberOfPostJsonCalls: expectedResponseCode === 302 ? 1 : 0 }) => {
  if (sessionData && Object.keys(sessionData).length > 0) {
    await addOnPreAuth(sessionData)
  }
  options.method = 'POST'
  return submitRequest(options, expectedResponseCode, config)
}

const submitRequest = async (options, expectedResponseCode, config) => {
  // tests can pass in their own auth object
  if (!Object.prototype.hasOwnProperty.call(options, 'auth')) {
    // Add in some default credentials to pass authentication on routes
    options.auth = {
      strategy: 'session-auth',
      credentials: {
        account: {
          idTokenClaims: {
            firstName: 'John',
            lastName: 'Smith',
            email: 'john.smith@test.com',
            contactId: 'mock contact id'
          }
        }
      }
    }
  }

  const http = require('../../../utils/http.js')
  const spy = jest.spyOn(http, 'postJson')

  const response = await getServer().inject(options)
  expect(response.statusCode).toBe(expectedResponseCode)
  expect(spy).toHaveBeenCalledTimes(config.expectedNumberOfPostJsonCalls)
  return response
}

const addOnPreAuth = async (sessionData) => {
  // Add session injection using on pre auth functionality.
  // This shoud be done using a pre handler but only one pre handler can be registered
  // with a Hapi.js server.
  // Using on pre auth functionaliy is acceptable for testing purposes.
  await getServer().register(onPreAuth(sessionData))
}

export { startServer, submitGetRequest, submitPostRequest, uploadFile }
