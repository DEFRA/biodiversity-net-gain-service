import applicationSession from '../../__mocks__/application-session'
import application from '../application'
import constants from '../../utils/constants.js'
import applicant from '../../__mocks__/applicant'

describe('application', () => {
  it('Should set the geojson file if a WGS84 geospatial file has been uploaded', () => {
    const session = applicationSession()
    session.set(constants.redisKeys.LAND_BOUNDARY_FILE_TYPE, undefined)
    session.set(constants.redisKeys.LAND_BOUNDARY_FILE_SIZE, undefined)
    session.set(constants.redisKeys.LAND_BOUNDARY_LOCATION, undefined)
    session.set(constants.redisKeys.LAND_BOUNDARY_UPLOAD_TYPE, 'geospatialData')
    session.set(constants.redisKeys.GEOSPATIAL_UPLOAD_LOCATION, 'test-location/file.geojson')
    session.set(constants.redisKeys.GEOSPATIAL_FILE_SIZE, '0.05')
    session.set(constants.redisKeys.REPROJECTED_GEOSPATIAL_UPLOAD_LOCATION, 'test-location/reprojectedToOsgb36/file.geojson')
    session.set(constants.redisKeys.REPROJECTED_GEOSPATIAL_FILE_SIZE, '0.051')
    session.set(constants.redisKeys.GEOSPATIAL_GRID_REFERENCE, 'ST123456')
    session.set(constants.redisKeys.GEOSPATIAL_HECTARES, 5)
    const app = application(session, applicant)
    expect(app.landownerGainSiteRegistration.files[2].fileType).toEqual('geojson')
    expect(app.landownerGainSiteRegistration.files[2].fileSize).toEqual('0.051')
    expect(app.landownerGainSiteRegistration.files[2].fileName).toEqual('file.geojson')
    expect(app.landownerGainSiteRegistration.landBoundaryGridReference).toEqual('ST123456')
    expect(app.landownerGainSiteRegistration.landBoundaryHectares).toEqual(5)
  })
  it('Should set the legal e', () => {
    const session = applicationSession()
    session.set(constants.redisKeys.LEGAL_AGREEMENT_FILES, [
      {
        location: '800376c7-8652-4906-8848-70a774578dfe/legal-agreement/legal-agreement.doc',
        fileSize: 0.01,
        fileType: 'application/msword',
        id: '1'

      },
      {
        location: '800376c7-8652-4906-8848-70a774578dfe/legal-agreement/legal-agreement1.pdf',
        fileSize: 0.01,
        fileType: 'application/pdf',
        id: '2'
      }
    ])
    const app = application(session, applicant)
    const legalAgreementFiles = app.landownerGainSiteRegistration.files.filter(
      (file) => file.fileType === 'legal-agreement'
    )
    expect(legalAgreementFiles.length).toEqual(2)
    expect(legalAgreementFiles[0].fileName).toEqual('legal-agreement.doc')
  })
  it('Should set the geojson file if an OSGB36 geospatial file has been uploaded', () => {
    const session = applicationSession()
    session.set(constants.redisKeys.LAND_BOUNDARY_FILE_TYPE, undefined)
    session.set(constants.redisKeys.LAND_BOUNDARY_FILE_SIZE, undefined)
    session.set(constants.redisKeys.LAND_BOUNDARY_LOCATION, undefined)
    session.set(constants.redisKeys.LAND_BOUNDARY_UPLOAD_TYPE, 'geospatialData')
    session.set(constants.redisKeys.GEOSPATIAL_UPLOAD_LOCATION, 'test-location/file.geojson')
    session.set(constants.redisKeys.GEOSPATIAL_FILE_SIZE, '0.05')
    session.set(constants.redisKeys.GEOSPATIAL_GRID_REFERENCE, 'ST123456')
    session.set(constants.redisKeys.GEOSPATIAL_HECTARES, 5)
    const app = application(session, applicant)
    expect(app.landownerGainSiteRegistration.files[2].fileType).toEqual('geojson')
    expect(app.landownerGainSiteRegistration.files[2].fileSize).toEqual('0.05')
    expect(app.landownerGainSiteRegistration.files[2].fileName).toEqual('file.geojson')
    expect(app.landownerGainSiteRegistration.landBoundaryGridReference).toEqual('ST123456')
    expect(app.landownerGainSiteRegistration.landBoundaryHectares).toEqual(5)
  })
  it('Should set the land boundary file if no geospatial file has been uploaded', () => {
    const session = applicationSession()
    const app = application(session, applicant)

    expect(app.landownerGainSiteRegistration.files[2].fileType).toEqual('land-boundary')
    expect(app.landownerGainSiteRegistration.files[2].fileSize).toEqual('0.01')
    expect(app.landownerGainSiteRegistration.files[2].fileName).toEqual('legal-agreement.doc')
    expect(app.landownerGainSiteRegistration.landBoundaryGridReference).toEqual('SE170441')
    expect(app.landownerGainSiteRegistration.landBoundaryHectares).toEqual(2)
  })
})
