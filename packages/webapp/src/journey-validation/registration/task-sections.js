import constants from '../../utils/constants.js'
import { taskDefinition, taskSectionDefinition } from '../utils.js'
import { applicantInfoJourneys } from './applicant-info.js'
import { landOwnershipJourneys } from './land-ownership.js'
import { siteBoundaryJourneys } from './site-boundary.js'
import { localLandChargeJourneys } from './local-land-charge.js'
import { habitatInfoJourneys } from './habitat-info.js'
import { legalAgreementJourneys } from './legal-agreement.js'

const applicantInfo = taskDefinition(
  'add-applicant-information',
  'Add details about the applicant',
  constants.routes.AGENT_ACTING_FOR_CLIENT,
  constants.routes.CHECK_APPLICANT_INFORMATION,
  applicantInfoJourneys
)

const landOwnership = taskDefinition(
  'add-land-ownership',
  'Add land ownership details',
  constants.routes.UPLOAD_LAND_OWNERSHIP,
  constants.routes.LAND_OWNERSHIP_PROOF_LIST,
  landOwnershipJourneys
)

const siteBoundary = taskDefinition(
  'add-land-boundary',
  'Add biodiversity gain site boundary details',
  constants.routes.UPLOAD_LAND_BOUNDARY,
  constants.routes.CHECK_LAND_BOUNDARY_DETAILS,
  siteBoundaryJourneys
)

const habitatInfo = taskDefinition(
  'add-habitat-information',
  'Add habitat baseline, creation and enhancements',
  constants.routes.UPLOAD_METRIC,
  constants.routes.CHECK_METRIC_DETAILS,
  habitatInfoJourneys
)

const legalAgreement = taskDefinition(
  'add-legal-agreement',
  'Add legal agreement details',
  constants.routes.LEGAL_AGREEMENT_TYPE,
  constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS,
  legalAgreementJourneys
)

const localLandCharge = taskDefinition(
  'add-local-land-charge-search-certificate',
  'Add local land charge search certificate',
  constants.routes.UPLOAD_LOCAL_LAND_CHARGE,
  constants.routes.CHECK_LOCAL_LAND_CHARGE_FILE,
  localLandChargeJourneys
)

const taskSections = [
  taskSectionDefinition('Applicant information', [applicantInfo]),
  taskSectionDefinition('Land information', [landOwnership, siteBoundary, habitatInfo]),
  taskSectionDefinition('Legal information', [legalAgreement, localLandCharge])
]

Object.freeze(taskSections)

export { taskSections }
