import constants from '../utils/constants.js'
import {
  // ANY,
  routeDefinition,
  // journeyStep,
  journeyStepFromRoute
} from './helpers.js'

// land/legal-agreement-type
// S106: constants.LEGAL_AGREEMENT_DOCUMENTS[0].id
// ConCov: constants.LEGAL_AGREEMENT_DOCUMENTS[1].id
const LEGAL_AGREEMENT_TYPE = routeDefinition(
  constants.routes.LEGAL_AGREEMENT_TYPE,
  [constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE]
)

// // land/need-add-all-legal-files
// const NEED_ADD_ALL_LEGAL_FILES = routeDefinition(
//   constants.routes.NEED_ADD_ALL_LEGAL_FILES,
//   [] // FIXME: No session value, might be OK here, will need testing
// )

// // land/upload-legal-agreement
// const UPLOAD_LEGAL_AGREEMENT = routeDefinition(
//   constants.routes.UPLOAD_LEGAL_AGREEMENT,
//   [constants.redisKeys.LEGAL_AGREEMENT_FILES]
// )

// // land/check-legal-agreement-file
// const CHECK_LEGAL_AGREEMENT = routeDefinition(
//   constants.routes.CHECK_LEGAL_AGREEMENT,
//   [constants.redisKeys.LEGAL_AGREEMENT_CHECKED] // yes/no
// )

// // FIXME: route above and below seem to be using the same redis key, will need some kind of fix!

// // land/check-you-added-all-legal-files
// const CHECK_LEGAL_AGREEMENT_FILES = routeDefinition(
//   constants.routes.CHECK_LEGAL_AGREEMENT_FILES,
//   [constants.redisKeys.LEGAL_AGREEMENT_CHECKED]
// )

// // land/need-add-all-responsible-bodies
// const NEED_ADD_ALL_RESPONSIBLE_BODIES = routeDefinition(
//   constants.routes.NEED_ADD_ALL_RESPONSIBLE_BODIES,
//   [] // FIXME: No session value, might be OK here, will need testing
// )

// // land/add-responsible-body-conservation-covenant
// const ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT = routeDefinition(
//   constants.routes.ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT,
//   [constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES]
// )

// // land/check-responsible-bodies
// const CHECK_RESPONSIBLE_BODIES = routeDefinition(
//   constants.routes.CHECK_RESPONSIBLE_BODIES,
//   [] // FIXME: No session value, probably not OK as next route doesn't either, will need testing
// )

// // NOTE: I think some of these routes will be combined into a journey part like the file uploads

// // land/need-add-all-landowners-conservation-covenant
// const NEED_ADD_ALL_LANDOWNERS_CONSERVATION_COVENANT = routeDefinition(
//   constants.routes.NEED_ADD_ALL_LANDOWNERS_CONSERVATION_COVENANT,
//   [] // FIXME: No session value, might be OK here, will need testing
// )

// // land/landowner-conservation-covenant-individual-organisation
// const LANDOWNER_CONSERVATION_COVENANT_INDIVIDUAL_ORGANISATION = routeDefinition(
//   constants.routes.LANDOWNER_CONSERVATION_COVENANT_INDIVIDUAL_ORGANISATION,
//   [] // FIXME: No session value, will need testing
// )

// // land/add-landowner-individual-conservation-covenant
// const ADD_LANDOWNER_INDIVIDUAL_CONSERVATION_COVENANT = routeDefinition(
//   constants.routes.ADD_LANDOWNER_INDIVIDUAL_CONSERVATION_COVENANT,
//   [constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS]
// )

// // FIXME: above and below use the same key, will probably need a journey part

// // land/add-landowner-organisation-conservation-covenant
// const ADD_LANDOWNER_ORGANISATION_CONSERVATION_COVENANT = routeDefinition(
//   constants.routes.ADD_LANDOWNER_ORGANISATION_CONSERVATION_COVENANT,
//   [constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS]
// )

// // land/check-landowners
// const CHECK_LANDOWNERS = routeDefinition(
//   constants.routes.CHECK_LANDOWNERS,
//   [] // FIXME: no session key
// )

// // land/habitat-plan-legal-agreement
// const HABITAT_PLAN_LEGAL_AGREEMENT = routeDefinition(
//   constants.routes.HABITAT_PLAN_LEGAL_AGREEMENT,
//   [constants.redisKeys.HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO] // Yes or no
// )

// // land/upload-habitat-plan
// const UPLOAD_HABITAT_PLAN = routeDefinition(
//   constants.routes.UPLOAD_HABITAT_PLAN,
//   [
//     constants.redisKeys.HABITAT_PLAN_LOCATION,
//     constants.redisKeys.HABITAT_PLAN_FILE_SIZE,
//     constants.redisKeys.HABITAT_PLAN_FILE_TYPE
//   ]
// )

// // land/check-habitat-plan-file
// const CHECK_HABITAT_PLAN_FILE = routeDefinition(
//   constants.routes.CHECK_HABITAT_PLAN_FILE,
//   [constants.redisKeys.HABITAT_PLAN_CHECKED]
// )

// // land/enhancement-works-start-date
// const ENHANCEMENT_WORKS_START_DATE = routeDefinition(
//   constants.routes.ENHANCEMENT_WORKS_START_DATE,
//   [
//     constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_KEY, // The date
//     constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_OPTION // Whether a date exists
//   ]
// )

// // land/habitat-enhancements-end-date
// const HABITAT_ENHANCEMENTS_END_DATE = routeDefinition(
//   constants.routes.HABITAT_ENHANCEMENTS_END_DATE,
//   [
//     constants.redisKeys.HABITAT_ENHANCEMENTS_END_DATE_KEY,
//     constants.redisKeys.HABITAT_ENHANCEMENTS_END_DATE_OPTION
//   ]
// )

// // land/need-add-all-planning-authorities
// const NEED_ADD_ALL_PLANNING_AUTHORITIES = routeDefinition(
//   constants.routes.NEED_ADD_ALL_PLANNING_AUTHORITIES,
//   [] // FIXME: No session value, might be OK here, will need testing
// )

// // land/add-planning-authority
// const ADD_PLANNING_AUTHORITY = routeDefinition(
//   constants.routes.ADD_PLANNING_AUTHORITY,
//   [constants.redisKeys.PLANNING_AUTHORTITY_LIST]
// )

// // land/check-planning-authorities
// const CHECK_PLANNING_AUTHORITIES = routeDefinition(
//   constants.routes.CHECK_PLANNING_AUTHORITIES,
//   [] // FIXME: No session value, might be OK here, will need testing
// )

// land/check-legal-agreement-details
// const CHECK_LEGAL_AGREEMENT_DETAILS = routeDefinition(
//   constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS,
//   []
// )

// FIXME: what to do about optional things e.g. habitat plan? how would you know whether you need to return to it. I suppo
// FIXME: do I need to consider the remove pages? Can't imagine I'd want to go back to them so probs no I don't

const legalAgreementJourneys = [
  [
    journeyStepFromRoute(LEGAL_AGREEMENT_TYPE)
  ]
]

export {
  legalAgreementJourneys
}
