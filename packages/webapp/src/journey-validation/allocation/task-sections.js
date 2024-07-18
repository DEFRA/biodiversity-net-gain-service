import constants from '../../utils/constants.js'
import { taskDefinition, taskSectionDefinition } from '../utils.js'
import { applicantDetailsJourneys } from './applicant-details.js'
import { allocationInformationJourneys } from './allocation-information.js'
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
  'Add development project details',
  constants.routes.DEVELOPER_DEVELOPMENT_PROJECT_INFORMATION,
  constants.routes.DEVELOPER_DEVELOPMENT_PROJECT_INFORMATION,
  addDevelopmentProjectInformationJourneys
)

const planningDecisionNotice = taskDefinition(
  'planning-decision-notice',
  'Upload planning decision notice',
  constants.routes.DEVELOPER_UPLOAD_PLANNING_DECISION_NOTICE,
  constants.routes.DEVELOPER_CHECK_PLANNING_DECISION_NOTICE_FILE,
  planningDecisionNoticeJourneys
)

const gainSiteAllocationInformation = taskDefinition(
  'gain-site-allocation-info',
  'Add biodiversity gain site details',
  constants.routes.DEVELOPER_BNG_NUMBER,
  constants.routes.DEVELOPER_BNG_NUMBER,
  allocationInformationJourneys
)

const checkYourAnswers = {
  taskTitle: 'Submit your off-site gains information',
  items: [{
    id: 'check-your-answers',
    title: {
      text: 'Check your answers and submit'
    },
    href: constants.routes.DEVELOPER_CHECK_AND_SUBMIT,
    status: {
      tag: {
        text: constants.CANNOT_START_YET_STATUS,
        classes: 'govuk-tag--blue'
      }
    }
  }]
}

const taskSections = [
  taskSectionDefinition('Applicant information', [applicantDetails]),
  taskSectionDefinition('Development information', [
    gainSiteAllocationInformation,
    addDevlopmentProjectInformation,
    planningDecisionNotice
  ])
]

Object.freeze(taskSections)
Object.freeze(checkYourAnswers)

export { taskSections, checkYourAnswers }
