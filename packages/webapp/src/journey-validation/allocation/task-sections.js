import constants from '../../utils/constants.js'
import { taskDefinition, taskSectionDefinition } from '../utils.js'
import { applicantDetailsJourneys } from './applicant-details.js'
import { confirmDevelopmentHabitatDetailsJourneys } from './confirm-development-habitat-details.js'
import { bngNumberJourneys } from './biodiversity-net-gain-number.js'
import { addMetricCalculationsJourneys } from './add-metric-calculations.js'

const applicantDetails = taskDefinition(
  'applicant-details',
  'Add details about the applicant',
  constants.routes.DEVELOPER_AGENT_ACTING_FOR_CLIENT,
  constants.routes.DEVELOPER_AGENT_ACTING_FOR_CLIENT,
  applicantDetailsJourneys
)

//todo add route for this page
const planningDecisionNotice = taskDefinition(
  'planning-decision-notice',
  'Add planning decision notice',
  constants.routes.DEVELOPER_AGENT_ACTING_FOR_CLIENT,
  constants.routes.DEVELOPER_AGENT_ACTING_FOR_CLIENT,
  applicantDetailsJourneys
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
  taskSectionDefinition('Applicant information', [applicantDetails]),
  taskSectionDefinition('Development information', [
    planningDecisionNotice,
    biodiversityGainSiteNumber,
    biodiversityMetricCalculations,
    confirmDevelopmentHabitatDetails
  ])
]

Object.freeze(taskSections)
Object.freeze(checkYourAnswers)

export { taskSections, checkYourAnswers }
