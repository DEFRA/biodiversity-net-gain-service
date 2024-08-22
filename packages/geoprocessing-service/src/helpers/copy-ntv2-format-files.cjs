const fs = require('fs')
const path = require('path')
const gdalAsyncDirectory = require.resolve('gdal-async')
const gdalDataDirectory = path.join(gdalAsyncDirectory, '..', '..', 'deps', 'libproj', 'proj', 'data')
const ntv2FormatFilesPath = path.join(__dirname, '..', '..', '..', '..', 'node_modules', '@defra', 'bng-geoprocessing-service', 'src', 'ntv2-format-files')

const copyNtv2FormatFiles = () => {
  // Copy the NTv2 format files to the GDAL data directory synchronously as the asynchronous API
  // calls appear to fail when used in a CommonJS file within an ESM module.
  fs.readdirSync(ntv2FormatFilesPath).filter(n => n.endsWith('.gsb')).forEach(ntv2FormatFile => {
    fs.copyFileSync(path.join(ntv2FormatFilesPath, ntv2FormatFile), path.join(gdalDataDirectory, ntv2FormatFile))
  })
  console.log('Copied NTv2 format files to GDAL data directory')
}

copyNtv2FormatFiles()
