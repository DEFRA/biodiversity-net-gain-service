import gdal from 'gdal-async'
import { CoordinateSystemValidationError, ValidationError } from '@defra/bng-errors-lib'

const processLandBoundary = async (logger, config) => {
  let dataset
  let geoJsonDataset
  const bufferDistance = config.bufferDistance || 500
  try {
    dataset = await gdal.openAsync(config.inputLocation)
    await validateDataset(dataset)
    // The land boundary is valid so convert it to GeoJSON.
    geoJsonDataset = await gdal.vectorTranslateAsync(config.outputLocation, dataset)
    logger.log('Land boundary has been converted to GeoJSON')
    // Return the configuration used to display the boundary on a map.
    return await createMapConfig(dataset, bufferDistance)
  } finally {
    closeDatasetIfNeeded(dataset)
    closeDatasetIfNeeded(geoJsonDataset)
  }
}

const closeDatasetIfNeeded = (dataset) => {
  if (dataset) {
    try {
      dataset.close()
    } catch (error) {
      // Do nothing
    }
  }
}

const validateDataset = async (dataset) => {
  // Check that one layer is present and uses a supported coordinate system containing one feature.
  if (await dataset.layers.countAsync() === 1) {
    await validateLayer(await dataset.layers.getAsync(0))
  } else {
    throw new ValidationError('INVALID-LAYER-COUNT', 'Land boundaries must contain a single layer')
  }
}

const validateLayer = async (layer) => {
  if (layer.srs) {
    validateSpatialReferenceSystem(layer.srs)
    await validateFeatures(layer.features)
  } else {
    throw new ValidationError('MISSING-COORDINATE-SYSTEM', 'Missing coordinate system - geospatial uploads must use the OSGB36 or WGS84 coordinate system')
  }
}

const validateSpatialReferenceSystem = (srs) => {
  const authorityCode = srs.getAuthorityCode(null)
  if (authorityCode !== '27700' && authorityCode !== '4326') {
    throw new CoordinateSystemValidationError(
      authorityCode, 'INVALID-COORDINATE-SYSTEM', 'Land boundaries must use the OSGB36 or WGS84 coordinate system')
  }
}

const validateFeatures = async (features) => {
  if (await features.countAsync() !== 1) {
    throw new ValidationError('INVALID-FEATURE-COUNT', 'Land boundaries must contain a single feature')
  }
}

const createMapConfig = async (dataset, bufferDistance) => {
  const layer = await dataset.layers.getAsync(0)
  const feature = await layer.features.firstAsync()
  const featureGeometry = feature.getGeometry().clone()

  if (layer.srs.getAuthorityCode() === '4326') {
    // Reproject the geometry for display on a map.
    await featureGeometry.transformToAsync(gdal.SpatialReference.fromEPSGA(3857))
  }

  const bufferedGeometry = await featureGeometry.bufferAsync(bufferDistance)
  const envelope = await bufferedGeometry.getEnvelopeAsync()
  const mapConfig = {
    centroid: JSON.parse(featureGeometry.centroid().toJSON()).coordinates,
    epsg: layer.srs.getAuthorityCode() === '4326' ? '3857' : layer.srs.getAuthorityCode(),
    extent: [envelope.minX, envelope.minY, envelope.maxX, envelope.maxY]
  }

  return mapConfig
}

export { processLandBoundary }
