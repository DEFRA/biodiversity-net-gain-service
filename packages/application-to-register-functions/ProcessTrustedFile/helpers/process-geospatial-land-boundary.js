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

  // TO DO - Handle processing errors by sending an error back to the client through SignalR.
  const mapConfig = await processLandBoundary(context, config)
  const landBoundaryData = {
    location: processedFileLocation,
    mapConfig
  }
  context.bindings.signalRMessages = [{
    userId: fileDirectory.substring(0, fileDirectory.indexOf('/')),
    target: `Processed ${filename}${fileExtension}`,
    arguments: [landBoundaryData]
  }]
}
