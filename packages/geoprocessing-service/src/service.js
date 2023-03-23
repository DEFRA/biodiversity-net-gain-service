import { CoordinateSystemValidationError, ValidationError, uploadGeospatialLandBoundaryErrorCodes } from '@defra/bng-errors-lib'
import OsGridRef, { LatLon } from 'geodesy/osgridref.js'
import { getDBConnection } from '@defra/bng-utils-lib'
import { isPolygonInEnglandOnly } from './helpers/db-queries.js'
import path from 'path'
import dirname from './helpers/dirname.cjs'

const OSGB26_SRS_AUTHORITY_CODE = '27700'
const WGS84_SRS_AUTHORITY_CODE = '4326'

const ostn15FormatFilePath = path.join(dirname, '../', 'ntv2-format-files/', 'OSTN15_NTv2_OSGBtoETRS.gsb')
const wgs84ToOsgb36ReprojectionArgs = [
  '-f', 'GEOJSON',
  '-a_srs', `EPSG:${OSGB26_SRS_AUTHORITY_CODE}`,
  '-s_srs', '+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs',
  '-t_srs', `+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +units=m +no_defs +nadgrids=${ostn15FormatFilePath}`
]

const processLandBoundary = async (logger, config) => {
  let dataset
  let outputDataset
  const bufferDistance = config.bufferDistance || 500
  try {
    // Workaround for https://github.com/naturalatlas/node-gdal/issues/207.
    // The published solution does not appear to be effective for unit tests
    // associated with this module.
    //
    // Load the module that links to GDAL dynamically so that unit tests
    // mocking this module do not load attempt to load the native module that
    // links to GDAL.
    //
    // This allows the unit test file associated with this file to be the only
    // unit test file that loads the native module linking to GDAL.
    const gdal = (await import('gdal-async')).default
    if (config.gdalEnvVars) {
      setGdalConfig(gdal, config.gdalEnvVars)
    }
    try {
      dataset = await gdal.openAsync(config.inputLocation)
    } catch (err) {
      logger.error(err)
      throw new ValidationError(uploadGeospatialLandBoundaryErrorCodes.INVALID_UPLOAD, 'The uploaded land boundary must use a valid GeoJSON, Geopackage or Shape file')
    }
    await validateDataset(dataset, config)

    if (config.outputLocation) {
      outputDataset = await gdal.vectorTranslateAsync(config.outputLocation, dataset)
      logger.info(`Land boundary has been converted and written to ${config.outputLocation} `)
    }

    // Return the configuration used to display the boundary on a map.
    return await createMapConfig(dataset, bufferDistance, gdal)
  } catch (err) {
    logger.error(err)
    throw err
  } finally {
    closeDatasetIfNeeded(dataset)
    closeDatasetIfNeeded(outputDataset)
  }
}

const closeDatasetIfNeeded = dataset => {
  if (dataset) {
    try {
      dataset.close()
    } catch (error) {
      // Do nothing
    }
  }
}

const validateDataset = async (dataset, config) => {
  // Check that one layer is present and uses a supported coordinate reference system containing one feature.
  if (await dataset.layers.countAsync() === 1) {
    await validateLayer(await dataset.layers.getAsync(0), dataset, config)
  } else {
    throw new ValidationError(uploadGeospatialLandBoundaryErrorCodes.INVALID_LAYER_COUNT, 'Land boundaries must contain a single layer')
  }
}

const validateLayer = async (layer, dataset, config) => {
  const errorMessage = 'Missing coordinate reference system - geospatial uploads must use the OSGB36 or WGS84 coordinate reference system'
  let layerToValidate = layer
  let osgb36Dataset

  try {
    if (layer.srs) {
      validateSpatialReferenceSystem(layer.srs)
      if (layer.srs.getAuthorityCode(null) === WGS84_SRS_AUTHORITY_CODE) {
        osgb36Dataset = await reprojectFromWgs84ToOsgb36IfPossible(dataset, config)
        layerToValidate = await osgb36Dataset.layers.getAsync(0)
      }
      await validateFeatures(layerToValidate.features)
    } else {
      throw new ValidationError(uploadGeospatialLandBoundaryErrorCodes.MISSING_COORDINATE_SYSTEM, errorMessage)
    }
  } finally {
    closeDatasetIfNeeded(osgb36Dataset)
  }
}

const validateSpatialReferenceSystem = srs => {
  const authorityCode = srs.getAuthorityCode(null)
  if (authorityCode !== OSGB26_SRS_AUTHORITY_CODE && authorityCode !== WGS84_SRS_AUTHORITY_CODE) {
    throw new CoordinateSystemValidationError(
      authorityCode, uploadGeospatialLandBoundaryErrorCodes.INVALID_COORDINATE_SYSTEM, 'Land boundaries must use the OSGB36 or WGS84 coordinate reference system')
  }
}

const validateFeatures = async features => {
  if (await features.countAsync() === 1) {
    const feature = await features.firstAsync()
    await validateFeature(feature)
  } else {
    throw new ValidationError(uploadGeospatialLandBoundaryErrorCodes.INVALID_FEATURE_COUNT, 'Land boundaries must contain a single feature')
  }
}

const validateFeature = async feature => {
  const geometry = feature.getGeometry()
  const geometryAsGeoJson = geometry.toObject()
  const geometryToValidate = geometryAsGeoJson

  let db
  try {
    db = await getDBConnection()
    const result = await isPolygonInEnglandOnly(db, [geometryToValidate])
    const polygonIsInEnglandOnly = result?.rows[0]?.fn_is_polygon_in_england_only_27700
    if (!polygonIsInEnglandOnly) {
      throw new ValidationError(uploadGeospatialLandBoundaryErrorCodes.OUTSIDE_ENGLAND, 'Land boundaries must be located in England only')
    }
  } finally {
    db?.end()
  }
}

const getGridRef = (centroid, projection) => {
  if (projection === OSGB26_SRS_AUTHORITY_CODE) {
    const osGridRef = new OsGridRef(centroid.x, centroid.y)
    return osGridRef.toString()
  } else {
    const latLon = new LatLon(centroid.y, centroid.x)
    const coordinates = latLon.toOsGrid()
    return coordinates.toString()
  }
}

const createMapConfig = async (dataset, bufferDistance, gdal) => {
  const layer = await dataset.layers.getAsync(0)
  const authorityCode = layer.srs.getAuthorityCode()
  const feature = await layer.features.firstAsync()
  const featureGeometry = feature.getGeometry().clone()
  const featureGeometryForArea = feature.getGeometry().clone()
  const featureCentroid = feature.getGeometry().centroid().clone()

  if (authorityCode === WGS84_SRS_AUTHORITY_CODE) {
    // Reproject the geometry for display on a map.
    await featureGeometry.transformToAsync(gdal.SpatialReference.fromEPSGA(3857))
    await featureGeometryForArea.transformToAsync(gdal.SpatialReference.fromEPSGA(27700))
  }

  const bufferedGeometry = await featureGeometry.bufferAsync(bufferDistance)
  const envelope = await bufferedGeometry.getEnvelopeAsync()
  const area = await featureGeometryForArea.getArea()
  const { units: areaUnits } = await featureGeometryForArea.srs.getLinearUnits()
  const centroid = JSON.parse(featureGeometry.centroid().toJSON()).coordinates
  const gridRef = getGridRef(featureCentroid, authorityCode)

  return {
    epsg: authorityCode === '4326' ? '3857' : authorityCode,
    extent: [envelope.minX, envelope.minY, envelope.maxX, envelope.maxY],
    hectares: areaUnits === 'metre' ? area / 10000 : undefined,
    centroid,
    area,
    areaUnits,
    gridRef
  }
}

const setGdalConfig = (gdal, config) => {
  Object.keys(config).forEach(key => {
    gdal.config.set(key, config[key])
  })
}

const reprojectFromWgs84ToOsgb36 = async (dataset, config) => {
  const gdal = (await import('gdal-async')).default
  const reprojectedDatasetName = config.reprojectedOutputLocation
  const reprojectedDataset = await gdal.vectorTranslateAsync(reprojectedDatasetName, dataset, wgs84ToOsgb36ReprojectionArgs)
  // Generated in memory datasets seem to need reopening to provide access to all of their data.
  closeDatasetIfNeeded(reprojectedDataset)
  return gdal.openAsync(reprojectedDatasetName)
}

const reprojectFromWgs84ToOsgb36IfPossible = async (dataset, config) => {
  try {
    return Promise.resolve(await reprojectFromWgs84ToOsgb36(dataset, config))
  } catch (err) {
    // If a reprojection from WGS84 to OSGB36 fails, it is probable that the coordinates are outside
    // the area covered by OSGB36.
    throw new ValidationError(
      uploadGeospatialLandBoundaryErrorCodes.OUTSIDE_ENGLAND,
      'Land boundaries must be located in England only',
      { cause: err })
  }
}

export { processLandBoundary }
