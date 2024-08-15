import constants from './constants.js'
import {
  getApplicant,
  getClientDetails,
  getAddress,
  getHabitatsFromMetric,
  getFiles,
  getLocalPlanningAuthorities,
  getHectares,
  getGridReference,
  getPayment
} from './shared-application.js'

const getOrganisation = session => ({
  id: session.get(constants.redisKeys.ORGANISATION_ID),
  address: getAddress(session)
})

const getHabitats = session => {
  const metricData = session.get(constants.redisKeys.METRIC_DATA)
  return getHabitatsFromMetric(metricData)
}

const getApplicationReference = session => session.get(constants.redisKeys.APPLICATION_REFERENCE) || ''

const getLandowners = session => {
  const sessionLandowners = session.get(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS)
  const landownersByType = {
    organisation: [],
    individual: []
  }
  sessionLandowners?.forEach(landowner => {
    if (landowner.type === 'organisation') {
      landownersByType.organisation.push({
        organisationName: landowner.organisationName,
        email: landowner.emailAddress
      })
    } else if (landowner.type === 'individual') {
      landownersByType.individual.push({
        firstName: landowner.firstName,
        middleNames: landowner.middleNames,
        lastName: landowner.lastName,
        email: landowner.emailAddress
      })
    }
  })

  return landownersByType
}

const application = (session, account) => {
  const isLegalAgreementTypeS106 = session.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE) === '759150000'
  const applicationJson = {
    landownerGainSiteRegistration: {
      applicant: getApplicant(account, session, constants.redisKeys.IS_AGENT),
      habitats: getHabitats(session),
      files: getFiles(session),
      gainSiteReference: getApplicationReference(session),
      landBoundaryGridReference: getGridReference(session),
      landBoundaryHectares: getHectares(session),
      legalAgreementType: session.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE),
      enhancementWorkStartDate: session.get(constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_KEY),
      // BNGP-3863, change legal agreement end date to habitat enhancements end date, but leave application as legalAgreementEndDate :facepalm:
      legalAgreementEndDate: session.get(constants.redisKeys.HABITAT_ENHANCEMENTS_END_DATE_KEY),
      habitatPlanIncludedLegalAgreementYesNo: session.get(constants.redisKeys.HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO),
      landowners: getLandowners(session),
      ...(!isLegalAgreementTypeS106 ? { conservationCovernantResponsibleBodies: session.get(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES) } : {}),
      ...(isLegalAgreementTypeS106 ? { planningObligationLPAs: getLocalPlanningAuthorities(session.get(constants.redisKeys.PLANNING_AUTHORTITY_LIST)) } : {}),
      submittedOn: new Date().toISOString(),
      payment: getPayment(session)
    }
  }

  if (applicationJson.landownerGainSiteRegistration.applicant.role === constants.applicantTypes.AGENT) {
    applicationJson.landownerGainSiteRegistration.agent = getClientDetails(session)
  } else if (applicationJson.landownerGainSiteRegistration.applicant.role === constants.applicantTypes.LANDOWNER) {
    applicationJson.landownerGainSiteRegistration.landownerAddress = getAddress(session)
  }

  if (session.get(constants.redisKeys.ORGANISATION_ID)) {
    applicationJson.landownerGainSiteRegistration.organisation = getOrganisation(session)
  }

  // Filter blank files that are optional and remove the 'optional' property
  applicationJson.landownerGainSiteRegistration.files = applicationJson.landownerGainSiteRegistration.files
    .filter(file => !(file.optional && !file.fileLocation))
    .map(({ optional, ...restOfFile }) => restOfFile)

  return applicationJson
}

export default application
