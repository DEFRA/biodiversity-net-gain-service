import constants from '../../utils/constants.js'
import {
  ANY,
  journeyStep,
  journeyStepFromRoute
} from '../utils.js'

import {
  addLandownerIndividualRoute, addPlanningAuthorityRoute,
  addResponsibleBodyConversationConvenantRoute, checkHabitatPlanFileRoute,
  checkLandownersRoute, checkLegalAgreementDetailsRoute,
  checkLegalAgreementFilesRoute,
  checkLegalAgreementRoute, checkPlanningAuthoritiesRoute,
  checkResponsibleBodiesRoute, enhancementWorksStartDateRoute, habitatEnhancementsEndDateRoute,
  habitatPlanLegalAgreementRoute,
  landownerIndivOrgRoute,
  legalAgreementTypeRoute,
  needAddAllLegalFileRoute, needAddAllPlanningAuthoritiesRoute,
  needAddAllResponsibleBodiesRoute,
  otherLandownersRoute,
  uploadHabitatPlanRoute,
  uploadLegalAgreementRoute,
  changeTypeLegalAgreement
} from '../shared/legal-agreement.js'

// land/legal-agreement-type
// S106: constants.LEGAL_AGREEMENT_DOCUMENTS[0].id
// ConCov: constants.LEGAL_AGREEMENT_DOCUMENTS[1].id
const LEGAL_AGREEMENT_TYPE = legalAgreementTypeRoute(
  constants.routes.LEGAL_AGREEMENT_TYPE,
  constants.routes.NEED_ADD_ALL_LEGAL_FILES,
  constants.routes.NEED_LEGAL_AGREEMENT
)

// // land/need-add-all-legal-files
const NEED_ADD_ALL_LEGAL_FILES = needAddAllLegalFileRoute(
  constants.routes.NEED_ADD_ALL_LEGAL_FILES,
  constants.routes.UPLOAD_LEGAL_AGREEMENT
)

// // land/upload-legal-agreement
const UPLOAD_LEGAL_AGREEMENT = uploadLegalAgreementRoute(
  constants.routes.UPLOAD_LEGAL_AGREEMENT,
  constants.routes.CHECK_LEGAL_AGREEMENT
)

// // land/check-legal-agreement-file
const CHECK_LEGAL_AGREEMENT = checkLegalAgreementRoute(
  constants.routes.CHECK_LEGAL_AGREEMENT,
  constants.routes.UPLOAD_LEGAL_AGREEMENT,
  constants.routes.CHECK_LEGAL_AGREEMENT_FILES
)

// // land/check-you-added-all-legal-files
const CHECK_LEGAL_AGREEMENT_FILES = checkLegalAgreementFilesRoute(
  constants.routes.CHECK_LEGAL_AGREEMENT_FILES,
  constants.routes.UPLOAD_LEGAL_AGREEMENT,
  constants.routes.NEED_ADD_ALL_RESPONSIBLE_BODIES,
  constants.routes.NEED_ADD_ALL_PLANNING_AUTHORITIES
)

// // land/need-add-all-responsible-bodies
const NEED_ADD_ALL_RESPONSIBLE_BODIES = needAddAllResponsibleBodiesRoute(
  constants.routes.NEED_ADD_ALL_RESPONSIBLE_BODIES,
  constants.routes.ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT
)

// // land/add-responsible-body-conservation-covenant
const ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT = addResponsibleBodyConversationConvenantRoute(
  constants.routes.ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT,
  constants.routes.CHECK_RESPONSIBLE_BODIES
)

// // land/check-responsible-bodies
const CHECK_RESPONSIBLE_BODIES = checkResponsibleBodiesRoute(
  constants.routes.CHECK_RESPONSIBLE_BODIES,
  constants.routes.ANY_OTHER_LANDOWNERS,
  constants.routes.ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT
)

const OTHER_LANDOWNERS = otherLandownersRoute(
  constants.routes.ANY_OTHER_LANDOWNERS,
  constants.routes.LANDOWNER_INDIVIDUAL_ORGANISATION,
  constants.routes.HABITAT_PLAN_LEGAL_AGREEMENT
)

// // land/landowner-conservation-covenant-individual-organisation
const LANDOWNER_INDIVIDUAL_ORGANISATION = landownerIndivOrgRoute(
  constants.routes.LANDOWNER_INDIVIDUAL_ORGANISATION,
  constants.routes.ADD_LANDOWNER_INDIVIDUAL,
  constants.routes.ADD_LANDOWNER_ORGANISATION
)

// // land/add-landowner-individual-conservation-covenant
const ADD_LANDOWNER_INDIVIDUAL = addLandownerIndividualRoute(
  constants.routes.ADD_LANDOWNER_INDIVIDUAL,
  constants.routes.CHECK_LANDOWNERS
)

// // land/check-landowners
const CHECK_LANDOWNERS = checkLandownersRoute(
  constants.routes.CHECK_LANDOWNERS,
  constants.routes.HABITAT_PLAN_LEGAL_AGREEMENT,
  constants.routes.LANDOWNER_INDIVIDUAL_ORGANISATION
)

// // land/habitat-plan-legal-agreement
const HABITAT_PLAN_LEGAL_AGREEMENT = habitatPlanLegalAgreementRoute(
  constants.routes.HABITAT_PLAN_LEGAL_AGREEMENT,
  constants.routes.ENHANCEMENT_WORKS_START_DATE,
  constants.routes.UPLOAD_HABITAT_PLAN
)

// land/upload-habitat-plan
const UPLOAD_HABITAT_PLAN = uploadHabitatPlanRoute(
  constants.routes.UPLOAD_HABITAT_PLAN,
  constants.routes.CHECK_HABITAT_PLAN_FILE
)

// land/check-habitat-plan-file
const CHECK_HABITAT_PLAN_FILE = checkHabitatPlanFileRoute(
  constants.routes.CHECK_HABITAT_PLAN_FILE,
  constants.routes.UPLOAD_HABITAT_PLAN,
  constants.routes.ENHANCEMENT_WORKS_START_DATE
)

// // land/enhancement-works-start-date
const ENHANCEMENT_WORKS_START_DATE = enhancementWorksStartDateRoute(
  constants.routes.ENHANCEMENT_WORKS_START_DATE,
  constants.routes.HABITAT_ENHANCEMENTS_END_DATE
)

// // land/habitat-enhancements-end-date
const HABITAT_ENHANCEMENTS_END_DATE = habitatEnhancementsEndDateRoute(
  constants.routes.HABITAT_ENHANCEMENTS_END_DATE,
  constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS
)

// // land/need-add-all-planning-authorities
const NEED_ADD_ALL_PLANNING_AUTHORITIES = needAddAllPlanningAuthoritiesRoute(
  constants.routes.NEED_ADD_ALL_PLANNING_AUTHORITIES,
  constants.routes.ADD_PLANNING_AUTHORITY
)

// land/add-planning-authority
const ADD_PLANNING_AUTHORITY = addPlanningAuthorityRoute(
  constants.routes.ADD_PLANNING_AUTHORITY,
  constants.routes.CHECK_PLANNING_AUTHORITIES
)

// land/check-planning-authorities
const CHECK_PLANNING_AUTHORITIES = checkPlanningAuthoritiesRoute(
  constants.routes.CHECK_PLANNING_AUTHORITIES,
  constants.routes.ANY_OTHER_LANDOWNERS,
  constants.routes.ADD_PLANNING_AUTHORITY
)

const CHECK_LEGAL_AGREEMENT_DETAILS = checkLegalAgreementDetailsRoute(
  constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS,
  constants.routes.REGISTER_LAND_TASK_LIST
)

const CHANGE_TYPE_LEGAL_AGREEMENT = changeTypeLegalAgreement(
  constants.routes.CHANGE_TYPE_LEGAL_AGREEMENT,
  constants.routes.LEGAL_AGREEMENT_TYPE,
  constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS
)

const CON_COV_ROUTE = journeyStepFromRoute(LEGAL_AGREEMENT_TYPE, [constants.LEGAL_AGREEMENT_DOCUMENTS[1].id], true)
const S106_ROUTE = journeyStepFromRoute(LEGAL_AGREEMENT_TYPE, [constants.LEGAL_AGREEMENT_DOCUMENTS[0].id], true)
const NEED_LEGAL_FILES = journeyStepFromRoute(NEED_ADD_ALL_LEGAL_FILES, [true])
const CHECKED_LEGAL_FILES = journeyStepFromRoute(CHECK_LEGAL_AGREEMENT_FILES, ['yes'])
const NEED_RESP_BODIES = journeyStepFromRoute(NEED_ADD_ALL_RESPONSIBLE_BODIES, [true])
const NEED_PLANNING_AUTHORITIES = journeyStepFromRoute(NEED_ADD_ALL_PLANNING_AUTHORITIES, [true])
const ADD_RESP_BODIES = journeyStepFromRoute(ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT, [[ANY]])
const CHECK_RESP_BODIES = journeyStepFromRoute(CHECK_RESPONSIBLE_BODIES, ['yes'])
const YES_OTHER_LANDOWNERS = journeyStepFromRoute(OTHER_LANDOWNERS, ['yes'], true)
const NO_OTHER_LANDOWNERS = journeyStepFromRoute(OTHER_LANDOWNERS, ['no'], true)
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
  LANDOWNER_INDIVIDUAL_ORGANISATION.startUrl,
  [
    ...LANDOWNER_INDIVIDUAL_ORGANISATION.sessionKeys,
    ...ADD_LANDOWNER_INDIVIDUAL.sessionKeys
  ],
  [ANY, [ANY]]
)

const legalFilesJourneySection = [
  NEED_LEGAL_FILES,
  UPLOAD_LEGAL_FILES,
  CHECKED_LEGAL_FILES
]

const addLandownersJourneySection = [
  YES_OTHER_LANDOWNERS,
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
  CHECK_RESP_BODIES
]

const conCovNoOtherLandowners = [
  ...conCovJourneyBase,
  NO_OTHER_LANDOWNERS
]

const conCovYesOtherLandowners = [
  ...conCovJourneyBase,
  ...addLandownersJourneySection
]

const conCovNoOtherLandownersNoHabitatPlan = [
  ...conCovNoOtherLandowners,
  ...habitatPlanIncludedSection
]

const conCovYesOtherLandownersNoHabitatPlan = [
  ...conCovYesOtherLandowners,
  ...habitatPlanIncludedSection
]

const conCovNoOtherLandownersNeedHabitatPlan = [
  ...conCovNoOtherLandowners,
  ...habitatPlanNeededSection
]

const conCovYesOtherLandownersNeedHabitatPlan = [
  ...conCovYesOtherLandowners,
  ...habitatPlanNeededSection
]

const s106JourneyBase = [
  S106_ROUTE,
  ...legalFilesJourneySection,
  NEED_PLANNING_AUTHORITIES,
  ADD_LPAS,
  CHECK_LPAS
]

const s106NoOtherLandowners = [
  ...s106JourneyBase,
  NO_OTHER_LANDOWNERS
]

const s106YesOtherLandowners = [
  ...s106JourneyBase,
  ...addLandownersJourneySection
]

const s106NoOtherLandownersNoHabitatPlan = [
  ...s106NoOtherLandowners,
  ...habitatPlanIncludedSection
]

const s106NoOtherLandownersNeedHabitatPlan = [
  ...s106NoOtherLandowners,
  ...habitatPlanNeededSection
]

const s106YesOtherLandownersNoHabitatPlan = [
  ...s106YesOtherLandowners,
  ...habitatPlanIncludedSection
]

const s106YesOtherLandownersNeedHabitatPlan = [
  ...s106YesOtherLandowners,
  ...habitatPlanNeededSection
]

const legalAgreementJourneys = [
  conCovNoOtherLandownersNeedHabitatPlan,
  conCovNoOtherLandownersNoHabitatPlan,
  conCovYesOtherLandownersNeedHabitatPlan,
  conCovYesOtherLandownersNoHabitatPlan,
  s106NoOtherLandownersNoHabitatPlan,
  s106NoOtherLandownersNeedHabitatPlan,
  s106YesOtherLandownersNoHabitatPlan,
  s106YesOtherLandownersNeedHabitatPlan
]

const legalAgreementRouteDefinitions = [
  LEGAL_AGREEMENT_TYPE,
  NEED_ADD_ALL_LEGAL_FILES,
  UPLOAD_LEGAL_AGREEMENT,
  CHECK_LEGAL_AGREEMENT,
  CHECK_LEGAL_AGREEMENT_FILES,
  NEED_ADD_ALL_RESPONSIBLE_BODIES,
  ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT,
  CHECK_RESPONSIBLE_BODIES,
  OTHER_LANDOWNERS,
  LANDOWNER_INDIVIDUAL_ORGANISATION,
  ADD_LANDOWNER_INDIVIDUAL,
  CHECK_LANDOWNERS,
  HABITAT_PLAN_LEGAL_AGREEMENT,
  UPLOAD_HABITAT_PLAN,
  CHECK_HABITAT_PLAN_FILE,
  ENHANCEMENT_WORKS_START_DATE,
  HABITAT_ENHANCEMENTS_END_DATE,
  NEED_ADD_ALL_PLANNING_AUTHORITIES,
  ADD_PLANNING_AUTHORITY,
  CHECK_PLANNING_AUTHORITIES,
  CHECK_LEGAL_AGREEMENT_DETAILS,
  CHANGE_TYPE_LEGAL_AGREEMENT
]

export {
  legalAgreementJourneys,
  legalAgreementRouteDefinitions
}
