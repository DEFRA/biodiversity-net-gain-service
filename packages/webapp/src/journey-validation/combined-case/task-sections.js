import constants from '../../utils/constants.js'
import { taskDefinition, taskSectionDefinition } from '../utils.js'
import { applicantInfoJourneys, applicantInfoRouteDefinitions } from './applicant-info.js'
import { landOwnershipJourneys, landOwnershipRouteDefinitions } from './land-ownership.js'
import { siteBoundaryJourneys, siteBoundaryRouteDefinitions } from './site-boundary.js'
import { habitatInfoJourneys, habitatInfoRouteDefinitions } from './habitat-info.js'
import { legalAgreementJourneys, legalAgreementRouteDefinitions } from './legal-agreement.js'
import { localLandChargeJourneys, localLandChargeRouteDefinitions } from './local-land-charge.js'
import { planningDecisionNoticeJourneys, planningDecisionNoticeRouteDefinitions } from './planning-decision-notice.js'
import { matchAvailableHabitatsJourneys } from './match-available-habitats.js'
import { addDevelopmentProjectInformationJourneys, addDevelopmentProjectInformationJourneysRouteDefinitions } from './development-project-information.js'

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
  constants.reusedRoutes.COMBINED_CASE_CHECK_APPLICANT_INFORMATION,
  applicantInfoJourneys
)

const landOwnership = taskDefinition(
  REGISTRATIONCONSTANTS.LAND_OWNERSHIP,
  'Add land ownership details',
  constants.reusedRoutes.COMBINED_CASE_UPLOAD_LAND_OWNERSHIP,
  constants.reusedRoutes.COMBINED_CASE_LAND_OWNERSHIP_PROOF_LIST,
  landOwnershipJourneys
)

const siteBoundary = taskDefinition(
  REGISTRATIONCONSTANTS.SITE_BOUNDARY,
  'Add biodiversity gain site boundary details',
  constants.reusedRoutes.COMBINED_CASE_UPLOAD_LAND_BOUNDARY,
  constants.reusedRoutes.COMBINED_CASE_CHECK_LAND_BOUNDARY_DETAILS,
  siteBoundaryJourneys
)

const habitatInfo = taskDefinition(
  REGISTRATIONCONSTANTS.HABITAT_INFO,
  'Add habitat baseline, creation and enhancements',
  constants.reusedRoutes.COMBINED_CASE_UPLOAD_METRIC,
  constants.reusedRoutes.COMBINED_CASE_CHECK_METRIC_DETAILS,
  habitatInfoJourneys
)

const legalAgreement = taskDefinition(
  REGISTRATIONCONSTANTS.LEGAL_AGREEMENT,
  'Add legal agreement details',
  constants.reusedRoutes.COMBINED_CASE_LEGAL_AGREEMENT_TYPE,
  constants.reusedRoutes.COMBINED_CASE_CHECK_LEGAL_AGREEMENT_DETAILS,
  legalAgreementJourneys
)

const localLandCharge = taskDefinition(
  REGISTRATIONCONSTANTS.LOCAL_LAND_CHARGE,
  'Add local land charge search certificate',
  constants.reusedRoutes.COMBINED_CASE_UPLOAD_LOCAL_LAND_CHARGE,
  constants.reusedRoutes.COMBINED_CASE_CHECK_LOCAL_LAND_CHARGE_FILE,
  localLandChargeJourneys
)

const planningDecisionNotice = taskDefinition(
  'planning-decision-notice',
  'Add planning decision notice',
  constants.reusedRoutes.COMBINED_CASE_UPLOAD_PLANNING_DECISION_NOTICE,
  constants.reusedRoutes.COMBINED_CASE_CHECK_PLANNING_DECISION_NOTICE_FILE,
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
  'Confirm development details',
  constants.reusedRoutes.COMBINED_CASE_DEVELOPMENT_PROJECT_INFORMATION,
  constants.reusedRoutes.COMBINED_CASE_DEVELOPMENT_PROJECT_INFORMATION,
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
  items: [{
    id: 'check-your-answers',
    title: {
      text: 'Check your answers before you submit them'
    },
    href: constants.routes.COMBINED_CASE_CHECK_AND_SUBMIT,
    status: constants.CANNOT_START_YET_STATUS
  }]
}

const taskSections = [
  taskSectionDefinition('Applicant information', [applicantInfo], 'cc-app-info'),
  taskSectionDefinition('Land information', [landOwnership, siteBoundary, habitatInfo], 'cc-land-info'),
  taskSectionDefinition('Legal information', [legalAgreement, localLandCharge], 'cc-legal-info'),
  taskSectionDefinition('Allocation information', [planningDecisionNotice, matchAvailableHabitats, confirmDevAndHabitatDetails], 'cc-allocation-info', ['cc-app-info', 'cc-land-info', 'cc-legal-info'])
]

const getTaskById = (taskId) => {
  return tasksById[taskId] || null
}

const routeDefinitions = [
  ...applicantInfoRouteDefinitions,
  ...addDevelopmentProjectInformationJourneysRouteDefinitions,
  ...habitatInfoRouteDefinitions,
  ...planningDecisionNoticeRouteDefinitions,
  ...landOwnershipRouteDefinitions,
  ...siteBoundaryRouteDefinitions,
  ...legalAgreementRouteDefinitions,
  ...localLandChargeRouteDefinitions
]

Object.freeze(taskSections)
Object.freeze(checkYourAnswers)

export { taskSections, checkYourAnswers, getTaskById, REGISTRATIONCONSTANTS, routeDefinitions }
