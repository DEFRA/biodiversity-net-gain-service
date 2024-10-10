import developerConstants from './developer-constants.js'
import creditsEstimationConstants from './credits-estimation-constants.js'
import creditsPurchaseConstants from './credits-purchase-constants.js'
import combinedCaseConstants from './combined-case-constants.js'

const {
  ENABLE_ROUTE_SUPPORT_FOR_ADDITIONAL_EMAIL,
  ENABLE_ROUTE_SUPPORT_FOR_DEV_JOURNEY,
  ENABLE_ROUTE_SUPPORT_FOR_CREDIT_ESTIMATION_JOURNEY,
  ENABLE_ROUTE_SUPPORT_FOR_CREDIT_PURCHASE_JOURNEY,
  ENABLE_ROUTE_SUPPORT_FOR_COMBINED_CASE_JOURNEY
} = process.env
let disabledRoutes = {}

// Disabled routes for MVP

const DEVELOPER_EMAIL_ENTRY = 'developer/email-entry'

const additionalEmailRoutes = {
  DEVELOPER_EMAIL_ENTRY
}

if (ENABLE_ROUTE_SUPPORT_FOR_ADDITIONAL_EMAIL === 'Y') {
  disabledRoutes = { ...disabledRoutes, ...additionalEmailRoutes }
}

if (ENABLE_ROUTE_SUPPORT_FOR_DEV_JOURNEY === 'Y') {
  disabledRoutes = { ...disabledRoutes, ...developerConstants.routes }
}

if (ENABLE_ROUTE_SUPPORT_FOR_CREDIT_ESTIMATION_JOURNEY === 'Y') {
  disabledRoutes = { ...disabledRoutes, ...creditsEstimationConstants.routes }
}

if (ENABLE_ROUTE_SUPPORT_FOR_CREDIT_PURCHASE_JOURNEY === 'Y') {
  disabledRoutes = { ...disabledRoutes, ...creditsPurchaseConstants.routes }
}

if (ENABLE_ROUTE_SUPPORT_FOR_COMBINED_CASE_JOURNEY === 'Y') {
  disabledRoutes = { ...disabledRoutes, ...combinedCaseConstants.routes }
}

export default disabledRoutes
