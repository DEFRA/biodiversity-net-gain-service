import constants from './constants.js'
import { getLpaNamesAndCodes } from './get-lpas.js'
import {
  getApplicant,
  getGainSite,
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

const getHabitats = metricData => getHabitatsFromMetric(metricData)

const getApplicationReference = session => session.get(constants.redisKeys.COMBINED_CASE_APPLICATION_REFERENCE) || ''

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

const getLpaCode = name => {
  const foundLpa = getLpaNamesAndCodes().find(lpa => lpa.name === name)
  return foundLpa ? foundLpa.id : null
}

const getAllocationHabitats = session => {
  const matchedHabitats = session.get(constants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS_PROCESSING)

  return {
    allocated: (matchedHabitats || []).map(m => {
      return {
        habitatId: m.matchedHabitatId,
        area: m.size,
        module: m.module,
        state: m.state,
        measurementUnits: m.measurementUnits
      }
    })
  }
}

const application = (session, account) => {
  const isLegalAgreementTypeS106 = session.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE) === '759150000'
  const stringOrNull = value => value ? String(value) : null
  const planningAuthorityName = stringOrNull(session.get(constants.redisKeys.DEVELOPER_PLANNING_AUTHORITY_LIST))

  const applicationJson = {
    combinedCase: {
      applicant: getApplicant(account, session, constants.redisKeys.IS_AGENT),
      registrationDetails: {
        habitats: getHabitats(session.get(constants.redisKeys.METRIC_DATA)),
        landBoundaryGridReference: getGridReference(session),
        landBoundaryHectares: getHectares(session),
        legalAgreementType: session.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE),
        enhancementWorkStartDate: session.get(constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_KEY),
        legalAgreementEndDate: session.get(constants.redisKeys.HABITAT_ENHANCEMENTS_END_DATE_KEY),
        habitatPlanIncludedLegalAgreementYesNo: session.get(constants.redisKeys.HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO),
        landowners: getLandowners(session),
        ...(!isLegalAgreementTypeS106 ? { conservationCovernantResponsibleBodies: session.get(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES) } : {}),
        ...(isLegalAgreementTypeS106 ? { planningObligationLPAs: getLocalPlanningAuthorities(session.get(constants.redisKeys.PLANNING_AUTHORTITY_LIST)) } : {})
      },
      allocationDetails: {
        gainSite: getGainSite(session),
        habitats: getAllocationHabitats(session),
        development: {
          localPlanningAuthority: {
            code: getLpaCode(planningAuthorityName),
            name: planningAuthorityName
          },
          planningReference: session.get(constants.redisKeys.DEVELOPER_PLANNING_APPLICATION_REF),
          name: session.get(constants.redisKeys.DEVELOPER_DEVELOPMENT_NAME)
        }
      },
      files: getFiles(session),
      applicationReference: getApplicationReference(session),
      submittedOn: new Date().toISOString(),
      payment: getPayment(session)
    }
  }

  if (applicationJson.combinedCase.applicant.role === constants.applicantTypes.AGENT) {
    applicationJson.combinedCase.agent = getClientDetails(session)
  } else if (applicationJson.combinedCase.applicant.role === constants.applicantTypes.LANDOWNER) {
    applicationJson.combinedCase.landownerAddress = getAddress(session)
  }

  if (session.get(constants.redisKeys.ORGANISATION_ID)) {
    applicationJson.combinedCase.organisation = getOrganisation(session)
  }

  // Filter blank files that are optional and remove the 'optional' property
  applicationJson.combinedCase.files = applicationJson.combinedCase.files
    .filter(file => !(file.optional && !file.fileLocation))
    .map(({ optional, ...restOfFile }) => restOfFile)

  return applicationJson
}

export default application
