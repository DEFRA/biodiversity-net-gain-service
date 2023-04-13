import fs from 'fs'
import path from 'path'
const gdalDataDirectory = path.join('packages', 'geoprocessing-service', 'node_modules', 'gdal-async', 'deps', 'libproj', 'proj', 'data')

describe('NTv2 format files', () => {
  beforeEach(() => {
    fs.unlinkSync(path.join(gdalDataDirectory, 'OSTN15_NTv2_ETRStoOSGB.gsb'))
    fs.unlinkSync(path.join(gdalDataDirectory, 'OSTN15_NTv2_OSGBtoETRS.gsb'))
  })
  it('should be copied to the GDAL data directory', done => {
    jest.isolateModules(async () => {
      try {
        require('../copy-ntv2-format-files.cjs')
        expect(fs.existsSync(path.join(gdalDataDirectory, 'OSTN15_NTv2_ETRStoOSGB.gsb'))).toBeTruthy()
        expect(fs.existsSync(path.join(gdalDataDirectory, 'OSTN15_NTv2_OSGBtoETRS.gsb'))).toBeTruthy()
        done()
      } catch (err) {
        done(err)
      }
    })
  })
})
