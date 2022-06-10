import { CoordinateSystemValidationError, ValidationError } from '@defra/bng-errors-lib'
import { processLandBoundary } from '@defra/bng-geoprocessing-service'
import path from 'path'

export default async function (context, fileLocation) {
  const fileExtension = path.extname(fileLocation)
  const fileDirectory = path.dirname(fileLocation)
  const filename = path.basename(fileLocation, fileExtension)
  const processedFileLocation = `${fileDirectory}/${filename}.geojson`
  // Use the GDAL virtual file system to convert a geospatial land boundary uploaded
  // by a user to GeoJSON.
  const config = {
    bufferDistance: process.env.LAND_BOUNDARY_BUFFER_DISTANCE || 500,
    inputLocation: `${fileExtension === '.zip' ? '/vsizip' : ''}/vsiaz_streaming/trusted/${fileLocation}`,
    outputLocation: `/vsiaz/trusted/${processedFileLocation}`
  }

  const signalRMessage = {
    userId: fileDirectory.substring(0, fileDirectory.indexOf('/')),
    target: `Processed ${filename}${fileExtension}`
  }

  try {
    const mapConfig = await processLandBoundary(context, config)
    signalRMessage.arguments = [{
      location: processedFileLocation,
      mapConfig
    }]
  } catch (err) {
    if (err instanceof CoordinateSystemValidationError) {
      signalRMessage.arguments = [{
        authorityKey: err.authorityKey,
        errorCode: err.code
      }]
    } else if (err instanceof ValidationError) {
      signalRMessage.arguments = [{ errorCode: err.code }]
    } else {
      signalRMessage.arguments = [{ errorMessage: err.message }]
    }
  } finally {
    context.bindings.signalRMessages = [signalRMessage]
  }
}
