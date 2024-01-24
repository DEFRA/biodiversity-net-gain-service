import constants from '../utils/constants.js'
import { applicantInfoJourneys } from './applicant-info.js'
import { landOwnershipJourneys } from './land-ownership.js'
import { siteBoundaryJourneys } from './site-boundary.js'
import { localLandChargeJourneys } from './local-land-charge.js'
import { habitatInfoJourneys } from './habitat-info.js'
import { legalAgreementJourneys } from './legal-agreement.js'

const REGISTRATION = {
  APPLICANT_INFO: 'applicantInfo',
  LAND_OWNERSHIP: 'landOwnership',
  SITE_BOUNDARY: 'siteBoundary',
  HABITAT_INFO: 'habitatInfo',
  LEGAL_AGREEMENT: 'legalAgreement',
  LOCAL_LAND_CHARGE: 'localLandCharge'
}

const JOURNEYS = {
  REGISTRATION: 'registration'
}

Object.freeze(JOURNEYS)
Object.freeze(REGISTRATION)

const taskListSections = {
  [JOURNEYS.REGISTRATION]: {
    [REGISTRATION.APPLICANT_INFO]: {
      title: 'Add details about the applicant',
      startUrl: constants.routes.AGENT_ACTING_FOR_CLIENT,
      completeUrl: constants.routes.CHECK_APPLICANT_INFORMATION,
      journeyParts: applicantInfoJourneys
    },
    [REGISTRATION.LAND_OWNERSHIP]: {
      title: 'Add land ownership details',
      startUrl: constants.routes.UPLOAD_LAND_OWNERSHIP,
      completeUrl: constants.routes.LAND_OWNERSHIP_PROOF_LIST,
      journeyParts: landOwnershipJourneys
    },
    [REGISTRATION.SITE_BOUNDARY]: {
      title: 'Add biodiversity gain site boundary details',
      startUrl: constants.routes.UPLOAD_LAND_BOUNDARY,
      completeUrl: constants.routes.CHECK_LAND_BOUNDARY_DETAILS,
      journeyParts: siteBoundaryJourneys
    },
    [REGISTRATION.HABITAT_INFO]: {
      title: 'Add habitat baseline, creation and enhancements',
      startUrl: constants.routes.UPLOAD_METRIC,
      completeUrl: constants.routes.CHECK_METRIC_DETAILS,
      journeyParts: habitatInfoJourneys
    },
    [REGISTRATION.LEGAL_AGREEMENT]: {
      title: 'Add legal agreement details',
      startUrl: constants.routes.LEGAL_AGREEMENT_TYPE,
      completeUrl: constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS,
      journeyParts: legalAgreementJourneys
    },
    [REGISTRATION.LOCAL_LAND_CHARGE]: {
      title: 'Add local land charge search certificate',
      startUrl: constants.routes.UPLOAD_LOCAL_LAND_CHARGE,
      completeUrl: constants.routes.CHECK_LOCAL_LAND_CHARGE_FILE,
      journeyParts: localLandChargeJourneys
    }
  }
}

export { JOURNEYS, REGISTRATION, taskListSections }
