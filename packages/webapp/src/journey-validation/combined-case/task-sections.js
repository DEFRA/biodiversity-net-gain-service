import constants from '../../utils/constants.js'
import { taskDefinition, taskSectionDefinition } from '../utils.js'
import { applicantInfoJourneys, applicantInfoRouteDefinitions } from './applicant-info.js'
import { landOwnershipJourneys } from '../registration/land-ownership.js'
import { siteBoundaryJourneys } from '../registration/site-boundary.js'
import { habitatInfoJourneys } from '../registration/habitat-info.js'
import { legalAgreementJourneys } from '../registration/legal-agreement.js'
import { localLandChargeJourneys } from '../registration/local-land-charge.js'
import { planningDecisionNoticeJourneys } from '../allocation/planning-decision-notice.js'
import { matchAvailableHabitatsJourneys } from './match-available-habitats.js'
import { addDevelopmentProjectInformationJourneys } from '../allocation/development-project-information.js'

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
  constants.reusedRoutes.COMBINED_CASE_AGENT_ACTING_FOR_CLIENT,
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

const planningDecisionNotice = taskDefinition(
  'planning-decision-notice',
  'Add planning decision notice',
  constants.routes.DEVELOPER_UPLOAD_PLANNING_DECISION_NOTICE,
  constants.routes.DEVELOPER_CHECK_PLANNING_DECISION_NOTICE_FILE,
  planningDecisionNoticeJourneys
)

const matchAvailableHabitats = taskDefinition(
  'match-available-habitats',
  'Match available habitats',
  constants.routes.COMBINED_CASE_UPLOAD_ALLOCATION_METRIC,
  constants.routes.COMBINED_CASE_CHECK_UPLOAD_ALLOCATION_METRIC,
  matchAvailableHabitatsJourneys
)

const confirmDevAndHabitatDetails = taskDefinition(
  'confirm-dev-and-habitat-details',
  'Confirm development and habitat details',
  constants.routes.DEVELOPER_DEVELOPMENT_PROJECT_INFORMATION,
  constants.routes.DEVELOPER_DEVELOPMENT_PROJECT_INFORMATION,
  addDevelopmentProjectInformationJourneys
)

const tasksById = {
  [REGISTRATIONCONSTANTS.APPLICANT_INFO]: applicantInfo,
  [REGISTRATIONCONSTANTS.LAND_OWNERSHIP]: landOwnership,
  [REGISTRATIONCONSTANTS.SITE_BOUNDARY]: siteBoundary,
  [REGISTRATIONCONSTANTS.HABITAT_INFO]: habitatInfo,
  [REGISTRATIONCONSTANTS.LEGAL_AGREEMENT]: legalAgreement,
  [REGISTRATIONCONSTANTS.LOCAL_LAND_CHARGE]: localLandCharge
}

const checkYourAnswers = {
  taskTitle: 'Submit your biodiversity gain information',
  tasks: [{
    id: 'check-your-answers',
    title: 'Check your answers before you submit them',
    url: constants.routes.COMBINED_CASE_CHECK_AND_SUBMIT,
    status: constants.CANNOT_START_YET_STATUS
  }]
}

const taskSections = [
  taskSectionDefinition('Applicant information', [applicantInfo]),
  taskSectionDefinition('Land information', [landOwnership, siteBoundary, habitatInfo]),
  taskSectionDefinition('Legal information', [legalAgreement, localLandCharge]),
  taskSectionDefinition('Allocation information', [planningDecisionNotice, matchAvailableHabitats, confirmDevAndHabitatDetails])
]

const getTaskById = (taskId) => {
  return tasksById[taskId] || null
}

const routeDefinitions = [
  ...applicantInfoRouteDefinitions
]

Object.freeze(taskSections)
Object.freeze(checkYourAnswers)

export { taskSections, checkYourAnswers, getTaskById, REGISTRATIONCONSTANTS, routeDefinitions }
