import { CoordinateSystemValidationError, ValidationError } from '@defra/bng-errors-lib'

const processLandBoundary = async (logger, config) => {
  let dataset
  let geoJsonDataset
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
    dataset = await gdal.openAsync(config.inputLocation)
    await validateDataset(dataset)
    // The land boundary is valid so convert it to GeoJSON.
    geoJsonDataset = await gdal.vectorTranslateAsync(config.outputLocation, dataset)
    logger.log('Land boundary has been converted to GeoJSON')
    // Return the configuration used to display the boundary on a map.
    return await createMapConfig(dataset, bufferDistance, gdal)
  } finally {
    closeDatasetIfNeeded(dataset)
    closeDatasetIfNeeded(geoJsonDataset)
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
    throw new ValidationError('INVALID-LAYER-COUNT', 'Land boundaries must contain a single layer')
  }
}

const validateLayer = async layer => {
  if (layer.srs) {
    validateSpatialReferenceSystem(layer.srs)
    await validateFeatures(layer.features)
  } else {
    throw new ValidationError('MISSING-COORDINATE-SYSTEM', 'Missing coordinate reference system - geospatial uploads must use the OSGB36 or WGS84 coordinate reference system')
  }
}

const validateSpatialReferenceSystem = srs => {
  const authorityCode = srs.getAuthorityCode(null)
  if (authorityCode !== '27700' && authorityCode !== '4326') {
    throw new CoordinateSystemValidationError(
      authorityCode, 'INVALID-COORDINATE-SYSTEM', 'Land boundaries must use the OSGB36 or WGS84 coordinate reference system')
  }
}

const validateFeatures = async features => {
  if (await features.countAsync() !== 1) {
    throw new ValidationError('INVALID-FEATURE-COUNT', 'Land boundaries must contain a single feature')
  }
}

const createMapConfig = async (dataset, bufferDistance, gdal) => {
  const layer = await dataset.layers.getAsync(0)
  const feature = await layer.features.firstAsync()
  const featureGeometry = feature.getGeometry().clone()

  if (layer.srs.getAuthorityCode() === '4326') {
    // Reproject the geometry for display on a map.
    await featureGeometry.transformToAsync(gdal.SpatialReference.fromEPSGA(3857))
  }

  const bufferedGeometry = await featureGeometry.bufferAsync(bufferDistance)
  const envelope = await bufferedGeometry.getEnvelopeAsync()
  return {
    centroid: JSON.parse(featureGeometry.centroid().toJSON()).coordinates,
    epsg: layer.srs.getAuthorityCode() === '4326' ? '3857' : layer.srs.getAuthorityCode(),
    extent: [envelope.minX, envelope.minY, envelope.maxX, envelope.maxY]
  }
}

export { processLandBoundary }
