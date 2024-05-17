import constants from '../../utils/constants.js'
import { taskDefinition, taskSectionDefinition } from '../utils.js'
import { applicantDetailsJourneys } from '../allocation/applicant-details.js'
import { confirmDevelopmentHabitatDetailsJourneys } from '../allocation/confirm-development-habitat-details.js'
import { bngNumberJourneys } from '../allocation/biodiversity-net-gain-number.js'
import { addMetricCalculationsJourneys } from '../allocation/add-metric-calculations.js'
import { planningDecisionNoticeJourneys } from '../allocation/planning-decision-notice.js'
import { applicantInfoJourneys } from '../registration/applicant-info.js'
import { landOwnershipJourneys } from '../registration/land-ownership.js'
import { siteBoundaryJourneys } from '../registration/site-boundary.js'
import { habitatInfoJourneys } from '../registration/habitat-info.js'
import { legalAgreementJourneys } from '../registration/legal-agreement.js'
import { localLandChargeJourneys } from '../registration/local-land-charge.js'

const REGISTRATIONCONSTANTS = {
  APPLICANT_INFO: 'add-applicant-information',
  LAND_OWNERSHIP: 'add-land-ownership',
  SITE_BOUNDARY: 'add-land-boundary',
  HABITAT_INFO: 'add-habitat-information',
  LEGAL_AGREEMENT: 'add-legal-agreement',
  LOCAL_LAND_CHARGE: 'add-local-land-charge-search-certificate'
}

const applicantInfo = taskDefinition(
  REGISTRATIONCONSTANTS.APPLICANT_INFO,
  'Add details about the applicant',
  constants.routes.AGENT_ACTING_FOR_CLIENT,
  constants.routes.CHECK_APPLICANT_INFORMATION,
  applicantInfoJourneys
)

const landOwnership = taskDefinition(
  REGISTRATIONCONSTANTS.LAND_OWNERSHIP,
  'Add land ownership details',
  constants.routes.UPLOAD_LAND_OWNERSHIP,
  constants.routes.LAND_OWNERSHIP_PROOF_LIST,
  landOwnershipJourneys
)

const siteBoundary = taskDefinition(
  REGISTRATIONCONSTANTS.SITE_BOUNDARY,
  'Add biodiversity gain site boundary details',
  constants.routes.UPLOAD_LAND_BOUNDARY,
  constants.routes.CHECK_LAND_BOUNDARY_DETAILS,
  siteBoundaryJourneys
)

const habitatInfo = taskDefinition(
  REGISTRATIONCONSTANTS.HABITAT_INFO,
  'Add habitat baseline, creation and enhancements',
  constants.routes.UPLOAD_METRIC,
  constants.routes.CHECK_METRIC_DETAILS,
  habitatInfoJourneys
)

const legalAgreement = taskDefinition(
  REGISTRATIONCONSTANTS.LEGAL_AGREEMENT,
  'Add legal agreement details',
  constants.routes.LEGAL_AGREEMENT_TYPE,
  constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS,
  legalAgreementJourneys
)

const localLandCharge = taskDefinition(
  REGISTRATIONCONSTANTS.LOCAL_LAND_CHARGE,
  'Add local land charge search certificate',
  constants.routes.UPLOAD_LOCAL_LAND_CHARGE,
  constants.routes.CHECK_LOCAL_LAND_CHARGE_FILE,
  localLandChargeJourneys
)
const tasksById = {
  [REGISTRATIONCONSTANTS.APPLICANT_INFO]: applicantInfo,
  [REGISTRATIONCONSTANTS.LAND_OWNERSHIP]: landOwnership,
  [REGISTRATIONCONSTANTS.SITE_BOUNDARY]: siteBoundary,
  [REGISTRATIONCONSTANTS.HABITAT_INFO]: habitatInfo,
  [REGISTRATIONCONSTANTS.LEGAL_AGREEMENT]: legalAgreement,
  [REGISTRATIONCONSTANTS.LOCAL_LAND_CHARGE]: localLandCharge
}

const applicantDetails = taskDefinition(
  'applicant-details',
  'Add details about the applicant',
  constants.routes.DEVELOPER_AGENT_ACTING_FOR_CLIENT,
  constants.routes.DEVELOPER_AGENT_ACTING_FOR_CLIENT,
  applicantDetailsJourneys
)

const planningDecisionNotice = taskDefinition(
  'planning-decision-notice',
  'Add planning decision notice',
  constants.routes.DEVELOPER_UPLOAD_PLANNING_DECISION_NOTICE,
  constants.routes.DEVELOPER_CHECK_PLANNING_DECISION_NOTICE_FILE,
  planningDecisionNoticeJourneys
)

const biodiversityGainSiteNumber = taskDefinition(
  'biodiversity-gain-site-number',
  'Add biodiversity gain site number',
  constants.routes.DEVELOPER_BNG_NUMBER,
  constants.routes.DEVELOPER_BNG_NUMBER,
  bngNumberJourneys
)

const biodiversityMetricCalculations = taskDefinition(
  'biodiversity-metric-calculations',
  'Add statutory biodiversity metric calculations',
  constants.routes.DEVELOPER_UPLOAD_METRIC,
  constants.routes.DEVELOPER_UPLOAD_METRIC,
  addMetricCalculationsJourneys
)

const confirmDevelopmentHabitatDetails = taskDefinition(
  'confirm-development-habitat-details',
  'Confirm development and habitat details',
  constants.routes.DEVELOPER_CONFIRM_DEV_DETAILS,
  constants.routes.DEVELOPER_CONFIRM_DEV_DETAILS,
  confirmDevelopmentHabitatDetailsJourneys
)

const checkYourAnswers = {
  taskTitle: 'Submit your biodiversity gain information',
  tasks: [{
    id: 'check-your-answers',
    title: 'Check your answers before you submit them',
    url: constants.routes.DEVELOPER_CHECK_ANSWERS,
    status: constants.CANNOT_START_YET_STATUS
  }]
}

const taskSections = [
  taskSectionDefinition('Applicant information', [applicantInfo]),
  taskSectionDefinition('Land information', [landOwnership, siteBoundary, habitatInfo]),
  taskSectionDefinition('Legal information', [legalAgreement, localLandCharge]),
  // taskSectionDefinition('Applicant information', [applicantDetails]),
  //todo if app info the same?
  taskSectionDefinition('Development information', [
    planningDecisionNotice,
    biodiversityGainSiteNumber,
    biodiversityMetricCalculations,
    confirmDevelopmentHabitatDetails
  ])
]

const getTaskById = (taskId) => {
  return tasksById[taskId] || null
}

Object.freeze(taskSections)
Object.freeze(checkYourAnswers)

export { taskSections, checkYourAnswers, getTaskById, REGISTRATIONCONSTANTS }
