const ABOUT = 'about'
const CONFIRM_GEOSPATIAL_LAND_BOUNDARY = 'confirm-geospatial-land-boundary'
const DOCUMENT_UPLOAD = 'documentUpload'
const ERROR = 'error'
const GEOSPATIAL_DATA = 'geospatialData'
const GEOSPATIAL_LAND_BOUNDARY = 'geospatial-land-boundary'
const LAND_BOUNDARY_LOCATION = 'land-boundary-location'
const LAND_BOUNDARY_MAP_CONFIG = 'land-boundary-map-config'
const LAND_BOUNDARY_UPLOAD_TYPE = 'land-boundary-upload-type'
const OS_API_TOKEN = 'os-api-token'
const PUBLIC = 'public'
const SESSION = 'session'
const START = 'start'
const UPLOAD_GEOSPATIAL_LAND_BOUNDARY = 'upload-geospatial-land-boundary'

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
  GEOSPATIAL_LAND_BOUNDARY
}

const views = Object.assign({}, routes)

for (const [key, value] of Object.entries(routes)) {
  routes[key] = `/${value}`
}

export default Object.freeze({
  landBoundaryUploadTypes,
  redisKeys,
  routes,
  views,
  uploadTypes
})
