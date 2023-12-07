import developerConstants from './developer-constants.js'
import creditsEstimationConstants from '../credits/constants.js'
import registrationConstants from './loj-constants.js'

const {
  ENABLE_ROUTE_SUPPORT_FOR_GEOSPATIAL,
  ENABLE_ROUTE_SUPPORT_FOR_ADDITIONAL_EMAIL,
  ENABLE_ROUTE_SUPPORT_FOR_DEV_JOURNEY,
  ENABLE_ROUTE_SUPPORT_FOR_CREDIT_ESTIMATION_JOURNEY,
  ENABLE_ROUTE_SUPPORT_FOR_REGISTRATION_JOURNEY
} = process.env

// Disabled routes for MVP
const CHECK_GEOSPATIAL_FILE = 'land/check-geospatial-file'
const UPLOAD_GEOSPATIAL_LAND_BOUNDARY = 'land/upload-geospatial-file'
const GEOSPATIAL_LAND_BOUNDARY = 'land/geospatial-land-boundary'
const CHOOSE_LAND_BOUNDARY_UPLOAD = 'land/choose-land-boundary-upload'
const DEVELOPER_EMAIL_ENTRY = 'developer/email-entry'

const geospatialRoutes = {
  CHECK_GEOSPATIAL_FILE,
  UPLOAD_GEOSPATIAL_LAND_BOUNDARY,
  GEOSPATIAL_LAND_BOUNDARY,
  CHOOSE_LAND_BOUNDARY_UPLOAD
}

const additionalEmailRoutes = {
  DEVELOPER_EMAIL_ENTRY
}

const enabledRoutes = {
  ...(ENABLE_ROUTE_SUPPORT_FOR_GEOSPATIAL === 'Y' ? geospatialRoutes : {}),
  ...(ENABLE_ROUTE_SUPPORT_FOR_ADDITIONAL_EMAIL === 'Y' ? additionalEmailRoutes : {}),
  ...(ENABLE_ROUTE_SUPPORT_FOR_DEV_JOURNEY === 'Y' ? developerConstants.routes : {}),
  ...(ENABLE_ROUTE_SUPPORT_FOR_CREDIT_ESTIMATION_JOURNEY === 'Y' ? creditsEstimationConstants.routes : {}),
  ...(ENABLE_ROUTE_SUPPORT_FOR_REGISTRATION_JOURNEY === 'Y' ? registrationConstants.routes : {})
}

export default enabledRoutes
