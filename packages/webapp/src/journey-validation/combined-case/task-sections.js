import constants from '../../utils/constants.js'
import { taskDefinition, taskSectionDefinition } from '../utils.js'
import { applicantInfoJourneys } from '../registration/applicant-info.js'
import { allocationInformationJourneys } from '../allocation/allocation-information.js'

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

const gainSiteAllocationInformation = taskDefinition(
  'gain-site-allocation-info',
  'Add biodiversity gain site details',
  constants.routes.DEVELOPER_BNG_NUMBER,
  constants.routes.DEVELOPER_BNG_NUMBER,
  allocationInformationJourneys
)

const tasksById = {
  [REGISTRATIONCONSTANTS.APPLICANT_INFO]: applicantInfo
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

const appInfoId = 'app-info-id'
const devInfoId = 'dev-info-id'

const taskSections = [
  taskSectionDefinition('Applicant information', [applicantInfo], appInfoId),
  taskSectionDefinition('Development information', [
    gainSiteAllocationInformation
  ],
  devInfoId,
  appInfoId)
]

const getTaskById = (taskId) => {
  return tasksById[taskId] || null
}

Object.freeze(taskSections)
Object.freeze(checkYourAnswers)

export { taskSections, checkYourAnswers, getTaskById, REGISTRATIONCONSTANTS }
