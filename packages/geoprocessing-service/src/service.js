import { CoordinateSystemValidationError, ValidationError, uploadGeospatialLandBoundaryErrorCodes } from '@defra/bng-errors-lib'
import OsGridRef, { LatLon } from 'geodesy/osgridref.js'

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
    await validateDataset(dataset)

    if (config.outputLocation) {
      outputDataset = await gdal.vectorTranslateAsync(config.outputLocation, dataset)
      logger.info(`Land boundary has been converted and written to ${config.outputLocation} `)
    }

    // Return the configuration used to display the boundary on a map.
    return await createMapConfig(dataset, bufferDistance, gdal)
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

const validateDataset = async dataset => {
  // Check that one layer is present and uses a supported coordinate reference system containing one feature.
  if (await dataset.layers.countAsync() === 1) {
    await validateLayer(await dataset.layers.getAsync(0))
  } else {
    throw new ValidationError(uploadGeospatialLandBoundaryErrorCodes.INVALID_LAYER_COUNT, 'Land boundaries must contain a single layer')
  }
}

const validateLayer = async layer => {
  const errorMessage = 'Missing coordinate reference system - geospatial uploads must use the OSGB36 or WGS84 coordinate reference system'
  if (layer.srs) {
    validateSpatialReferenceSystem(layer.srs)
    await validateFeatures(layer.features)
  } else {
    throw new ValidationError(uploadGeospatialLandBoundaryErrorCodes.MISSING_COORDINATE_SYSTEM, errorMessage)
  }
}

const validateSpatialReferenceSystem = srs => {
  const authorityCode = srs.getAuthorityCode(null)
  if (authorityCode !== '27700' && authorityCode !== '4326') {
    throw new CoordinateSystemValidationError(
      authorityCode, uploadGeospatialLandBoundaryErrorCodes.INVALID_COORDINATE_SYSTEM, 'Land boundaries must use the OSGB36 or WGS84 coordinate reference system')
  }
}

const validateFeatures = async features => {
  if (await features.countAsync() !== 1) {
    throw new ValidationError(uploadGeospatialLandBoundaryErrorCodes.INVALID_FEATURE_COUNT, 'Land boundaries must contain a single feature')
  }
}

const getGridRef = (centroid, projection) => {
  if (projection === '27700') {
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

  if (authorityCode === '4326') {
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

export { processLandBoundary }
