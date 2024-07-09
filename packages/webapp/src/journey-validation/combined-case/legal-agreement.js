import constants from '../../utils/constants.js'
import {
  ANY,
  routeDefinition,
  journeyStep,
  journeyStepFromRoute
} from '../utils.js'
import { getLegalAgreementDocumentType, getValidReferrerUrl } from '../../utils/helpers.js'
import { FormError } from '../../utils/form-error.js'

// land/legal-agreement-type
// S106: constants.LEGAL_AGREEMENT_DOCUMENTS[0].id
// ConCov: constants.LEGAL_AGREEMENT_DOCUMENTS[1].id
const LEGAL_AGREEMENT_TYPE = routeDefinition(
  constants.routes.LEGAL_AGREEMENT_TYPE,
  [constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE],
  (session) => {
    const legalAgreementType = session.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE)

    if (legalAgreementType !== constants.LEGAL_AGREEMENT_DOCUMENTS[3].id) {
      const referrerUrl = getValidReferrerUrl(session, constants.LAND_LEGAL_AGREEMENT_VALID_REFERRERS)
      return referrerUrl || constants.routes.NEED_ADD_ALL_LEGAL_FILES
    } else {
      return constants.routes.NEED_LEGAL_AGREEMENT
    }
  }
)

// // land/need-add-all-legal-files
const NEED_ADD_ALL_LEGAL_FILES = routeDefinition(
  constants.routes.NEED_ADD_ALL_LEGAL_FILES,
  [constants.redisKeys.NEED_ADD_ALL_LEGAL_FILES_CHECKED],
  () => {
    return constants.routes.UPLOAD_LEGAL_AGREEMENT
  }
)

// // land/upload-legal-agreement
const UPLOAD_LEGAL_AGREEMENT = routeDefinition(
  constants.routes.UPLOAD_LEGAL_AGREEMENT,
  [constants.redisKeys.LEGAL_AGREEMENT_FILES],
  (session) => {
    const id = session.get(constants.redisKeys.LEGAL_AGREEMENT_CHECK_ID)
    return `${constants.routes.CHECK_LEGAL_AGREEMENT}?id=${id}`
  }
)

// // land/check-legal-agreement-file
const CHECK_LEGAL_AGREEMENT = routeDefinition(
  constants.routes.CHECK_LEGAL_AGREEMENT,
  [constants.redisKeys.LEGAL_AGREEMENT_CHECKED],
  (session) => {
    const checkLegalAgreement = session.get(constants.redisKeys.LEGAL_AGREEMENT_CHECKED)
    session.clear(constants.redisKeys.LEGAL_AGREEMENT_CHECK_ID)
    if (checkLegalAgreement === 'no') {
      return constants.routes.UPLOAD_LEGAL_AGREEMENT
    } else if (checkLegalAgreement === 'yes') {
      return constants.routes.CHECK_LEGAL_AGREEMENT_FILES
    }
  }
)

// // land/check-you-added-all-legal-files
const CHECK_LEGAL_AGREEMENT_FILES = routeDefinition(
  constants.routes.CHECK_LEGAL_AGREEMENT_FILES,
  [constants.redisKeys.LEGAL_AGREEMENT_FILES_CHECKED],
  (session) => {
    const checkLegalAgreement = session.get(constants.redisKeys.LEGAL_AGREEMENT_FILES_CHECKED)
    const legalAgreementType = getLegalAgreementDocumentType(session.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_LEGAL_AGREEMENT_VALID_REFERRERS)
    if (checkLegalAgreement === 'no') {
      return constants.routes.UPLOAD_LEGAL_AGREEMENT
    } else if (checkLegalAgreement === 'yes') {
      if (legalAgreementType === constants.LEGAL_AGREEMENT_TYPE_CONSERVATION) {
        return referrerUrl || constants.routes.NEED_ADD_ALL_RESPONSIBLE_BODIES
      } else {
        return referrerUrl || constants.routes.NEED_ADD_ALL_PLANNING_AUTHORITIES
      }
    }
  }
)

// // land/need-add-all-responsible-bodies
const NEED_ADD_ALL_RESPONSIBLE_BODIES = routeDefinition(
  constants.routes.NEED_ADD_ALL_RESPONSIBLE_BODIES,
  [constants.redisKeys.NEED_ADD_ALL_RESPONSIBLE_BODIES_CHECKED],
  () => {
    return constants.routes.ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT
  }
)

// // land/add-responsible-body-conservation-covenant
const ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT = routeDefinition(
  constants.routes.ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT,
  [constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES],
  (session) => {
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_LEGAL_AGREEMENT_VALID_REFERRERS)
    return referrerUrl || constants.routes.CHECK_RESPONSIBLE_BODIES
  }
)

// // land/check-responsible-bodies
const CHECK_RESPONSIBLE_BODIES = routeDefinition(
  constants.routes.CHECK_RESPONSIBLE_BODIES,
  [constants.redisKeys.RESPONSIBLE_BODIES_CHECKED],
  (session, request) => {
    const { addAnotherResponsibleBody } = request.payload
    if (addAnotherResponsibleBody === 'yes') {
      session.set(constants.redisKeys.RESPONSIBLE_BODIES_CHECKED, addAnotherResponsibleBody)
      const referrerUrl = getValidReferrerUrl(session, constants.LAND_LEGAL_AGREEMENT_VALID_REFERRERS)
      return (referrerUrl || constants.routes.ANY_OTHER_LANDOWNERS)
    }
    return constants.routes.ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT
  }
)

const OTHER_LANDOWNERS = routeDefinition(
  constants.routes.ANY_OTHER_LANDOWNERS,
  [constants.redisKeys.ANY_OTHER_LANDOWNERS_CHECKED],
  (session) => {
    const anyOtherLOValue = session.get(constants.redisKeys.ANY_OTHER_LANDOWNERS_CHECKED)
    if (anyOtherLOValue === 'yes') {
      return constants.routes.LANDOWNER_INDIVIDUAL_ORGANISATION
    } else if (anyOtherLOValue === 'no') {
      session.set(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS, null)
      return constants.routes.HABITAT_PLAN_LEGAL_AGREEMENT
    } else {
      const message = 'Select yes if there are any other landowners or leaseholders'
      const href = '#anyOtherLO-yes'
      throw new FormError(message, {
        text: message,
        href
      })
    }
  }
)

// // land/need-add-all-landowners-conservation-covenant
// const NEED_ADD_ALL_LANDOWNERS_CONSERVATION_COVENANT = routeDefinition(
//   constants.routes.NEED_ADD_ALL_LANDOWNERS_CONSERVATION_COVENANT,
//   [constants.redisKeys.NEED_ADD_ALL_LANDOWNERS_CHECKED]
// )

// // land/landowner-conservation-covenant-individual-organisation
const LANDOWNER_INDIVIDUAL_ORGANISATION = routeDefinition(
  constants.routes.LANDOWNER_INDIVIDUAL_ORGANISATION,
  [constants.redisKeys.LANDOWNER_INDIVIDUAL_ORGANISATION_KEY],
  (session, request) => {
    const { individualOrOrganisation } = request.payload
    if (individualOrOrganisation === constants.individualOrOrganisationTypes.INDIVIDUAL) {
      session.set(constants.redisKeys.LANDOWNER_INDIVIDUAL_ORGANISATION_KEY, constants.individualOrOrganisationTypes.INDIVIDUAL)
      return constants.routes.ADD_LANDOWNER_INDIVIDUAL
    } else {
      session.set(constants.redisKeys.LANDOWNER_INDIVIDUAL_ORGANISATION_KEY, constants.individualOrOrganisationTypes.ORGANISATION)
      return constants.routes.ADD_LANDOWNER_ORGANISATION
    }
  }
)

// // land/add-landowner-individual-conservation-covenant
const ADD_LANDOWNER_INDIVIDUAL = routeDefinition(
  constants.routes.ADD_LANDOWNER_INDIVIDUAL,
  [constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS],
  (session) => {
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_LEGAL_AGREEMENT_VALID_REFERRERS)
    return (referrerUrl || constants.routes.CHECK_LANDOWNERS)
  }
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
  [constants.redisKeys.ADDED_LANDOWNERS_CHECKED],
  (session, request) => {
    const { addAnotherLandowner } = request.payload
    if (addAnotherLandowner === 'yes') {
      session.set(constants.redisKeys.ADDED_LANDOWNERS_CHECKED, addAnotherLandowner)
      const referrerUrl = getValidReferrerUrl(session, constants.LAND_LEGAL_AGREEMENT_VALID_REFERRERS)
      return (referrerUrl || constants.routes.HABITAT_PLAN_LEGAL_AGREEMENT)
    }
    return constants.routes.LANDOWNER_INDIVIDUAL_ORGANISATION
  }
)

// // land/habitat-plan-legal-agreement
const HABITAT_PLAN_LEGAL_AGREEMENT = routeDefinition(
  constants.routes.HABITAT_PLAN_LEGAL_AGREEMENT,
  [constants.redisKeys.HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO],
  (session, request) => {
    const { isHabitatIncludeLegalAgreement } = request.payload
    if (isHabitatIncludeLegalAgreement === 'Yes') {
      const referrerUrl = getValidReferrerUrl(session, constants.LAND_LEGAL_AGREEMENT_VALID_REFERRERS)
      return (referrerUrl || constants.routes.ENHANCEMENT_WORKS_START_DATE)
    } else {
      return constants.routes.UPLOAD_HABITAT_PLAN
    }
  }
)

// land/upload-habitat-plan
const UPLOAD_HABITAT_PLAN = routeDefinition(
  constants.routes.UPLOAD_HABITAT_PLAN,
  [
    constants.redisKeys.HABITAT_PLAN_LOCATION,
    constants.redisKeys.HABITAT_PLAN_FILE_SIZE,
    constants.redisKeys.HABITAT_PLAN_FILE_TYPE
  ],
  () => {
    return constants.routes.CHECK_HABITAT_PLAN_FILE
  }
)

// land/check-habitat-plan-file
const CHECK_HABITAT_PLAN_FILE = routeDefinition(
  constants.routes.CHECK_HABITAT_PLAN_FILE,
  [constants.redisKeys.HABITAT_PLAN_CHECKED],
  (session) => {
    const checkHabitatPlan = session.get(constants.redisKeys.HABITAT_PLAN_CHECKED)
    if (checkHabitatPlan === 'no') {
      session.set(constants.redisKeys.HABITAT_PLAN_FILE_OPTION, 'no')
      return constants.routes.UPLOAD_HABITAT_PLAN
    } else if (checkHabitatPlan === 'yes') {
      session.set(constants.redisKeys.HABITAT_PLAN_FILE_OPTION, 'yes')
      const referrerUrl = getValidReferrerUrl(session, constants.LAND_LEGAL_AGREEMENT_VALID_REFERRERS)
      const redirectUrl = referrerUrl ||
        constants.routes.ENHANCEMENT_WORKS_START_DATE
      return redirectUrl
    } else {
      const message = 'Select yes if this is the correct file'
      throw new FormError(message, {
        text: message,
        href: '#check-upload-correct-yes'
      })
    }
  }
)

// // land/enhancement-works-start-date
const ENHANCEMENT_WORKS_START_DATE = routeDefinition(
  constants.routes.ENHANCEMENT_WORKS_START_DATE,
  [
    // Leave out for the moment as can't handle ANY or NULL
    // constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_KEY, // The date
    constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_OPTION
  ],
  (session) => {
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_LEGAL_AGREEMENT_VALID_REFERRERS)
    return (referrerUrl || constants.routes.HABITAT_ENHANCEMENTS_END_DATE)
  }
)

// // land/habitat-enhancements-end-date
const HABITAT_ENHANCEMENTS_END_DATE = routeDefinition(
  constants.routes.HABITAT_ENHANCEMENTS_END_DATE,
  [
    // Leave out for the moment as can't handle ANY or NULL
    // constants.redisKeys.HABITAT_ENHANCEMENTS_END_DATE_KEY,
    constants.redisKeys.HABITAT_ENHANCEMENTS_END_DATE_OPTION
  ],
  (session) => {
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_LEGAL_AGREEMENT_VALID_REFERRERS)
    return (referrerUrl || constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS)
  }
)

// // land/need-add-all-planning-authorities
const NEED_ADD_ALL_PLANNING_AUTHORITIES = routeDefinition(
  constants.routes.NEED_ADD_ALL_PLANNING_AUTHORITIES,
  [constants.redisKeys.NEED_ADD_ALL_PLANNING_AUTHORITIES_CHECKED],
  () => {
    return constants.routes.ADD_PLANNING_AUTHORITY
  }
)

// land/add-planning-authority
const ADD_PLANNING_AUTHORITY = routeDefinition(
  constants.routes.ADD_PLANNING_AUTHORITY,
  [constants.redisKeys.PLANNING_AUTHORTITY_LIST],
  () => {
    return constants.routes.CHECK_PLANNING_AUTHORITIES
  }
)

// land/check-planning-authorities
const CHECK_PLANNING_AUTHORITIES = routeDefinition(
  constants.routes.CHECK_PLANNING_AUTHORITIES,
  [constants.redisKeys.PLANNING_AUTHORITIES_CHECKED],
  (session, request) => {
    const { addAnotherPlanningAuthority } = request.payload
    if (addAnotherPlanningAuthority === 'yes') {
      session.set(constants.redisKeys.PLANNING_AUTHORITIES_CHECKED, addAnotherPlanningAuthority)
      const referrerUrl = getValidReferrerUrl(request.yar, constants.LAND_LEGAL_AGREEMENT_VALID_REFERRERS)
      return (referrerUrl || constants.routes.ANY_OTHER_LANDOWNERS)
    }
    if (addAnotherPlanningAuthority === 'no') {
      return (constants.routes.ADD_PLANNING_AUTHORITY)
    }
  }
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
  CHECK_PLANNING_AUTHORITIES
]

export {
  legalAgreementJourneys,
  legalAgreementRouteDefinitions
}
