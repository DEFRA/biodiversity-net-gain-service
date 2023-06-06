import developerApplicationSession from '../../__mocks__/developer-application-session'
import developerApplication from '../developer-application'
import constants from '../constants.js'

describe('developer-application', () => {
  it('Should set the metric file has been uploaded', () => {
    const session = developerApplicationSession()
    session.set(constants.redisKeys.DEVELOPER_METRIC_FILE_SIZE, 5131037)
    session.set(constants.redisKeys.DEVELOPER_METRIC_LOCATION, '978f462f-e91a-4875-9678-3970157204b1/developer-upload-metric/Sample Metric File.xlsm')
    session.set(constants.redisKeys.DEVELOPER_METRIC_FILE_TYPE, 'developer-upload-metric')
    session.set(constants.redisKeys.DEVELOPER_ADDITIONAL_EMAILS, [
      {
        fullName: 'Ajinkya1 Jawalkar',
        email: 'ajinkya1.jawalkar@capgemini.com'
      }
    ])
    const app = developerApplication(session)
    expect(app.developerAllocation.files[0].fileType).toEqual('developer-upload-metric')
    expect(app.developerAllocation.files[0].fileSize).toEqual(5131037)
    expect(app.developerAllocation.additionalEmailAddresses).toEqual([{ fullName: 'Ajinkya1 Jawalkar', email: 'ajinkya1.jawalkar@capgemini.com' }])
  })
  // it('Should set the geojson file if an OSGB36 geospatial file has been uploaded', () => {
  //   const session = developerApplicationSession()
  //   session.set(constants.redisKeys.LAND_BOUNDARY_FILE_TYPE, undefined)
  //   session.set(constants.redisKeys.LAND_BOUNDARY_FILE_SIZE, undefined)
  //   session.set(constants.redisKeys.LAND_BOUNDARY_LOCATION, undefined)
  //   session.set(constants.redisKeys.LAND_BOUNDARY_UPLOAD_TYPE, 'geospatialData')
  //   session.set(constants.redisKeys.GEOSPATIAL_UPLOAD_LOCATION, 'test-location/file.geojson')
  //   session.set(constants.redisKeys.GEOSPATIAL_FILE_SIZE, '0.05')
  //   session.set(constants.redisKeys.GEOSPATIAL_GRID_REFERENCE, 'ST123456')
  //   session.set(constants.redisKeys.GEOSPATIAL_HECTARES, 5)
  //   const app = developerApplication(session)
  //   expect(app.landownerGainSiteRegistration.files[1].fileType).toEqual('geojson')
  //   expect(app.landownerGainSiteRegistration.files[1].fileSize).toEqual('0.05')
  //   expect(app.landownerGainSiteRegistration.files[1].fileName).toEqual('file.geojson')
  //   expect(app.landownerGainSiteRegistration.landBoundaryGridReference).toEqual('ST123456')
  //   expect(app.landownerGainSiteRegistration.landBoundaryHectares).toEqual(5)
  // })
})
