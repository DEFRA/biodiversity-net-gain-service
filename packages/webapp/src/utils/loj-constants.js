// Route constants
const ADD_GRID_REFERENCE = 'land/add-grid-reference'
const ADD_HECTARES = 'land/add-hectares'
const ADD_LANDOWNER_INDIVIDUAL = 'land/add-landowner-individual'
const ADD_LANDOWNER_ORGANISATION = 'land/add-landowner-organisation'
const ADD_PLANNING_AUTHORITY = 'land/add-planning-authority'
const ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT = 'land/add-responsible-body-conservation-covenant'
const AGENT_ACTING_FOR_CLIENT = 'land/agent-acting-for-client'
const ANY_OTHER_LANDOWNERS = 'land/any-other-landowners'
const APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION = 'land/applying-individual-organisation'
const BIODIVERSITY_GAIN_SITES = 'land/biodiversity-gain-sites'
const CANNOT_VIEW_APPLICATION = 'land/cannot-view-application'
const CHANGE_ACTING_ON_BEHALF_OF_CLIENT = 'land/change-acting-on-behalf-of-client'
const CHANGE_APPLYING_INDIVIDUAL_ORGANISATION = 'land/change-applying-individual-organisation'
const CHANGE_CLIENT_INDIVIDUAL_ORGANISATION = 'land/change-client-individual-organisation'
const CHANGE_TYPE_LEGAL_AGREEMENT = 'land/change-type-legal-agreement'
const CHECK_AND_SUBMIT = 'land/check-and-submit'
const CHECK_APPLICANT_INFORMATION = 'land/check-applicant-information'
const CHECK_DEFRA_ACCOUNT_DETAILS = 'land/check-defra-account-details'
const CHECK_HABITAT_BASELINE = 'land/check-habitat-baseline'
const CHECK_HABITAT_CREATED = 'land/check-habitat-created'
const CHECK_HABITAT_PLAN_FILE = 'land/check-habitat-plan-file'
const CHECK_LAND_BOUNDARY = 'land/check-land-boundary-file'
const CHECK_LAND_BOUNDARY_DETAILS = 'land/check-land-boundary-details'
const CHECK_LANDOWNERS = 'land/check-landowners'
const CHECK_LEGAL_AGREEMENT = 'land/check-legal-agreement-file'
const CHECK_LEGAL_AGREEMENT_DETAILS = 'land/check-legal-agreement-details'
const CHECK_LEGAL_AGREEMENT_FILES = 'land/check-you-added-all-legal-files'
const CHECK_LOCAL_LAND_CHARGE_FILE = 'land/check-local-land-charge-file'
const CHECK_METRIC_DETAILS = 'land/check-metric-details'
const CHECK_PROOF_OF_OWNERSHIP = 'land/check-ownership-proof-file'
const CHECK_PLANNING_AUTHORITIES = 'land/check-planning-authorities'
const CHECK_RESPONSIBLE_BODIES = 'land/check-responsible-bodies'
const CHECK_UPLOAD_METRIC = 'land/check-metric-file'
const CHECK_WRITTEN_AUTHORISATION_FILE = 'land/check-written-authorisation-file'
const CLIENT_INDIVIDUAL_ORGANISATION = 'land/client-individual-organisation'
const CLIENTS_EMAIL_ADDRESS = 'land/clients-email-address'
const CLIENTS_NAME = 'land/clients-name'
const CLIENTS_ORGANISATION_NAME = 'land/clients-organisation-name'
const CLIENTS_PHONE_NUMBER = 'land/clients-phone-number'
const CONTINUE_REGISTRATION = 'land/continue-registration'
const DEFRA_ACCOUNT_NOT_LINKED = 'land/defra-account-not-linked'
const DOWNLOAD_GEOSPATIAL_LAND_BOUNDARY = 'land/download-geospatial-land-boundary-file'
const DOWNLOAD_HABITAT_PLAN_FILE = 'land/download-habitat-plan-file'
const DOWNLOAD_LAND_BOUNDARY = 'land/download-land-boundary-file'
const DOWNLOAD_LAND_OWNERSHIP = 'land/download-land-ownership-file'
const DOWNLOAD_LEGAL_AGREEMENT = 'land/download-legal-agreement-file'
const DOWNLOAD_LOCAL_LAND_CHARGE_FILE = 'land/download-local-land-charge-file'
const DOWNLOAD_METRIC_FILE = 'land/download-metric-file'
const DOWNLOAD_WRITTEN_AUTHORISATION = 'land/download-written-authorisation-file'
const ENHANCEMENT_WORKS_START_DATE = 'land/enhancement-works-start-date'
const HABITAT_PLAN_LEGAL_AGREEMENT = 'land/habitat-plan-legal-agreement'
const IS_ADDRESS_UK = 'land/is-address-uk'
const LAND_OWNERSHIP_PROOF_LIST = 'land/ownership-proof-list'
const LAND_OWNERSHIP_REMOVE = 'land/land-ownership-remove'
const LANDOWNER_INDIVIDUAL_ORGANISATION = 'land/landowner-individual-organisation'
const LEGAL_AGREEMENT_LPA_LIST = 'land/legal-agreement-lpa-list'
const LEGAL_AGREEMENT_TYPE = 'land/legal-agreement-type'
const NEED_ADD_ALL_LANDOWNERS = 'land/need-add-all-landowners'
const NEED_ADD_ALL_LEGAL_FILES = 'land/need-add-all-legal-files'
const NEED_ADD_ALL_PLANNING_AUTHORITIES = 'land/need-add-all-planning-authorities'
const NEED_ADD_ALL_RESPONSIBLE_BODIES = 'land/need-add-all-responsible-bodies'
const NEED_BOUNDARY_FILE = 'land/need-boundary-file'
const NEED_HABITAT_PLAN = 'land/need-habitat-plan'
const NEED_LEGAL_AGREEMENT = 'land/need-legal-agreement'
const NEED_LOCAL_LAND_CHARGE = 'land/need-local-land-charge'
const NEED_OWNERSHIP_PROOF = 'land/need-ownership-proof'
const NEW_REGISTRATION = 'land/new-registration'
const NON_UK_ADDRESS = 'land/non-uk-address'
const REGISTER_LAND_TASK_LIST = 'land/register-land-task-list'
const REMOVE_LANDOWNER = 'land/remove-landowner'
const REMOVE_LEGAL_AGREEMENT_FILE = 'land/remove-legal-agreement-file'
const REMOVE_LOCAL_PLANNING_AUTHORITY = 'land/remove-local-planning-authority'
const REMOVE_RESPONSIBLE_BODY = 'land/remove-responsible-body'
const UK_ADDRESS = 'land/uk-address'
const UPLOAD_HABITAT_PLAN = 'land/upload-habitat-plan'
const UPLOAD_LAND_BOUNDARY = 'land/upload-land-boundary'
const UPLOAD_LAND_OWNERSHIP = 'land/upload-ownership-proof'
const UPLOAD_LEGAL_AGREEMENT = 'land/upload-legal-agreement'
const UPLOAD_LOCAL_LAND_CHARGE = 'land/upload-local-land-charge'
const UPLOAD_METRIC = 'land/upload-metric'
const UPLOAD_WRITTEN_AUTHORISATION = 'land/upload-written-authorisation'

// RedisKeys constants
const ADDED_LANDOWNERS_CHECKED = 'landowners-checked'
const ALL_LPA = 'all-lpa'
const ANY_OTHER_LANDOWNERS_CHECKED = 'la-any-other-landowners-checked'
const APPLICATION_REFERENCE = 'application-reference'
const CHECK_AND_SUBMIT_JOURNEY_ROUTE = 'check-and-submit-journey-route'
const CLIENT_INDIVIDUAL_ORGANISATION_KEY = 'client-individual-organisation'
const CLIENTS_EMAIL_ADDRESS_KEY = 'clients-email-address'
const CLIENTS_NAME_KEY = 'clients-name'
const CLIENTS_ORGANISATION_NAME_KEY = 'clients-organisation-name'
const CLIENTS_PHONE_NUMBER_KEY = 'clients-phone-number'
const DEFRA_ACCOUNT_DETAILS_CONFIRMED = 'defra-account-details-confirmed'
const EMAIL_VALUE = 'email-value'
const ENHANCEMENT_WORKS_START_DATE_KEY = 'enhancement-works-start-date'
const ENHANCEMENT_WORKS_START_DATE_OPTION = 'enhancement-works-start-date-option'
const ERROR = 'error'
const FULL_NAME = 'fullname'
const GEOSPATIAL_FILE_NAME = 'geospatial_filename'
const GEOSPATIAL_FILE_SIZE = 'geospatial-file-size'
const GEOSPATIAL_FILE_TYPE = 'geospatial-file-type'
const GEOSPATIAL_GRID_REFERENCE = 'geospatial-grid-reference'
const GEOSPATIAL_HECTARES = 'geospatial-hectares'
const GEOSPATIAL_UPLOAD_LOCATION = 'geospatial-location'
const GEOSPATIAL_UPLOAD_TYPE = 'geospatial-land-boundary'
const HABITAT_ENHANCEMENTS_END_DATE = 'land/habitat-enhancements-end-date'
const HABITAT_ENHANCEMENTS_END_DATE_KEY = 'habitat-enhancements-end-date'
const HABITAT_ENHANCEMENTS_END_DATE_OPTION = 'legal-agreement-end-date-option'
const HABITAT_PLAN_CHECKED = 'habitat-plan-checked'
const HABITAT_PLAN_FILE_OPTION = 'habitat-plan-file-option'
const HABITAT_PLAN_FILE_SIZE = 'habitat-plan-file-size'
const HABITAT_PLAN_FILE_TYPE = 'habitat-plan-file-type'
const HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO = 'habitat-plan-legal-agreement-document-included-yes-no'
const HABITAT_PLAN_LOCATION = 'habitat-plan-location'
const HABITAT_PLAN_UPLOAD_TYPE = 'habitat-plan'
const HOME = 'home'
const IS_ADDRESS_UK_KEY = 'is-address-uk'
const IS_AGENT = 'is-agent'
const LAND_APPLICATION_SUBMITTED = 'land-application-submitted'
const LAND_BOUNDARY_CHECKED = 'land-boundary-checked'
const LAND_BOUNDARY_FILE_SIZE = 'land-boundary-file-size'
const LAND_BOUNDARY_FILE_TYPE = 'land-boundary-file-type'
const LAND_BOUNDARY_GRID_REFERENCE = 'land-boundary-grid-reference'
const LAND_BOUNDARY_HECTARES = 'land-boundary-hectares'
const LAND_BOUNDARY_LOCATION = 'land-boundary-location'
const LAND_BOUNDARY_MAP_CONFIG = 'land-boundary-map-config'
const LAND_BOUNDARY_UPLOAD_TYPE = 'land-boundary'
const LAND_OWNERSHIP_CHECKED = 'land-ownership-checked'
const LAND_OWNERSHIP_FILE_SIZE = 'land-ownership-file-size'
const LAND_OWNERSHIP_LOCATION = 'land-ownership-location'
const LAND_OWNERSHIP_PROOF_LIST_KEY = 'land-ownership-proof-list-key'
const LAND_OWNERSHIP_PROOFS = 'land-ownership-proofs'
const LAND_OWNERSHIP_UPLOAD_TYPE = 'land-ownership'
const LANDOWNER_INDIVIDUAL_ORGANISATION_KEY = 'landowner-individual-organisation-key'
const LANDOWNER_TYPE = 'landowner-type'
const LANDOWNERS = 'landowners'
const LEGAL_AGREEMENT_CHECKED = 'legal-agreement-checked'
const LEGAL_AGREEMENT_CHECK_ID = 'legal-agreement-check-id'
const LEGAL_AGREEMENT_DOCUMENT_TYPE = 'legal-agreement-type'
const LEGAL_AGREEMENT_FILES = 'legal-agreement-files'
const LEGAL_AGREEMENT_FILES_CHECKED = 'legal-agreement-files-checked'
const LEGAL_AGREEMENT_FILE_OPTION = 'legal-agreement-file-option'
const LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS = 'legal-agreement-landowner-conservation-convenants'
const LEGAL_AGREEMENT_LOCATION = 'legal-agreement-location'
const LEGAL_AGREEMENT_PARTIES = 'legal-agreement-parties'
const LEGAL_AGREEMENT_RESPONSIBLE_BODIES = 'legal-agreement-reponsible-bodies'
const LEGAL_AGREEMENT_UPLOAD_TYPE = 'legal-agreement'
const LOCAL_LAND_CHARGE_CHECKED = 'local-land-charge-checked'
const LOCAL_LAND_CHARGE_FILE_OPTION = 'local-land-charge-file-option'
const LOCAL_LAND_CHARGE_FILE_SIZE = 'local-land-charge-file-size'
const LOCAL_LAND_CHARGE_FILE_TYPE = 'local-land-charge-file-type'
const LOCAL_LAND_CHARGE_LOCATION = 'local-land-charge-location'
const LOCAL_LAND_CHARGE_UPLOAD_TYPE = 'local-land-charge'
const METRIC_DATA = 'metric-data'
const METRIC_FILE_CHECKED = 'metric-file-checked'
const METRIC_FILE_SIZE = 'metric-file-size'
const METRIC_FILE_TYPE = 'metric-file-type'
const METRIC_HABITAT_BASELINE_CHECKED = 'metric-habitat-baseline-checked'
const METRIC_HABITAT_CREATED_CHECKED = 'metric-habitat-created-checked'
const METRIC_LOCATION = 'metric-file-location'
const METRIC_UPLOADED_ANSWER = 'check-uploaded-metric'
const METRIC_UPLOAD_TYPE = 'metric-upload'
const NEED_ADD_ALL_LANDOWNERS_CHECKED = 'need-add-all-landowners-checked'
const NEED_ADD_ALL_LEGAL_FILES_CHECKED = 'need-add-all-legal-files-checked'
const NEED_ADD_ALL_PLANNING_AUTHORITIES_CHECKED = 'need-add-all-planning-authorities-checked'
const NEED_ADD_ALL_RESPONSIBLE_BODIES_CHECKED = 'need-add-all-responsible-bodies-checked'
const NON_UK_ADDRESS_KEY = 'non-uk-address'
const ORIGINAL_GEOSPATIAL_UPLOAD_LOCATION = 'original-geospatial-upload-location'
const PLANNING_AUTHORITIES_CHECKED = 'planning-authorities-checked'
const PLANNING_AUTHORTITY_LIST = 'planning-authority-list'
const PUBLIC_ROUTES = 'public-routes'
const REFERER = 'referer'
const REF_LPA_NAMES = 'ref-lpa-names'
const REPROJECTED_GEOSPATIAL_FILE_SIZE = 'reprojected-geospatial-file-size'
const REPROJECTED_GEOSPATIAL_UPLOAD_LOCATION = 'reprojected-geospatial-upload-location'
const RESPONSIBLE_BODIES_CHECKED = 'responsible-bodies-checked'
const TEMP_LAND_OWNERSHIP_PROOF = 'temp_land_ownership_proof'
const UK_ADDRESS_KEY = 'uk-address'
const WRITTEN_AUTHORISATION_CHECKED = 'written-authorisation-checked'
const WRITTEN_AUTHORISATION_FILE_SIZE = 'written-authorisation-file-size'
const WRITTEN_AUTHORISATION_FILE_TYPE = 'written-authorisation-file-type'
const WRITTEN_AUTHORISATION_LOCATION = 'written-authorisation-location'
const WRITTEN_AUTHORISATION_UPLOAD_TYPE = 'written-authorisation'

export default {
  redisKeys: {
    ADD_LANDOWNER_INDIVIDUAL,
    ADD_LANDOWNER_ORGANISATION,
    ADD_PLANNING_AUTHORITY,
    ADDED_LANDOWNERS_CHECKED,
    ALL_LPA,
    ANY_OTHER_LANDOWNERS_CHECKED,
    APPLICATION_REFERENCE,
    CHECK_AND_SUBMIT_JOURNEY_ROUTE,
    CHECK_PLANNING_AUTHORITIES,
    CLIENT_INDIVIDUAL_ORGANISATION_KEY,
    CLIENTS_EMAIL_ADDRESS_KEY,
    CLIENTS_NAME_KEY,
    CLIENTS_ORGANISATION_NAME_KEY,
    CLIENTS_PHONE_NUMBER_KEY,
    DEFRA_ACCOUNT_DETAILS_CONFIRMED,
    EMAIL_VALUE,
    ENHANCEMENT_WORKS_START_DATE_KEY,
    ENHANCEMENT_WORKS_START_DATE_OPTION,
    FULL_NAME,
    GEOSPATIAL_FILE_NAME,
    GEOSPATIAL_FILE_SIZE,
    GEOSPATIAL_FILE_TYPE,
    GEOSPATIAL_GRID_REFERENCE,
    GEOSPATIAL_HECTARES,
    GEOSPATIAL_UPLOAD_LOCATION,
    GEOSPATIAL_UPLOAD_TYPE,
    HABITAT_ENHANCEMENTS_END_DATE_KEY,
    HABITAT_ENHANCEMENTS_END_DATE_OPTION,
    HABITAT_PLAN_CHECKED,
    HABITAT_PLAN_FILE_OPTION,
    HABITAT_PLAN_FILE_SIZE,
    HABITAT_PLAN_FILE_TYPE,
    HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO,
    HABITAT_PLAN_LOCATION,
    IS_AGENT,
    IS_ADDRESS_UK_KEY,
    LAND_APPLICATION_SUBMITTED,
    LAND_BOUNDARY_CHECKED,
    LAND_BOUNDARY_FILE_SIZE,
    LAND_BOUNDARY_FILE_TYPE,
    LAND_BOUNDARY_GRID_REFERENCE,
    LAND_BOUNDARY_HECTARES,
    LAND_BOUNDARY_LOCATION,
    LAND_BOUNDARY_MAP_CONFIG,
    LAND_BOUNDARY_UPLOAD_TYPE,
    LAND_OWNERSHIP_CHECKED,
    LAND_OWNERSHIP_FILE_SIZE,
    LAND_OWNERSHIP_LOCATION,
    LAND_OWNERSHIP_PROOF_LIST_KEY,
    LAND_OWNERSHIP_PROOFS,
    LANDOWNER_INDIVIDUAL_ORGANISATION_KEY,
    LANDOWNER_TYPE,
    LANDOWNERS,
    LEGAL_AGREEMENT_CHECK_ID,
    LEGAL_AGREEMENT_CHECKED,
    LEGAL_AGREEMENT_DOCUMENT_TYPE,
    LEGAL_AGREEMENT_FILE_OPTION,
    LEGAL_AGREEMENT_FILES,
    LEGAL_AGREEMENT_FILES_CHECKED,
    LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS,
    LEGAL_AGREEMENT_LOCATION,
    LEGAL_AGREEMENT_LPA_LIST,
    LEGAL_AGREEMENT_PARTIES,
    LEGAL_AGREEMENT_RESPONSIBLE_BODIES,
    LOCAL_LAND_CHARGE_CHECKED,
    LOCAL_LAND_CHARGE_FILE_OPTION,
    LOCAL_LAND_CHARGE_FILE_SIZE,
    LOCAL_LAND_CHARGE_FILE_TYPE,
    LOCAL_LAND_CHARGE_LOCATION,
    METRIC_DATA,
    METRIC_FILE_CHECKED,
    METRIC_FILE_SIZE,
    METRIC_FILE_TYPE,
    METRIC_HABITAT_BASELINE_CHECKED,
    METRIC_HABITAT_CREATED_CHECKED,
    METRIC_LOCATION,
    METRIC_UPLOADED_ANSWER,
    NEED_ADD_ALL_LANDOWNERS_CHECKED,
    NEED_ADD_ALL_LEGAL_FILES_CHECKED,
    NEED_ADD_ALL_PLANNING_AUTHORITIES_CHECKED,
    NEED_ADD_ALL_RESPONSIBLE_BODIES_CHECKED,
    NON_UK_ADDRESS_KEY,
    ORIGINAL_GEOSPATIAL_UPLOAD_LOCATION,
    PLANNING_AUTHORITIES_CHECKED,
    PLANNING_AUTHORTITY_LIST,
    REF_LPA_NAMES,
    REFERER,
    REMOVE_LANDOWNER,
    REMOVE_LOCAL_PLANNING_AUTHORITY,
    REMOVE_RESPONSIBLE_BODY,
    REPROJECTED_GEOSPATIAL_FILE_SIZE,
    REPROJECTED_GEOSPATIAL_UPLOAD_LOCATION,
    RESPONSIBLE_BODIES_CHECKED,
    TEMP_LAND_OWNERSHIP_PROOF,
    UK_ADDRESS_KEY,
    WRITTEN_AUTHORISATION_CHECKED,
    WRITTEN_AUTHORISATION_FILE_SIZE,
    WRITTEN_AUTHORISATION_FILE_TYPE,
    WRITTEN_AUTHORISATION_LOCATION
  },
  routes: {
    ADD_GRID_REFERENCE,
    ADD_HECTARES,
    ADD_LANDOWNER_INDIVIDUAL,
    ADD_LANDOWNER_ORGANISATION,
    ADD_PLANNING_AUTHORITY,
    ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT,
    AGENT_ACTING_FOR_CLIENT,
    ANY_OTHER_LANDOWNERS,
    APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION,
    BIODIVERSITY_GAIN_SITES,
    CANNOT_VIEW_APPLICATION,
    CHANGE_ACTING_ON_BEHALF_OF_CLIENT,
    CHANGE_APPLYING_INDIVIDUAL_ORGANISATION,
    CHANGE_CLIENT_INDIVIDUAL_ORGANISATION,
    CHANGE_TYPE_LEGAL_AGREEMENT,
    CHECK_AND_SUBMIT,
    CHECK_APPLICANT_INFORMATION,
    CHECK_DEFRA_ACCOUNT_DETAILS,
    CHECK_HABITAT_BASELINE,
    CHECK_HABITAT_CREATED,
    CHECK_HABITAT_PLAN_FILE,
    CHECK_LAND_BOUNDARY,
    CHECK_LAND_BOUNDARY_DETAILS,
    CHECK_LANDOWNERS,
    CHECK_LEGAL_AGREEMENT,
    CHECK_LEGAL_AGREEMENT_DETAILS,
    CHECK_LEGAL_AGREEMENT_FILES,
    CHECK_LOCAL_LAND_CHARGE_FILE,
    CHECK_METRIC_DETAILS,
    CHECK_PLANNING_AUTHORITIES,
    CHECK_PROOF_OF_OWNERSHIP,
    CHECK_RESPONSIBLE_BODIES,
    CHECK_UPLOAD_METRIC,
    CHECK_WRITTEN_AUTHORISATION_FILE,
    CLIENT_INDIVIDUAL_ORGANISATION,
    CLIENTS_EMAIL_ADDRESS,
    CLIENTS_NAME,
    CLIENTS_ORGANISATION_NAME,
    CLIENTS_PHONE_NUMBER,
    CONTINUE_REGISTRATION,
    DEFRA_ACCOUNT_NOT_LINKED,
    DOWNLOAD_GEOSPATIAL_LAND_BOUNDARY,
    DOWNLOAD_HABITAT_PLAN_FILE,
    DOWNLOAD_LAND_BOUNDARY,
    DOWNLOAD_LAND_OWNERSHIP,
    DOWNLOAD_LEGAL_AGREEMENT,
    DOWNLOAD_LOCAL_LAND_CHARGE_FILE,
    DOWNLOAD_METRIC_FILE,
    DOWNLOAD_WRITTEN_AUTHORISATION,
    ENHANCEMENT_WORKS_START_DATE,
    ERROR,
    HABITAT_ENHANCEMENTS_END_DATE,
    HABITAT_PLAN_LEGAL_AGREEMENT,
    HOME,
    IS_ADDRESS_UK,
    LANDOWNER_INDIVIDUAL_ORGANISATION,
    LAND_OWNERSHIP_PROOF_LIST,
    LAND_OWNERSHIP_REMOVE,
    LEGAL_AGREEMENT_LPA_LIST,
    LEGAL_AGREEMENT_TYPE,
    NEED_ADD_ALL_LANDOWNERS,
    NEED_ADD_ALL_LEGAL_FILES,
    NEED_ADD_ALL_PLANNING_AUTHORITIES,
    NEED_ADD_ALL_RESPONSIBLE_BODIES,
    NEED_BOUNDARY_FILE,
    NEED_HABITAT_PLAN,
    NEED_LEGAL_AGREEMENT,
    NEED_LOCAL_LAND_CHARGE,
    NEED_OWNERSHIP_PROOF,
    NEW_REGISTRATION,
    NON_UK_ADDRESS,
    ORIGINAL_GEOSPATIAL_UPLOAD_LOCATION,
    PUBLIC_ROUTES,
    REGISTER_LAND_TASK_LIST,
    REMOVE_LANDOWNER,
    REMOVE_LEGAL_AGREEMENT_FILE,
    REMOVE_LOCAL_PLANNING_AUTHORITY,
    REMOVE_RESPONSIBLE_BODY,
    UK_ADDRESS,
    UPLOAD_HABITAT_PLAN,
    UPLOAD_LAND_BOUNDARY,
    UPLOAD_LAND_OWNERSHIP,
    UPLOAD_LEGAL_AGREEMENT,
    UPLOAD_LOCAL_LAND_CHARGE,
    UPLOAD_METRIC,
    UPLOAD_WRITTEN_AUTHORISATION
  },
  uploadTypes: {
    GEOSPATIAL_UPLOAD_TYPE,
    HABITAT_PLAN_UPLOAD_TYPE,
    LAND_BOUNDARY_UPLOAD_TYPE,
    LAND_OWNERSHIP_UPLOAD_TYPE,
    LEGAL_AGREEMENT_UPLOAD_TYPE,
    LOCAL_LAND_CHARGE_UPLOAD_TYPE,
    METRIC_UPLOAD_TYPE,
    WRITTEN_AUTHORISATION_UPLOAD_TYPE
  },
  setLojReferer: [
    CHECK_AND_SUBMIT,
    CHECK_APPLICANT_INFORMATION,
    CHECK_LAND_BOUNDARY_DETAILS,
    CHECK_LEGAL_AGREEMENT_DETAILS,
    CHECK_METRIC_DETAILS,
    LAND_OWNERSHIP_PROOF_LIST
  ]
}
