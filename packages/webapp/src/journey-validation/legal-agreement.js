import constants from '../utils/constants.js'
import {
  ANY,
  routeDefinition,
  journeyStep,
  journeyStepFromRoute
} from './utils.js'

// land/legal-agreement-type
// S106: constants.LEGAL_AGREEMENT_DOCUMENTS[0].id
// ConCov: constants.LEGAL_AGREEMENT_DOCUMENTS[1].id
const LEGAL_AGREEMENT_TYPE = routeDefinition(
  constants.routes.LEGAL_AGREEMENT_TYPE,
  [constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE]
)

// // land/need-add-all-legal-files
const NEED_ADD_ALL_LEGAL_FILES = routeDefinition(
  constants.routes.NEED_ADD_ALL_LEGAL_FILES,
  [constants.redisKeys.NEED_ADD_ALL_LEGAL_FILES_CHECKED]
)

// // land/upload-legal-agreement
const UPLOAD_LEGAL_AGREEMENT = routeDefinition(
  constants.routes.UPLOAD_LEGAL_AGREEMENT,
  [constants.redisKeys.LEGAL_AGREEMENT_FILES]
)

// // land/check-legal-agreement-file
const CHECK_LEGAL_AGREEMENT = routeDefinition(
  constants.routes.CHECK_LEGAL_AGREEMENT,
  [constants.redisKeys.LEGAL_AGREEMENT_CHECKED]
)

// // land/check-you-added-all-legal-files
const CHECK_LEGAL_AGREEMENT_FILES = routeDefinition(
  constants.routes.CHECK_LEGAL_AGREEMENT_FILES,
  [constants.redisKeys.LEGAL_AGREEMENT_FILES_CHECKED]
)

// // land/need-add-all-responsible-bodies
const NEED_ADD_ALL_RESPONSIBLE_BODIES = routeDefinition(
  constants.routes.NEED_ADD_ALL_RESPONSIBLE_BODIES,
  [constants.redisKeys.NEED_ADD_ALL_RESPONSIBLE_BODIES_CHECKED]
)

// // land/add-responsible-body-conservation-covenant
const ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT = routeDefinition(
  constants.routes.ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT,
  [constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES]
)

// // land/check-responsible-bodies
const CHECK_RESPONSIBLE_BODIES = routeDefinition(
  constants.routes.CHECK_RESPONSIBLE_BODIES,
  [constants.redisKeys.RESPONSIBLE_BODIES_CHECKED]
)

// // land/need-add-all-landowners-conservation-covenant
const NEED_ADD_ALL_LANDOWNERS_CONSERVATION_COVENANT = routeDefinition(
  constants.routes.NEED_ADD_ALL_LANDOWNERS_CONSERVATION_COVENANT,
  [constants.redisKeys.NEED_ADD_ALL_LANDOWNERS_CHECKED]
)

// // land/landowner-conservation-covenant-individual-organisation
const LANDOWNER_CONSERVATION_COVENANT_INDIVIDUAL_ORGANISATION = routeDefinition(
  constants.routes.LANDOWNER_CONSERVATION_COVENANT_INDIVIDUAL_ORGANISATION,
  [constants.redisKeys.LANDOWNER_INDIVIDUAL_ORGANISATION_KEY]
)

// // land/add-landowner-individual-conservation-covenant
const ADD_LANDOWNER_INDIVIDUAL_CONSERVATION_COVENANT = routeDefinition(
  constants.routes.ADD_LANDOWNER_INDIVIDUAL_CONSERVATION_COVENANT,
  [constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS]
)

// Don't use this at the moment, but should in a later iteration. It shares session key with above
// route and either this route or that route adds to the same session value. So OK to ignore this
// route for now
// // land/add-landowner-organisation-conservation-covenant
// const ADD_LANDOWNER_ORGANISATION_CONSERVATION_COVENANT = routeDefinition(
//   constants.routes.ADD_LANDOWNER_ORGANISATION_CONSERVATION_COVENANT,
//   [constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS]
// )

// // land/check-landowners
const CHECK_LANDOWNERS = routeDefinition(
  constants.routes.CHECK_LANDOWNERS,
  [constants.redisKeys.ADDED_LANDOWNERS_CHECKED]
)

// // land/habitat-plan-legal-agreement
const HABITAT_PLAN_LEGAL_AGREEMENT = routeDefinition(
  constants.routes.HABITAT_PLAN_LEGAL_AGREEMENT,
  [constants.redisKeys.HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO]
)

// land/upload-habitat-plan
const UPLOAD_HABITAT_PLAN = routeDefinition(
  constants.routes.UPLOAD_HABITAT_PLAN,
  [
    constants.redisKeys.HABITAT_PLAN_LOCATION,
    constants.redisKeys.HABITAT_PLAN_FILE_SIZE,
    constants.redisKeys.HABITAT_PLAN_FILE_TYPE
  ]
)

// land/check-habitat-plan-file
const CHECK_HABITAT_PLAN_FILE = routeDefinition(
  constants.routes.CHECK_HABITAT_PLAN_FILE,
  [constants.redisKeys.HABITAT_PLAN_CHECKED]
)

// // land/enhancement-works-start-date
const ENHANCEMENT_WORKS_START_DATE = routeDefinition(
  constants.routes.ENHANCEMENT_WORKS_START_DATE,
  [
    // Leave out for the moment as can't handle ANY or NULL
    // constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_KEY, // The date
    constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_OPTION
  ]
)

// // land/habitat-enhancements-end-date
const HABITAT_ENHANCEMENTS_END_DATE = routeDefinition(
  constants.routes.HABITAT_ENHANCEMENTS_END_DATE,
  [
    // Leave out for the moment as can't handle ANY or NULL
    // constants.redisKeys.HABITAT_ENHANCEMENTS_END_DATE_KEY,
    constants.redisKeys.HABITAT_ENHANCEMENTS_END_DATE_OPTION
  ]
)

// // land/need-add-all-planning-authorities
const NEED_ADD_ALL_PLANNING_AUTHORITIES = routeDefinition(
  constants.routes.NEED_ADD_ALL_PLANNING_AUTHORITIES,
  [constants.redisKeys.NEED_ADD_ALL_PLANNING_AUTHORITIES_CHECKED]
)

// land/add-planning-authority
const ADD_PLANNING_AUTHORITY = routeDefinition(
  constants.routes.ADD_PLANNING_AUTHORITY,
  [constants.redisKeys.PLANNING_AUTHORTITY_LIST]
)

// land/check-planning-authorities
const CHECK_PLANNING_AUTHORITIES = routeDefinition(
  constants.routes.CHECK_PLANNING_AUTHORITIES,
  [constants.redisKeys.PLANNING_AUTHORITIES_CHECKED]
)

const CON_COV_ROUTE = journeyStepFromRoute(LEGAL_AGREEMENT_TYPE, [constants.LEGAL_AGREEMENT_DOCUMENTS[1].id], true)
const S106_ROUTE = journeyStepFromRoute(LEGAL_AGREEMENT_TYPE, [constants.LEGAL_AGREEMENT_DOCUMENTS[0].id], true)
const NEED_LEGAL_FILES = journeyStepFromRoute(NEED_ADD_ALL_LEGAL_FILES, [true])
const CHECKED_LEGAL_FILES = journeyStepFromRoute(CHECK_LEGAL_AGREEMENT_FILES, ['yes'])
const NEED_RESP_BODIES = journeyStepFromRoute(NEED_ADD_ALL_RESPONSIBLE_BODIES, [true])
const NEED_PLANNING_AUTHORITIES = journeyStepFromRoute(NEED_ADD_ALL_PLANNING_AUTHORITIES, [true])
const ADD_RESP_BODIES = journeyStepFromRoute(ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT, [[ANY]])
const CHECK_RESP_BODIES = journeyStepFromRoute(CHECK_RESPONSIBLE_BODIES, ['yes'])
const NEED_ADD_LANDOWNERS = journeyStepFromRoute(NEED_ADD_ALL_LANDOWNERS_CONSERVATION_COVENANT, [true])
const ADDED_LANDOWNERS = journeyStepFromRoute(CHECK_LANDOWNERS, ['yes'])
const HABITAT_PLAN_INCLUDED = journeyStepFromRoute(HABITAT_PLAN_LEGAL_AGREEMENT, ['Yes'], true)
const HABITAT_PLAN_NOT_INCLUDED = journeyStepFromRoute(HABITAT_PLAN_LEGAL_AGREEMENT, ['No'], true)
const ENHANCEMENT_START = journeyStepFromRoute(ENHANCEMENT_WORKS_START_DATE)
const ENHANCEMENT_END = journeyStepFromRoute(HABITAT_ENHANCEMENTS_END_DATE)
const ADD_LPAS = journeyStepFromRoute(ADD_PLANNING_AUTHORITY, [[ANY]])
const CHECK_LPAS = journeyStepFromRoute(CHECK_PLANNING_AUTHORITIES, ['yes'])

const UPLOAD_LEGAL_FILES = journeyStep(
  UPLOAD_LEGAL_AGREEMENT.startUrl,
  [
    ...UPLOAD_LEGAL_AGREEMENT.sessionKeys,
    ...CHECK_LEGAL_AGREEMENT.sessionKeys
  ],
  [[ANY], 'yes']
)

const HABITAT_PLAN_UPLOAD = journeyStep(
  UPLOAD_HABITAT_PLAN.startUrl,
  [
    ...UPLOAD_HABITAT_PLAN.sessionKeys,
    ...CHECK_HABITAT_PLAN_FILE.sessionKeys
  ],
  [ANY, ANY, ANY, 'yes']
)

const LANDOWNER_DETAILS = journeyStep(
  LANDOWNER_CONSERVATION_COVENANT_INDIVIDUAL_ORGANISATION.startUrl,
  [
    ...LANDOWNER_CONSERVATION_COVENANT_INDIVIDUAL_ORGANISATION.sessionKeys,
    ...ADD_LANDOWNER_INDIVIDUAL_CONSERVATION_COVENANT.sessionKeys
  ],
  [ANY, [ANY]]
)

const legalFilesJourneySection = [
  NEED_LEGAL_FILES,
  UPLOAD_LEGAL_FILES,
  CHECKED_LEGAL_FILES
]

const addLandownersJourneySection = [
  NEED_ADD_LANDOWNERS,
  LANDOWNER_DETAILS,
  ADDED_LANDOWNERS
]

const habitatPlanIncludedSection = [
  HABITAT_PLAN_INCLUDED,
  ENHANCEMENT_START,
  ENHANCEMENT_END
]

const habitatPlanNeededSection = [
  HABITAT_PLAN_NOT_INCLUDED,
  HABITAT_PLAN_UPLOAD,
  ENHANCEMENT_START,
  ENHANCEMENT_END
]

const conCovJourneyBase = [
  CON_COV_ROUTE,
  ...legalFilesJourneySection,
  NEED_RESP_BODIES,
  ADD_RESP_BODIES,
  CHECK_RESP_BODIES,
  ...addLandownersJourneySection
]

const conCovJourneyNoHabitatPlan = [
  ...conCovJourneyBase,
  ...habitatPlanIncludedSection
]

const conCovJourneyNeedHabitatPlan = [
  ...conCovJourneyBase,
  ...habitatPlanNeededSection
]

const s106JourneyBase = [
  S106_ROUTE,
  ...legalFilesJourneySection,
  NEED_PLANNING_AUTHORITIES,
  ADD_LPAS,
  CHECK_LPAS,
  ...addLandownersJourneySection
]

const s106JourneyNoHabitatPlan = [
  ...s106JourneyBase,
  ...habitatPlanIncludedSection
]

const s106JourneyNeedHabitatPlan = [
  ...s106JourneyBase,
  ...habitatPlanNeededSection
]

const legalAgreementJourneys = [
  conCovJourneyNoHabitatPlan,
  conCovJourneyNeedHabitatPlan,
  s106JourneyNoHabitatPlan,
  s106JourneyNeedHabitatPlan
]

export {
  legalAgreementJourneys
}
