const ABOUT = 'about'
const CONFIRM_GEOSPATIAL_LAND_BOUNDARY = 'land/confirm-land-boundary'
const DOCUMENT_UPLOAD = 'documentUpload'
const ERROR = 'error'
const GEOSPATIAL_DATA = 'geospatialData'
const GEOSPATIAL_LAND_BOUNDARY = 'land/geospatial-land-boundary'
const GEOSPATIAL_LAND_BOUNDARY_UPLOAD_TYPE = 'geospatial-land-boundary'
const LAND_BOUNDARY_LOCATION = 'land-boundary-location'
const LAND_BOUNDARY_MAP_CONFIG = 'land-boundary-map-config'
const LAND_BOUNDARY_UPLOAD_TYPE = 'land/choose-land-boundary-upload-option'
const NO = 'no'
const NO_AGAIN = 'noAgain'
const OS_API_TOKEN = 'land/os-api-token'
const PUBLIC = 'public'
const SESSION = 'session'
const START = 'start'
const UPLOAD_GEOSPATIAL_LAND_BOUNDARY = 'land/upload-geospatial-file'
const YES = 'yes'

const confirmLandBoundaryOptions = {
  NO,
  NO_AGAIN,
  YES
}
const landBoundaryUploadTypes = {
  GEOSPATIAL_DATA,
  DOCUMENT_UPLOAD
}

const redisKeys = {
  LAND_BOUNDARY_LOCATION,
  LAND_BOUNDARY_MAP_CONFIG,
  LAND_BOUNDARY_UPLOAD_TYPE
}

const routes = {
  ABOUT,
  ERROR,
  CONFIRM_GEOSPATIAL_LAND_BOUNDARY,
  GEOSPATIAL_LAND_BOUNDARY,
  LAND_BOUNDARY_UPLOAD_TYPE,
  OS_API_TOKEN,
  PUBLIC,
  SESSION,
  START,
  UPLOAD_GEOSPATIAL_LAND_BOUNDARY
}

const uploadTypes = {
  GEOSPATIAL_LAND_BOUNDARY_UPLOAD_TYPE
}

const views = Object.assign({}, routes)

for (const [key, value] of Object.entries(routes)) {
  routes[key] = `/${value}`
}

export default Object.freeze({
  confirmLandBoundaryOptions,
  landBoundaryUploadTypes,
  redisKeys,
  routes,
  views,
  uploadTypes
})
