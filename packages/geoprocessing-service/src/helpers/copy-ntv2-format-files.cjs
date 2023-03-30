const fs = require('fs')
const path = require('path')
const { logger } = require('defra-logging-facade')
const gdalAsyncDirectory = require.resolve('gdal-async')
const gdalDataDirectory = path.join(gdalAsyncDirectory, '..', '..', 'deps', 'libproj', 'proj', 'data')
const ntv2FormatFilesPath = path.join(__dirname, '..', 'ntv2-format-files')

const copyNtv2FormatFiles = () => {
  // Copy the NTv2 format files to the GDAL data directory synchronously as the asynchronous API
  // calls appear to fail when used in a CommonJS file within an ESM module.
  fs.readdirSync(ntv2FormatFilesPath).filter(n => n.endsWith('.gsb')).forEach(ntv2FormatFile => {
    fs.copyFileSync(path.join(ntv2FormatFilesPath, ntv2FormatFile), path.join(gdalDataDirectory, ntv2FormatFile))
  })
  logger.log('Copied NTv2 format files to GDAL data directory')
}

module.exports = copyNtv2FormatFiles
