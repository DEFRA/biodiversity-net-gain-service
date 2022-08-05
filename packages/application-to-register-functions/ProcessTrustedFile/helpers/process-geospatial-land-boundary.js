import buildSignalRMessage from '../../Shared/build-signalr-message.js'
import { CoordinateSystemValidationError, ValidationError } from '@defra/bng-errors-lib'
import { processLandBoundary } from '@defra/bng-geoprocessing-service'

export default async function (context, config) {
  const processedFileLocation =
   `${config.fileConfig.fileDirectory}/${config.fileConfig.filename}.geojson`
  // Use the GDAL virtual file system to convert a geospatial land boundary uploaded
  // by a user to GeoJSON.
  const landBoundaryConfig = {
    bufferDistance: process.env.LAND_BOUNDARY_BUFFER_DISTANCE || 500,
    inputLocation: `${config.fileConfig.fileExtension === '.zip' ? '/vsizip' : ''}/vsiaz_streaming/trusted/${config.fileConfig.fileLocation}`,
    outputLocation: `/vsiaz/trusted/${processedFileLocation}`,
    gdalEnvVars: gdalEnvVars()
  }

  let signalRMessageArguments
  try {
    const mapConfig = await processLandBoundary(context, landBoundaryConfig)
    signalRMessageArguments = [{
      location: processedFileLocation,
      mapConfig
    }]
  } catch (err) {
    if (err instanceof CoordinateSystemValidationError) {
      signalRMessageArguments = [{
        authorityKey: err.authorityKey,
        errorCode: err.code
      }]
    } else if (err instanceof ValidationError) {
      signalRMessageArguments = [{ errorCode: err.code }]
    } else {
      signalRMessageArguments = [{ errorMessage: err.message }]
    }
  } finally {
    context.bindings.signalRMessages = [buildSignalRMessage(config.signalRMessageConfig, signalRMessageArguments)]
  }
}

const gdalEnvVars = () => {
  return {
    AZURE_STORAGE_ACCOUNT: process.env.AZURE_STORAGE_ACCOUNT,
    AZURE_STORAGE_ACCESS_KEY: process.env.AZURE_STORAGE_ACCESS_KEY
  }
}
