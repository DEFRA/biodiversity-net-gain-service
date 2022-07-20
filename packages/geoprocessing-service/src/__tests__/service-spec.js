import fs from 'fs'
import path from 'path'
import { blobExists, isUploadComplete } from '@defra/bng-azure-storage-test-utils'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import { logger } from 'defra-logging-facade'
import { CoordinateSystemValidationError, ValidationError } from '@defra/bng-errors-lib'

const GEOJSON_FILE_EXTENSION = '.geojson'
const GEOPACKAGE_FILE_EXTENSION = '.gpkg'
const JSON_FILE_EXTENSION = '.json'
const ZIP_FILE_EXTENSION = '.zip'
const blobPathRoot = 'mock-session-id/landBoundary'
const containerName = 'trusted'
const mockDataPath = 'packages/geoprocessing-service/src/__mock-data__/uploads/geospatial-land-boundaries'

describe('The geoprocessing service', () => {
  it('should convert a geopackage file containing a single polygon in the WGS84 coordinate reference system to GeoJSON', async () => {
    const filenameRoot = 'geopackage-land-boundary-4326'
    await performLandBoundaryProcessing(`${filenameRoot}${GEOPACKAGE_FILE_EXTENSION}`, true)
    expect(await blobExists(containerName, `${blobPathRoot}/${filenameRoot}${GEOJSON_FILE_EXTENSION}`)).toBe(true)
  })
  it('should accept a GeoJSON file containing a single polygon in the OSGB36 coordinate reference system', async () => {
    const filenameRoot = 'geojson-land-boundary-27700'
    await performLandBoundaryProcessing(`${filenameRoot}${GEOJSON_FILE_EXTENSION}`)
    expect(await blobExists(containerName, `${blobPathRoot}/${filenameRoot}${GEOJSON_FILE_EXTENSION}`)).toBe(true)
  })
  it('should reject a geopackage file containing multiple layers', async () => {
    const filenameRoot = 'multiple-layer-land-boundaries'
    const expectedError = new ValidationError('INVALID-LAYER-COUNT', 'Land boundaries must contain a single layer')
    await expect(performLandBoundaryProcessing(`${filenameRoot}${GEOPACKAGE_FILE_EXTENSION}`)).rejects.toEqual(expectedError)
  })
  it('should reject a GeoJSON file containing multiple features', async () => {
    const filenameRoot = 'multiple-features-4326'
    const expectedError = new ValidationError('INVALID-FEATURE-COUNT', 'Land boundaries must contain a single feature')
    await expect(performLandBoundaryProcessing(`${filenameRoot}${GEOJSON_FILE_EXTENSION}`)).rejects.toEqual(expectedError)
  })
  it('should reject a GeoJSON file using an unsupported coordinate reference system', async () => {
    const filenameRoot = 'land-boundary-4258'
    const expectedError = new CoordinateSystemValidationError('4258', 'INVALID-COORDINATE-SYSTEM', 'Land boundaries must use the OSGB36 or WGS84 coordinate reference system')
    await expect(performLandBoundaryProcessing(`${filenameRoot}${GEOJSON_FILE_EXTENSION}`)).rejects.toEqual(expectedError)
  })
  it('should reject an ESRI shapefile without a projection', async () => {
    const filenameRoot = 'shapefile-land-boundary-without-projection'
    const expectedError = new ValidationError('MISSING-COORDINATE-SYSTEM', 'Missing coordinate reference system - geospatial uploads must use the OSGB36 or WGS84 coordinate reference system')
    await expect(performLandBoundaryProcessing(`${filenameRoot}${ZIP_FILE_EXTENSION}`)).rejects.toEqual(expectedError)
  })
  it('should reject an unsupported file format', async () => {
    const filenameRoot = 'unsupported-file-format'
    try {
      await performLandBoundaryProcessing(`${filenameRoot}${JSON_FILE_EXTENSION}`)
    } catch (err) {
      expect(err.message).toBe("`/vsiaz_streaming/trusted/mock-session-id/landBoundary/unsupported-file-format.json' not recognized as a supported file format.")
    }
  })
})

const uploadFileAsStream = async filePath => {
  const filename = path.basename(filePath)
  const blobConfig = {
    containerName,
    blobName: `${blobPathRoot}/${filename}`
  }
  const stream = fs.createReadStream(filePath)
  fs.readFileSync(filePath)
  await blobStorageConnector.uploadStream(blobConfig, stream)
  const uploadComplete = await isUploadComplete(blobConfig.containerName, blobConfig.blobName, 1000)
  if (!uploadComplete) {
    throw new Error(`Upload of ${filePath} timed out`)
  }
}

const buildConfig = (uploadPath, gdalConfig) => {
  const fileExtension = path.extname(uploadPath)
  const filename = path.basename(uploadPath, fileExtension)

  const config = {
    inputLocation: `${fileExtension === '.zip' ? '/vsizip' : ''}/vsiaz_streaming/${containerName}/${uploadPath}`,
    outputLocation: `/vsiaz/${containerName}/${path.dirname(uploadPath)}/${filename}.geojson`
  }

  if (gdalConfig) {
    config.gdalEnvVars = {
      AZURE_STORAGE_ACCOUNT: 'AZURE_STORAGE_ACCOUNT',
      AZURE_STORAGE_ACCESS_KEY: 'AZURE_STORAGE_ACCESS_KEY'
    }
  }

  return config
}

const performLandBoundaryProcessing = async (filename, gdalConfig = false) => {
  const { processLandBoundary } = require('../service.js')
  const config = buildConfig(`${blobPathRoot}/${filename}`, gdalConfig)
  buildConfig(`${blobPathRoot}/${filename}`)
  await uploadFileAsStream(`${mockDataPath}/${filename}`)
  await processLandBoundary(logger, config)
}
