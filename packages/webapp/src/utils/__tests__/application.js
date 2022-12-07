import applicationSession from '../../__mocks__/application-session'
import application from '../application'
import constants from '../../utils/constants.js'

describe('application', () => {
  it('Should set the geojson file if geospatial file has been uploaded', () => {
    const session = applicationSession()
    session.set(constants.redisKeys.LAND_BOUNDARY_FILE_TYPE, undefined)
    session.set(constants.redisKeys.LAND_BOUNDARY_FILE_SIZE, undefined)
    session.set(constants.redisKeys.LAND_BOUNDARY_LOCATION, undefined)
    session.set(constants.redisKeys.LAND_BOUNDARY_UPLOAD_TYPE, 'geospatialData')
    session.set(constants.redisKeys.GEOSPATIAL_UPLOAD_LOCATION, 'test-location/file.geojson')
    session.set(constants.redisKeys.GEOSPATIAL_FILE_SIZE, '0.05')
    session.set(constants.redisKeys.GEOSPATIAL_GRID_REFERENCE, 'ST123456')
    session.set(constants.redisKeys.GEOSPATIAL_HECTARES, 5)
    const app = application(session)
    expect(app.landownerGainSiteRegistration.files[1].fileType).toEqual('geojson')
    expect(app.landownerGainSiteRegistration.files[1].fileSize).toEqual('0.05')
    expect(app.landownerGainSiteRegistration.files[1].fileName).toEqual('file.geojson')
    expect(app.landownerGainSiteRegistration.landBoundaryGridReference).toEqual('ST123456')
    expect(app.landownerGainSiteRegistration.landBoundaryHectares).toEqual(5)
  })
  it('Should set the land boundary file if no geospatial file has been uploaded', () => {
    const session = applicationSession()
    const app = application(session)
    expect(app.landownerGainSiteRegistration.files[1].fileType).toEqual('land-boundary')
    expect(app.landownerGainSiteRegistration.files[1].fileSize).toEqual('0.01')
    expect(app.landownerGainSiteRegistration.files[1].fileName).toEqual('legal-agreement.doc')
    expect(app.landownerGainSiteRegistration.landBoundaryGridReference).toEqual('SE170441')
    expect(app.landownerGainSiteRegistration.landBoundaryHectares).toEqual(2)
  })
})
