import constants from '../../utils/constants.js'
import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import { taskDefinition, taskSectionDefinition } from '../utils.js'
import { addCreditsJourneys } from './add-credits.js'
import { termsAndConditionsJourneys } from './terms-and-conditions.js'
import { purchaseOrderJourneys } from './purchase-order.js'
import { uploadMetricJourneys } from './upload-metric.js'
import { dueDiligenceJourneys } from './due-diligence.js'
import { addDevelopmentProjectInformationJourneys } from './development-project-information.js'

const uploadMetric = taskDefinition(
  'upload-metric',
  'Upload statutory biodiversity metric',
  creditsPurchaseConstants.routes.CREDITS_PURCHASE_UPLOAD_METRIC,
  creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_UPLOAD_METRIC,
  uploadMetricJourneys
)

const addDevelopmentProjectInformation = taskDefinition(
  'add-development-project-information',
  'Add development project information',
  creditsPurchaseConstants.routes.CREDITS_PURCHASE_DEVELOPMENT_PROJECT_INFORMATION,
  creditsPurchaseConstants.routes.CREDITS_PURCHASE_DEVELOPMENT_PROJECT_INFORMATION,
  addDevelopmentProjectInformationJourneys
)

const addCredits = taskDefinition(
  'add-credits',
  'Add statutory biodiversity credits',
  creditsPurchaseConstants.routes.CREDITS_PURCHASE_CREDITS_SELECTION,
  creditsPurchaseConstants.routes.CREDITS_PURCHASE_CREDITS_SELECTION,
  addCreditsJourneys
)

const purchaseOrder = taskDefinition(
  'add-purchase-order',
  'Add a purchase order number, if you have one',
  creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_PURCHASE_ORDER,
  creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_PURCHASE_ORDER,
  purchaseOrderJourneys
)

const customerDueDiligence = taskDefinition(
  'customer-due-diligence',
  'Complete customer due diligence',
  creditsPurchaseConstants.routes.CREDITS_PURCHASE_INDIVIDUAL_OR_ORG,
  creditsPurchaseConstants.routes.CREDITS_PURCHASE_CUSTOMER_DUE_DILIGENCE,
  dueDiligenceJourneys
)

const termsAndConditions = taskDefinition(
  'terms-and-conditions',
  'Accept terms and conditions',
  creditsPurchaseConstants.routes.CREDITS_PURCHASE_TERMS_AND_CONDITIONS,
  creditsPurchaseConstants.routes.CREDITS_PURCHASE_TERMS_AND_CONDITIONS,
  termsAndConditionsJourneys
)

const checkYourAnswers = {
  taskTitle: 'Submit your biodiversity gain information',
  items: [{
    id: 'check-your-answers',
    title: {
      text: 'Check your answers and submit information'
    },
    href: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_YOUR_ANSWERS,
    status: constants.CANNOT_START_YET_STATUS
  }]
}

const taskSections = [
  taskSectionDefinition('Statutory biodiversity metric', [uploadMetric]),
  taskSectionDefinition('Development information', [addDevelopmentProjectInformation]),
  taskSectionDefinition('Statutory biodiversity credits', [addCredits]),
  taskSectionDefinition('Purchase order', [purchaseOrder]),
  taskSectionDefinition('Customer due diligence (anti-money laundering)', [customerDueDiligence]),
  taskSectionDefinition('Terms and conditions', [termsAndConditions])
]

Object.freeze(taskSections)
Object.freeze(checkYourAnswers)

export { taskSections, checkYourAnswers }
