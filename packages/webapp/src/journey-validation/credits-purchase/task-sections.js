import constants from '../../utils/constants.js'
import { taskDefinition, taskSectionDefinition } from '../utils.js'

const uploadMetric = taskDefinition(
  'upload-metric',
  'Upload statutory biodiversity metric',
  '#',
  '#',
  []
)

const addCredits = taskDefinition(
  'add-credits',
  'Add statutory biodiversity credits',
  '#',
  '#',
  []
)

const purchaseOrder = taskDefinition(
  'add-purchase-order',
  'Add a purchase order number',
  '#',
  '#',
  []
)

const customerDueDiligence = taskDefinition(
  'customer-due-diligence',
  'Complete customer due diligence',
  '#',
  '#',
  []
)

const termsAndConditions = taskDefinition(
  'terms-and-conditions',
  'Accept terms and conditions',
  '#',
  '#',
  []
)

const checkYourAnswers = {
  taskTitle: 'Submit your biodiversity gain information',
  tasks: [{
    id: 'check-your-answers',
    title: 'Check your answers before you submit them',
    url: '#',
    status: constants.CANNOT_START_YET_STATUS
  }]
}

const taskSections = [
  taskSectionDefinition('Statutory biodiversity metric', [uploadMetric]),
  taskSectionDefinition('Statutory biodiversity credits', [addCredits]),
  taskSectionDefinition('Purchase order', [purchaseOrder]),
  taskSectionDefinition('Customer due diligence (CDD)', [customerDueDiligence]),
  taskSectionDefinition('Terms and conditions', [termsAndConditions])
]

Object.freeze(taskSections)
Object.freeze(checkYourAnswers)

export { taskSections, checkYourAnswers }
