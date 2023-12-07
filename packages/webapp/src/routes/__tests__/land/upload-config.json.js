import constants from '../../../utils/constants'
const uploadTestConfig = [{
  uploadType: 'land-ownership',
  url: constants.routes.UPLOAD_LAND_OWNERSHIP,
  hasError: true,
  filePath: 'packages/webapp/src/__mock-data__/uploads/legal-agreements/legal-agreement.pdf'
}, {
  uploadType: 'metric-upload',
  url: constants.routes.UPLOAD_METRIC,
  hasError: true,
  filePath: 'packages/webapp/src/__mock-data__/uploads/metric-file/metric-file-4.1.xlsm'
}, {
  uploadType: 'metric-upload',
  url: constants.routes.UPLOAD_LOCAL_LAND_CHARGE,
  hasError: true,
  filePath: 'packages/webapp/src/__mock-data__/uploads/local-land-charge/local-land-charge.pdf'
}, {
  uploadType: 'legal-agreement',
  url: constants.routes.UPLOAD_LEGAL_AGREEMENT,
  hasError: true,
  filePath: 'packages/webapp/src/__mock-data__/uploads/legal-agreements/legal-agreement.pdf'
}, {
  uploadType: 'land-boundary',
  url: constants.routes.UPLOAD_LAND_BOUNDARY,
  hasError: true,
  filePath: 'packages/webapp/src/__mock-data__/uploads/legal-agreements/legal-agreement.pdf'
}, {
  uploadType: 'geospatial-land-boundary',
  url: constants.routes.UPLOAD_GEOSPATIAL_LAND_BOUNDARY,
  hasError: true,
  filePath: 'packages/webapp/src/__mock-data__/uploads/geospatial-land-boundaries/geopackage-land-boundary-4326.gpkg'
}, {
  uploadType: 'developer-upload-consent',
  url: constants.routes.DEVELOPER_CONSENT_AGREEMENT_UPLOAD,
  hasError: true,
  filePath: 'packages/webapp/src/__mock-data__/uploads/written-consent/sample.docx'
}, {
  uploadType: constants.uploadTypes.DEVELOPER_METRIC_UPLOAD_TYPE,
  url: constants.routes.DEVELOPER_UPLOAD_METRIC,
  hasError: true,
  filePath: 'packages/webapp/src/__mock-data__/uploads/metric-file/metric-file-4.1.xlsm'
}, {
  uploadType: constants.uploadTypes.HABITAT_PLAN_UPLOAD_TYPE,
  url: constants.routes.UPLOAD_HABITAT_PLAN,
  hasError: true,
  filePath: 'packages/webapp/src/__mock-data__/uploads/habitat-plan/habitat-plan.pdf'
}, {
  uploadType: constants.uploadTypes.WRITTEN_AUTHORISATION_UPLOAD_TYPE,
  url: constants.routes.UPLOAD_WRITTEN_AUTHORISATION,
  hasError: true,
  filePath: 'packages/webapp/src/__mock-data__/uploads/written-authorisation/written-authorisation.pdf'
}
]

export { uploadTestConfig }
