import constants from '../../utils/constants.js'
import { getLegalAgreementDocumentType, getValidReferrerUrl } from '../../utils/helpers.js'
import { FormError } from '../../utils/form-error.js'
import { routeDefinition } from '../utils.js'

const legalAgreementTypeRoute = (startUrl, nextUrl, altNextUrl) => routeDefinition(
  startUrl,
  [constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE],
  (session) => {
    const legalAgreementType = session.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE)

    if (legalAgreementType !== constants.LEGAL_AGREEMENT_DOCUMENTS[3].id) {
      const referrerUrl = getValidReferrerUrl(session, constants.LAND_LEGAL_AGREEMENT_VALID_REFERRERS)
      return referrerUrl || nextUrl
    } else {
      return altNextUrl
    }
  }
)

const needAddAllLegalFileRoute = (startUrl, nextUrl) => routeDefinition(
  startUrl,
  [constants.redisKeys.NEED_ADD_ALL_LEGAL_FILES_CHECKED],
  () => {
    return nextUrl
  }
)

const uploadLegalAgreementRoute = (startUrl, nextUrl) => routeDefinition(
  startUrl,
  [constants.redisKeys.LEGAL_AGREEMENT_FILES],
  (session) => {
    const id = session.get(constants.redisKeys.LEGAL_AGREEMENT_CHECK_ID)
    return `${nextUrl}?id=${id}`
  }
)

const checkLegalAgreementRoute = (startUrl, nextUrl, altNextUrl) => routeDefinition(
  startUrl,
  [constants.redisKeys.LEGAL_AGREEMENT_CHECKED],
  (session) => {
    const checkLegalAgreement = session.get(constants.redisKeys.LEGAL_AGREEMENT_CHECKED)
    session.clear(constants.redisKeys.LEGAL_AGREEMENT_CHECK_ID)
    if (checkLegalAgreement === 'no') {
      return nextUrl
    } else if (checkLegalAgreement === 'yes') {
      return altNextUrl
    }
  }
)

const checkLegalAgreementFilesRoute = (startUrl, nextUrl, altNextUrl, alt1NextUrl) => routeDefinition(
  startUrl,
  [constants.redisKeys.LEGAL_AGREEMENT_FILES_CHECKED],
  (session) => {
    const checkLegalAgreement = session.get(constants.redisKeys.LEGAL_AGREEMENT_FILES_CHECKED)
    const legalAgreementType = getLegalAgreementDocumentType(session.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_LEGAL_AGREEMENT_VALID_REFERRERS)
    if (checkLegalAgreement === 'no') {
      return nextUrl
    } else if (checkLegalAgreement === 'yes') {
      if (legalAgreementType === constants.LEGAL_AGREEMENT_TYPE_CONSERVATION) {
        return referrerUrl || altNextUrl
      } else {
        return referrerUrl || alt1NextUrl
      }
    }
  }
)

const needAddAllResponsibleBodiesRoute = (startUrl, nextUrl) => routeDefinition(
  startUrl,
  [constants.redisKeys.NEED_ADD_ALL_RESPONSIBLE_BODIES_CHECKED],
  () => {
    return nextUrl
  }
)

const addResponsibleBodyConversationConvenantRoute = (startUrl, nextUrl, altNextUrl) => routeDefinition(
  startUrl,
  [constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES],
  (session) => {
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_LEGAL_AGREEMENT_VALID_REFERRERS)
    return referrerUrl || nextUrl
  }
)

const checkResponsibleBodiesRoute = (startUrl, nextUrl, altNextUrl) => routeDefinition(
  startUrl,
  [constants.redisKeys.RESPONSIBLE_BODIES_CHECKED],
  (session, request) => {
    const { addAnotherResponsibleBody } = request.payload
    if (addAnotherResponsibleBody === 'yes') {
      session.set(constants.redisKeys.RESPONSIBLE_BODIES_CHECKED, addAnotherResponsibleBody)
      const referrerUrl = getValidReferrerUrl(session, constants.LAND_LEGAL_AGREEMENT_VALID_REFERRERS)
      return (referrerUrl || nextUrl)
    }
    return altNextUrl
  }
)

const otherLandownersRoute = (startUrl, nextUrl, altNextUrl) => routeDefinition(
  startUrl,
  [constants.redisKeys.ANY_OTHER_LANDOWNERS_CHECKED],
  (session) => {
    const anyOtherLOValue = session.get(constants.redisKeys.ANY_OTHER_LANDOWNERS_CHECKED)
    if (anyOtherLOValue === 'yes') {
      return nextUrl
    } else if (anyOtherLOValue === 'no') {
      session.set(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS, null)
      return altNextUrl
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

const landownerIndivOrgRoute = (startUrl, nextUrl, altNextUrl) => routeDefinition(
  startUrl,
  [constants.redisKeys.LANDOWNER_INDIVIDUAL_ORGANISATION_KEY],
  (session, request) => {
    const { individualOrOrganisation } = request.payload
    if (individualOrOrganisation === constants.individualOrOrganisationTypes.INDIVIDUAL) {
      session.set(constants.redisKeys.LANDOWNER_INDIVIDUAL_ORGANISATION_KEY, constants.individualOrOrganisationTypes.INDIVIDUAL)
      return nextUrl
    } else {
      session.set(constants.redisKeys.LANDOWNER_INDIVIDUAL_ORGANISATION_KEY, constants.individualOrOrganisationTypes.ORGANISATION)
      return altNextUrl
    }
  }
)

const addLandownerIndividualRoute = (startUrl, nextUrl) => routeDefinition(
  startUrl,
  [constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS],
  (session) => {
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_LEGAL_AGREEMENT_VALID_REFERRERS)
    return (referrerUrl || nextUrl)
  }
)

const checkLandownersRoute = (startUrl, nextUrl, altNextUrl) => routeDefinition(
  startUrl,
  [constants.redisKeys.ADDED_LANDOWNERS_CHECKED],
  (session, request) => {
    const { addAnotherLandowner } = request.payload
    if (addAnotherLandowner === 'yes') {
      session.set(constants.redisKeys.ADDED_LANDOWNERS_CHECKED, addAnotherLandowner)
      const referrerUrl = getValidReferrerUrl(session, constants.LAND_LEGAL_AGREEMENT_VALID_REFERRERS)
      return (referrerUrl || nextUrl)
    }
    return altNextUrl
  }
)

const habitatPlanLegalAgreementRoute = (startUrl, nextUrl, altNextUrl) => routeDefinition(
  startUrl,
  [constants.redisKeys.HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO],
  (session, request) => {
    const { isHabitatIncludeLegalAgreement } = request.payload
    if (isHabitatIncludeLegalAgreement === 'Yes') {
      const referrerUrl = getValidReferrerUrl(session, constants.LAND_LEGAL_AGREEMENT_VALID_REFERRERS)
      return (referrerUrl || nextUrl)
    } else {
      return altNextUrl
    }
  }
)

const uploadHabitatPlanRoute = (startUrl, nextUrl) => routeDefinition(
  startUrl,
  [
    constants.redisKeys.HABITAT_PLAN_LOCATION,
    constants.redisKeys.HABITAT_PLAN_FILE_SIZE,
    constants.redisKeys.HABITAT_PLAN_FILE_TYPE
  ],
  () => {
    return nextUrl
  }
)

const checkHabitatPlanFileRoute = (startUrl, nextUrl, altNextUrl) => routeDefinition(
  startUrl,
  [constants.redisKeys.HABITAT_PLAN_CHECKED],
  (session) => {
    const checkHabitatPlan = session.get(constants.redisKeys.HABITAT_PLAN_CHECKED)
    if (checkHabitatPlan === 'no') {
      session.set(constants.redisKeys.HABITAT_PLAN_FILE_OPTION, 'no')
      return nextUrl
    } else if (checkHabitatPlan === 'yes') {
      session.set(constants.redisKeys.HABITAT_PLAN_FILE_OPTION, 'yes')
      const referrerUrl = getValidReferrerUrl(session, constants.LAND_LEGAL_AGREEMENT_VALID_REFERRERS)
      const redirectUrl = referrerUrl ||
        altNextUrl
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

const enhancementWorksStartDateRoute = (startUrl, nextUrl) => routeDefinition(
  startUrl,
  [
    // Leave out for the moment as can't handle ANY or NULL
    // constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_KEY, // The date
    constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_OPTION
  ],
  (session) => {
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_LEGAL_AGREEMENT_VALID_REFERRERS)
    return (referrerUrl || nextUrl)
  }
)

const habitatEnhancementsEndDateRoute = (startUrl, nextUrl) => routeDefinition(
  startUrl,
  [
    // Leave out for the moment as can't handle ANY or NULL
    // constants.redisKeys.HABITAT_ENHANCEMENTS_END_DATE_KEY,
    constants.redisKeys.HABITAT_ENHANCEMENTS_END_DATE_OPTION
  ],
  (session) => {
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_LEGAL_AGREEMENT_VALID_REFERRERS)
    return (referrerUrl || nextUrl)
  }
)

const needAddAllPlanningAuthoritiesRoute = (startUrl, nextUrl, altNextUrl) => routeDefinition(
  startUrl,
  [constants.redisKeys.NEED_ADD_ALL_PLANNING_AUTHORITIES_CHECKED],
  () => {
    return nextUrl
  }
)

const addPlanningAuthorityRoute = (startUrl, nextUrl, altNextUrl) => routeDefinition(
  startUrl,
  [constants.redisKeys.PLANNING_AUTHORTITY_LIST],
  () => {
    return nextUrl
  }
)

const checkPlanningAuthoritiesRoute = (startUrl, nextUrl, altNextUrl) => routeDefinition(
  startUrl,
  [constants.redisKeys.PLANNING_AUTHORITIES_CHECKED],
  (session, request) => {
    const { addAnotherPlanningAuthority } = request.payload
    if (addAnotherPlanningAuthority === 'yes') {
      session.set(constants.redisKeys.PLANNING_AUTHORITIES_CHECKED, addAnotherPlanningAuthority)
      const referrerUrl = getValidReferrerUrl(request.yar, constants.LAND_LEGAL_AGREEMENT_VALID_REFERRERS)
      return (referrerUrl || nextUrl)
    }
    if (addAnotherPlanningAuthority === 'no') {
      return (altNextUrl)
    }
  }
)

const checkLegalAgreementDetailsRoute = (startUrl, nextUrl) => routeDefinition(
  startUrl,
  [],
  () => {
    return nextUrl
  }
)

const changeTypeLegalAgreement = (startUrl, nextUrl, nextUrl1) => routeDefinition(
  startUrl,
  [],
  (session, request) => {
    const { changeLegalAgreementType } = request.payload

    if (changeLegalAgreementType === 'yes') {
      request.yar.clear(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE)
      request.yar.clear(constants.redisKeys.LEGAL_AGREEMENT_FILES)
      request.yar.clear(constants.redisKeys.PLANNING_AUTHORTITY_LIST)
      request.yar.clear(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS)
      request.yar.clear(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS)
      request.yar.clear(constants.redisKeys.HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO)
      request.yar.clear(constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_KEY)
      request.yar.clear(constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_OPTION)
      request.yar.clear(constants.redisKeys.HABITAT_ENHANCEMENTS_END_DATE_KEY)
      request.yar.clear(constants.redisKeys.HABITAT_ENHANCEMENTS_END_DATE_OPTION)
      request.yar.clear(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES)
      request.yar.clear(constants.redisKeys.REFERER)
      return nextUrl
    } else if (changeLegalAgreementType === 'no') {
      return nextUrl1
    } else {
      const message = 'Select yes if you want to change the type of legal agreement'
      throw new FormError(message, {
        text: message,
        href: '#changeLegalTypeAgreement'
      })
    }
  }
)

export {
  legalAgreementTypeRoute,
  needAddAllLegalFileRoute,
  uploadLegalAgreementRoute,
  checkLegalAgreementRoute,
  checkLegalAgreementFilesRoute,
  needAddAllResponsibleBodiesRoute,
  addResponsibleBodyConversationConvenantRoute,
  checkResponsibleBodiesRoute,
  otherLandownersRoute,
  landownerIndivOrgRoute,
  addLandownerIndividualRoute,
  checkLandownersRoute,
  habitatPlanLegalAgreementRoute,
  uploadHabitatPlanRoute,
  checkHabitatPlanFileRoute,
  enhancementWorksStartDateRoute,
  habitatEnhancementsEndDateRoute,
  needAddAllPlanningAuthoritiesRoute,
  addPlanningAuthorityRoute,
  checkPlanningAuthoritiesRoute,
  checkLegalAgreementDetailsRoute,
  changeTypeLegalAgreement
}
