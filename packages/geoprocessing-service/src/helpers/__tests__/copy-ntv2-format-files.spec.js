import fs from 'fs'
import path from 'path'
import copyNtv2FormatFiles from '../copy-ntv2-format-files.cjs'

console.log(process.cwd() + '**')
const gdalDataDirectory = path.join('packages', 'geoprocessing-service', 'node_modules', 'gdal-async', 'deps', 'libproj', 'proj', 'data')

describe('NTv2 format files', () => {
  beforeEach(() => {
    fs.unlinkSync(path.join(gdalDataDirectory, 'OSTN15_NTv2_ETRStoOSGB.gsb'))
    fs.unlinkSync(path.join(gdalDataDirectory, 'OSTN15_NTv2_OSGBtoETRS.gsb'))
  })
  it('should be copied to the GDAL data directory', () => {
    copyNtv2FormatFiles()
    expect(fs.existsSync(path.join(gdalDataDirectory, 'OSTN15_NTv2_ETRStoOSGB.gsb'))).toBeTruthy()
    expect(fs.existsSync(path.join(gdalDataDirectory, 'OSTN15_NTv2_OSGBtoETRS.gsb'))).toBeTruthy()
  })
})
