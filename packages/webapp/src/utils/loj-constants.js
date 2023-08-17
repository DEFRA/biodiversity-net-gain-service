const PUBLIC_ROUTES = 'public-routes'
const START = 'start'
const ADD_GRID_REFERENCE = 'land/add-grid-reference'
const ADD_HECTARES = 'land/add-hectares'
const UPLOAD_LOCAL_LAND_CHARGE = 'land/upload-local-land-charge'
const CHECK_LEGAL_AGREEMENT = 'land/check-legal-agreement-file'
const LEGAL_AGREEMENT_TYPE = 'land/legal-agreement-type'
const ADD_LEGAL_AGREEMENT_PARTIES = 'land/add-legal-agreement-parties'
const LEGAL_PARTY_REMOVE = 'land/legal-party-remove'
const LEGAL_PARTY_LIST = 'land/legal-party-list'
const LEGAL_AGREEMENT_START_DATE = 'land/legal-agreement-start-date'
const CHECK_MANAGEMENT_PLAN = 'land/check-management-plan-file'
const CHECK_AND_SUBMIT = 'land/check-and-submit'
const CHECK_GEOSPATIAL_FILE = 'land/check-geospatial-file'
const CHECK_LOCAL_LAND_CHARGE_FILE = 'land/check-local-land-charge-file'
const DOWNLOAD_LEGAL_AGREEMENT = 'land/download-legal-agreement-file'
const DOWNLOAD_LOCAL_LAND_CHARGE_FILE = 'land/download-local-land-charge-file'
const DOWNLOAD_MANAGEMENT_PLAN = 'land/download-management-plan-file'
const DOWNLOAD_LAND_BOUNDARY = 'land/download-land-boundary-file'
const DOWNLOAD_GEOSPATIAL_LAND_BOUNDARY = 'land/download-geospatial-land-boundary-file'
const DOWNLOAD_METRIC_FILE = 'land/download-metric-file'
const DOWNLOAD_LAND_OWNERSHIP = 'land/download-land-ownership-file'
const GEOSPATIAL_LAND_BOUNDARY = 'land/geospatial-land-boundary'
const CHOOSE_LAND_BOUNDARY_UPLOAD = 'land/choose-land-boundary-upload'
const CHECK_PROOF_OF_OWNERSHIP = 'land/check-ownership-proof-file'
const OS_API_TOKEN = 'land/os-api-token'
const UPLOAD_GEOSPATIAL_LAND_BOUNDARY = 'land/upload-geospatial-file'
const UPLOAD_MANAGEMENT_PLAN = 'land/upload-management-plan'
const UPLOAD_LEGAL_AGREEMENT = 'land/upload-legal-agreement'
const CHECK_LEGAL_AGREEMENT_DETAILS = 'land/check-legal-agreement-details'
const UPLOAD_LAND_BOUNDARY = 'land/upload-land-boundary'
const UPLOAD_LAND_OWNERSHIP = 'land/upload-ownership-proof'
const CHECK_LAND_BOUNDARY = 'land/check-land-boundary-file'
const UPLOAD_METRIC = 'land/upload-metric'
const CHECK_UPLOAD_METRIC = 'land/check-metric-file'
const CHECK_YOUR_DETAILS = 'land/check-your-details'
const REGISTER_LAND_TASK_LIST = 'land/register-land-task-list'
const HABITAT_WORKS_START_DATE = 'land/habitat-works-start-date'
const MANAGEMENT_MONITORING_START_DATE = 'land/management-monitoring-start-date'
const CHECK_MANAGEMENT_MONITORING_DETAILS = 'land/check-management-monitoring-details'
const REGISTERED_LANDOWNER = 'land/registered-landowner'
const ADD_LANDOWNERS = 'land/add-landowners'
const LANDOWNER_CONSENT = 'land/landowner-consent'
const CHECK_OWNERSHIP_DETAILS = 'land/check-ownership-details'
const CHECK_LAND_BOUNDARY_DETAILS = 'land/check-land-boundary-details'
const NEED_BOUNDARY_FILE = 'land/need-boundary-file'
const NEED_OWNERSHIP_PROOF = 'land/need-ownership-proof'
const NEED_METRIC = 'land/need-metric'
const NEED_MANAGEMENT_PLAN = 'land/need-management-plan'
const NEED_LEGAL_AGREEMENT = 'land/need-legal-agreement'
const NEED_LOCAL_LAND_CHARGE = 'land/need-local-land-charge'
const CHECK_HABITAT_BASELINE = 'land/check-habitat-baseline'
const CHECK_HABITAT_CREATED = 'land/check-habitat-created'
const CHECK_METRIC_DETAILS = 'land/check-metric-details'
const REGISTRATION_SUBMITTED = 'registration-submitted'
const ERROR = 'error'
const HOME = 'home'
const COOKIES = 'cookies'

const APPLICATION_REFERENCE = 'application-reference'
const LEGAL_AGREEMENT_FILE_OPTION = 'legal-agreement-file-option'
const LOCAL_LAND_CHARGE_FILE_OPTION = 'local-land-charge-file-option'
const METRIC_UPLOAD_KEY = 'metric-upload-key'
const GEOSPATIAL_UPLOAD_LOCATION = 'geospatial-location'
const ORIGINAL_GEOSPATIAL_UPLOAD_LOCATION = 'original-geospatial-upload-location'
const REPROJECTED_GEOSPATIAL_UPLOAD_LOCATION = 'reprojected-geospatial-upload-location'
const GEOSPATIAL_MAP_CONFIG = 'geospatial-map-config'
const LAND_BOUNDARY_MAP_CONFIG = 'land-boundary-map-config'
const GEOSPATIAL_FILE_NAME = 'geospatial_filename'
const GEOSPATIAL_FILE_SIZE = 'geospatial-file-size'
const LOCAL_LAND_CHARGE_FILE_SIZE = 'local-land-charge-file-size'
const REPROJECTED_GEOSPATIAL_FILE_SIZE = 'reprojected-geospatial-file-size'
const GEOSPATIAL_FILE_TYPE = 'geospatial-file-type'
const GEOSPATIAL_HECTARES = 'geospatial-hectares'
const GEOSPATIAL_GRID_REFERENCE = 'geospatial-grid-reference'
const LEGAL_AGREEMENT_CHECKED = 'legal-agreement-checked'
const LOCAL_LAND_CHARGE_CHECKED = 'local-land-charge-checked'
const LEGAL_AGREEMENT_FILE_SIZE = 'legal-agreement-file-size'
const LEGAL_AGREEMENT_FILE_TYPE = 'legal-agreement-file-type'
const LOCAL_LAND_CHARGE_FILE_TYPE = 'local-land-charge-file-type'
const LEGAL_AGREEMENT_LOCATION = 'legal-agreement-location'
const LOCAL_LAND_CHARGE_LOCATION = 'local-land-charge-location'
const LEGAL_AGREEMENT_DOCUMENT_TYPE = 'legal-agreement-type'
const LEGAL_AGREEMENT_PARTIES = 'legal-agreement-parties'
const LEGAL_AGREEMENT_PARTIES_KEY = 'legal-agreement-parties-key'
const MANAGEMENT_PLAN_KEY = 'management-plan-key'
const MANAGEMENT_PLAN_CHECKED = 'management-plan-checked'
const MANAGEMENT_PLAN_FILE_SIZE = 'management-plan-file-size'
const MANAGEMENT_PLAN_FILE_TYPE = 'management-plan-file-type'
const MANAGEMENT_PLAN_LOCATION = 'management-plan-location'
const LAND_OWNERSHIP_FILE_SIZE = 'land-ownership-file-size'
const LAND_OWNERSHIP_LOCATION = 'land-ownership-location'
const LAND_OWNERSHIP_CHECKED = 'land-ownership-checked'
const LAND_OWNERSHIP_FILE_TYPE = 'land-ownership-file-type'
const LAND_BOUNDARY_CHECKED = 'land-boundary-checked'
const METRIC_FILE_CHECKED = 'metric-file-checked'
const LEGAL_AGREEMENT_START_DATE_KEY = 'legal-agreement-start-date'
const LEGAL_AGREEMENT_ORGANISATION_NAMES = 'legal-agreement-oganisation-names'
const LEGAL_AGREEMENT_OTHER_PARTY_NAMES = 'legal-agreement-other-party-names'
const LEGAL_AGREEMENT_START_DAY = 'legal-agreement-start-day'
const LEGAL_AGREEMENT_START_MONTH = 'legal-agreement-start-month'
const LEGAL_AGREEMENT_START_YEAR = 'legal-agreement-start-year'
const LEGAL_AGREEMENT_ORGANISATION_NAMES_CHECKED = 'legal-agreement-oganisation-checked'
const LAND_BOUNDARY_FILE_SIZE = 'land-boundary-file-size'
const LAND_BOUNDARY_FILE_TYPE = 'land-boundary-file-type'
const LAND_BOUNDARY_LOCATION = 'land-boundary-location'
const LAND_BOUNDARY_GRID_REFERENCE = 'land-boundary-grid-reference'
const LAND_BOUNDARY_HECTARES = 'land-boundary-hectares'
const METRIC_UPLOADED_ANSWER = 'check-uploaded-metric'
const METRIC_LOCATION = 'metric-file-location'
const METRIC_FILE_SIZE = 'metric-file-size'
const METRIC_FILE_TYPE = 'metric-file-type'
const METRIC_DATA = 'metric-data'
const NAME_KEY = 'name-key'
const FULL_NAME = 'fullname'
const HABITAT_WORKS_START_DATE_KEY = 'habitat-works-start-date'
const MANAGEMENT_MONITORING_START_DATE_KEY = 'management-monitoring-start-date'
const REGISTERED_LANDOWNER_ONLY = 'registered-landowner-only'
const LANDOWNERS = 'landowners'
const LANDOWNER_CONSENT_KEY = 'landowner-consent'
const LAND_OWNERSHIP_KEY = 'land-ownership-key'
const REGISTRATION_TASK_DETAILS = 'registrationTaskDetails'
const REFERER = 'referer'
const EMAIL_VALUE = 'email-value'
const GEOSPATIAL_UPLOAD_TYPE = 'geospatial-land-boundary'
const LEGAL_AGREEMENT_UPLOAD_TYPE = 'legal-agreement'
const LOCAL_LAND_CHARGE_UPLOAD_TYPE = 'local-land-charge'
const MANAGEMENT_PLAN_UPLOAD_TYPE = 'management-plan'
const LAND_OWNERSHIP_UPLOAD_TYPE = 'land-ownership'
const LAND_BOUNDARY_UPLOAD_TYPE = 'land-boundary'
const METRIC_UPLOAD_TYPE = 'metric-upload'

export default {
  redisKeys: {
    ADD_LEGAL_AGREEMENT_PARTIES,
    APPLICATION_REFERENCE,
    ORIGINAL_GEOSPATIAL_UPLOAD_LOCATION,
    REPROJECTED_GEOSPATIAL_UPLOAD_LOCATION,
    LEGAL_PARTY_REMOVE,
    GEOSPATIAL_UPLOAD_LOCATION,
    GEOSPATIAL_MAP_CONFIG,
    GEOSPATIAL_UPLOAD_TYPE,
    GEOSPATIAL_FILE_NAME,
    GEOSPATIAL_FILE_SIZE,
    REPROJECTED_GEOSPATIAL_FILE_SIZE,
    LOCAL_LAND_CHARGE_FILE_SIZE,
    GEOSPATIAL_FILE_TYPE,
    GEOSPATIAL_HECTARES,
    GEOSPATIAL_GRID_REFERENCE,
    LAND_BOUNDARY_MAP_CONFIG,
    LAND_BOUNDARY_UPLOAD_TYPE,
    LAND_BOUNDARY_LOCATION,
    LAND_BOUNDARY_FILE_SIZE,
    LAND_BOUNDARY_FILE_TYPE,
    LAND_BOUNDARY_CHECKED,
    LAND_BOUNDARY_GRID_REFERENCE,
    LAND_BOUNDARY_HECTARES,
    LEGAL_AGREEMENT_CHECKED,
    LOCAL_LAND_CHARGE_CHECKED,
    LEGAL_AGREEMENT_LOCATION,
    LOCAL_LAND_CHARGE_LOCATION,
    LEGAL_AGREEMENT_DOCUMENT_TYPE,
    LEGAL_AGREEMENT_FILE_SIZE,
    LEGAL_AGREEMENT_FILE_TYPE,
    LOCAL_LAND_CHARGE_FILE_TYPE,
    LEGAL_AGREEMENT_PARTIES_KEY,
    MANAGEMENT_PLAN_KEY,
    LEGAL_AGREEMENT_FILE_OPTION,
    LOCAL_LAND_CHARGE_FILE_OPTION,
    LEGAL_AGREEMENT_PARTIES,
    MANAGEMENT_PLAN_CHECKED,
    MANAGEMENT_PLAN_LOCATION,
    MANAGEMENT_PLAN_FILE_SIZE,
    MANAGEMENT_PLAN_FILE_TYPE,
    METRIC_FILE_TYPE,
    METRIC_UPLOAD_KEY,
    LAND_OWNERSHIP_LOCATION,
    LAND_OWNERSHIP_FILE_SIZE,
    LAND_OWNERSHIP_CHECKED,
    LAND_OWNERSHIP_FILE_TYPE,
    METRIC_LOCATION,
    METRIC_FILE_SIZE,
    METRIC_DATA,
    FULL_NAME,
    NAME_KEY,
    HABITAT_WORKS_START_DATE_KEY,
    REGISTERED_LANDOWNER_ONLY,
    LANDOWNERS,
    LANDOWNER_CONSENT_KEY,
    LEGAL_AGREEMENT_START_DATE_KEY,
    METRIC_FILE_CHECKED,
    MANAGEMENT_MONITORING_START_DATE_KEY,
    LEGAL_AGREEMENT_ORGANISATION_NAMES,
    LEGAL_AGREEMENT_ORGANISATION_NAMES_CHECKED,
    LEGAL_AGREEMENT_OTHER_PARTY_NAMES,
    LEGAL_AGREEMENT_START_DAY,
    LEGAL_AGREEMENT_START_MONTH,
    LEGAL_AGREEMENT_START_YEAR,
    REGISTRATION_TASK_DETAILS,
    LAND_OWNERSHIP_KEY,
    METRIC_UPLOADED_ANSWER,
    REFERER,
    EMAIL_VALUE
  },
  routes: {
    ADD_GRID_REFERENCE,
    ADD_HECTARES,
    ERROR,
    CHECK_LEGAL_AGREEMENT,
    ADD_LEGAL_AGREEMENT_PARTIES,
    LEGAL_PARTY_LIST,
    LEGAL_PARTY_REMOVE,
    LEGAL_AGREEMENT_START_DATE,
    LEGAL_AGREEMENT_TYPE,
    CHECK_MANAGEMENT_PLAN,
    REGISTRATION_SUBMITTED,
    CHECK_AND_SUBMIT,
    CHECK_LAND_BOUNDARY,
    CHECK_PROOF_OF_OWNERSHIP,
    CHECK_UPLOAD_METRIC,
    CHECK_GEOSPATIAL_FILE,
    CHECK_LOCAL_LAND_CHARGE_FILE,
    DOWNLOAD_LEGAL_AGREEMENT,
    DOWNLOAD_LOCAL_LAND_CHARGE_FILE,
    DOWNLOAD_MANAGEMENT_PLAN,
    DOWNLOAD_LAND_BOUNDARY,
    DOWNLOAD_GEOSPATIAL_LAND_BOUNDARY,
    DOWNLOAD_METRIC_FILE,
    DOWNLOAD_LAND_OWNERSHIP,
    GEOSPATIAL_LAND_BOUNDARY,
    CHOOSE_LAND_BOUNDARY_UPLOAD,
    OS_API_TOKEN,
    PUBLIC_ROUTES,
    START,
    UPLOAD_GEOSPATIAL_LAND_BOUNDARY,
    UPLOAD_MANAGEMENT_PLAN,
    UPLOAD_METRIC,
    UPLOAD_LEGAL_AGREEMENT,
    UPLOAD_LOCAL_LAND_CHARGE,
    CHECK_LEGAL_AGREEMENT_DETAILS,
    UPLOAD_LAND_BOUNDARY,
    CHECK_LAND_BOUNDARY_DETAILS,
    UPLOAD_LAND_OWNERSHIP,
    HOME,
    REGISTER_LAND_TASK_LIST,
    HABITAT_WORKS_START_DATE,
    MANAGEMENT_MONITORING_START_DATE,
    CHECK_MANAGEMENT_MONITORING_DETAILS,
    REGISTERED_LANDOWNER,
    ADD_LANDOWNERS,
    LANDOWNER_CONSENT,
    CHECK_OWNERSHIP_DETAILS,
    NEED_BOUNDARY_FILE,
    NEED_OWNERSHIP_PROOF,
    NEED_METRIC,
    NEED_MANAGEMENT_PLAN,
    NEED_LEGAL_AGREEMENT,
    NEED_LOCAL_LAND_CHARGE,
    CHECK_HABITAT_BASELINE,
    CHECK_HABITAT_CREATED,
    CHECK_METRIC_DETAILS,
    COOKIES
  },
  uploadTypes: {
    GEOSPATIAL_UPLOAD_TYPE,
    LEGAL_AGREEMENT_UPLOAD_TYPE,
    LOCAL_LAND_CHARGE_UPLOAD_TYPE,
    MANAGEMENT_PLAN_UPLOAD_TYPE,
    LAND_BOUNDARY_UPLOAD_TYPE,
    METRIC_UPLOAD_TYPE,
    LAND_OWNERSHIP_UPLOAD_TYPE
  },
  setLojReferer: [
    CHECK_AND_SUBMIT,
    CHECK_YOUR_DETAILS,
    CHECK_OWNERSHIP_DETAILS,
    CHECK_LEGAL_AGREEMENT_DETAILS,
    CHECK_MANAGEMENT_MONITORING_DETAILS,
    CHECK_LAND_BOUNDARY_DETAILS,
    CHECK_METRIC_DETAILS
  ],
  clearLojReferer: [
    UPLOAD_METRIC,
    REGISTER_LAND_TASK_LIST
  ]
}
