import developerConstants from './developer-constants.js'
<<<<<<< HEAD
import creditsEstimationConstants from './credits-estimation-constants.js'
=======
import constants from '../credits/constants.js'
>>>>>>> 64054453 (Updated folder and file structure)
import creditsPurchaseConstants from './credits-purchase-constants.js'

const {
  ENABLE_ROUTE_SUPPORT_FOR_GEOSPATIAL,
  ENABLE_ROUTE_SUPPORT_FOR_ADDITIONAL_EMAIL,
  ENABLE_ROUTE_SUPPORT_FOR_DEV_JOURNEY,
<<<<<<< HEAD
  ENABLE_ROUTE_SUPPORT_FOR_CREDIT_ESTIMATION_JOURNEY,
  ENABLE_ROUTE_SUPPORT_FOR_CREDIT_PURCHASE_JOURNEY
} = process.env
let disabledRoutes = {}
=======
  ENABLE_ROUTE_SUPPORT_FOR_CREDIT_ESTIMATION_JOURNEY
} = process.env
const disabledRoutes = {
  ...creditsPurchaseConstants.routes
}
>>>>>>> 64054453 (Updated folder and file structure)

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

if (ENABLE_ROUTE_SUPPORT_FOR_GEOSPATIAL === 'Y') {
  disabledRoutes = { ...disabledRoutes, ...geospatialRoutes }
}

if (ENABLE_ROUTE_SUPPORT_FOR_ADDITIONAL_EMAIL === 'Y') {
  disabledRoutes = { ...disabledRoutes, ...additionalEmailRoutes }
}

if (ENABLE_ROUTE_SUPPORT_FOR_DEV_JOURNEY === 'Y') {
  disabledRoutes = { ...disabledRoutes, ...developerConstants.routes }
}

if (ENABLE_ROUTE_SUPPORT_FOR_CREDIT_ESTIMATION_JOURNEY === 'Y') {
  disabledRoutes = { ...disabledRoutes, ...creditsEstimationConstants.routes }
}

if (ENABLE_ROUTE_SUPPORT_FOR_CREDIT_PURCHASE_JOURNEY === 'Y') {
  disabledRoutes = { ...disabledRoutes, ...creditsPurchaseConstants.routes }
}

export default disabledRoutes
