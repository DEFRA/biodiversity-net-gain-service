import constants from '../../utils/constants.js'
import { taskDefinition, taskSectionDefinition } from '../utils.js'
import { applicantDetailsJourneys } from './applicant-details.js'
import { bngNumberJourneys } from './biodiversity-net-gain-number.js'
import { addMetricCalculationsJourneys } from './add-metric-calculations.js'
import { planningDecisionNoticeJourneys } from './planning-decision-notice.js'
import { addDevelopmentProjectInformationJourneys } from './development-project-information.js'

const applicantDetails = taskDefinition(
  'applicant-details',
  'Add details about the applicant',
  constants.routes.DEVELOPER_AGENT_ACTING_FOR_CLIENT,
  constants.routes.DEVELOPER_AGENT_ACTING_FOR_CLIENT,
  applicantDetailsJourneys
)

const addDevlopmentProjectInformation = taskDefinition(
  'add-devlopment-project-information',
  'Add development project information',
  constants.routes.DEVELOPER_DEVELOPMENT_PROJECT_INFORMATION,
  constants.routes.DEVELOPER_DEVELOPMENT_PROJECT_INFORMATION,
  addDevelopmentProjectInformationJourneys
)

const planningDecisionNotice = taskDefinition(
  'planning-decision-notice',
  'Add planning decision notice',
  constants.routes.DEVELOPER_PLANNING_DECISION_UPLOAD,
  constants.routes.DEVELOPER_PLANNING_DECISION_UPLOAD,
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
  taskSectionDefinition('Development project information', [addDevlopmentProjectInformation]),
  taskSectionDefinition('Development information', [
    planningDecisionNotice,
    biodiversityGainSiteNumber,
    biodiversityMetricCalculations
  ])
]

Object.freeze(taskSections)
Object.freeze(checkYourAnswers)

export { taskSections, checkYourAnswers }
