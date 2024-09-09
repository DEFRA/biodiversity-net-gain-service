import constants from './constants.js'
import paymentConstants from '../payment/constants.js'
import savePayment from '../payment/save-payment.js'
import { getLpaNamesAndCodes } from './get-lpas.js'
import {
  getApplicant,
  getClientDetails,
  getAddress,
  getHabitatsFromMetric,
  getFiles,
  getFile,
  getLocalPlanningAuthorities,
  getHectares,
  getGridReference,
  getLandowners
} from './shared-application.js'

const getOrganisation = session => ({
  id: session.get(constants.redisKeys.ORGANISATION_ID),
  address: getAddress(session)
})

const getHabitats = metricData => getHabitatsFromMetric(metricData)

const getApplicationReference = session => session.get(constants.redisKeys.COMBINED_CASE_APPLICATION_REFERENCE) || ''

const getLpaCode = name => {
  const foundLpa = getLpaNamesAndCodes().find(lpa => lpa.name === name)
  return foundLpa ? foundLpa.id : null
}

const getAllocationHabitats = session => {
  const matchedHabitats = session.get(constants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS_PROCESSING)

  return {
    allocated: (matchedHabitats || []).filter(m => m.matchedHabitatId).map(m => ({
      habitatId: m.matchedHabitatId,
      area: m.size
    }))
  }
}

const getPayment = session => {
  const payment = savePayment(session, paymentConstants.COMBINED, getCombinedCaseReference(session))
  return {
    reference: payment.reference,
    method: payment.type
  }
}

const getCombinedCaseReference = session => session.get(constants.redisKeys.COMBINED_CASE_APPLICATION_REFERENCE) || ''

const getRegistrationAndAllocationFiles = session => ([
  ...getFiles(session),
  getFile(session, constants.redisKeys.DEVELOPER_METRIC_FILE_TYPE, constants.redisKeys.DEVELOPER_METRIC_FILE_SIZE, constants.redisKeys.DEVELOPER_METRIC_LOCATION, false),
  getFile(session, constants.redisKeys.DEVELOPER_PLANNING_DECISION_NOTICE_FILE_TYPE, constants.redisKeys.DEVELOPER_PLANNING_DECISION_NOTICE_FILE_SIZE, constants.redisKeys.DEVELOPER_PLANNING_DECISION_NOTICE_LOCATION, false)
])

const calculateGainSite = session => {
  const metricData = session.get(constants.redisKeys.DEVELOPER_METRIC_DATA)
  const matchedHabitats = session.get(constants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS_PROCESSING)

  const habitats = matchedHabitats?.filter(h => h.state === 'Habitat' && h.matchedHabitatId).map(h => h.offsiteReference)
  const hedges = matchedHabitats?.filter(h => h.state === 'Hedge' && h.matchedHabitatId).map(h => h.offsiteReference)
  const watercourses = matchedHabitats?.filter(h => h.state === 'Watercourse' && h.matchedHabitatId).map(h => h.offsiteReference)
  const habitatRefs = [...new Set(habitats)]
  const hedgeRefs = [...new Set(hedges)]
  const watercourseRefs = [...new Set(watercourses)]

  let habitatTotal = 0
  let hedgeTotal = 0
  let watercourseTotal = 0

  habitatRefs.forEach(h => {
    const summary = metricData.habitatOffSiteGainSiteSummary?.find(item => String(item['Gain site reference']) === h)
    if (summary) {
      habitatTotal += parseFloat(summary['Habitat Offsite unit change per gain site (Post SRM)'])
    }
  })

  hedgeRefs.forEach(h => {
    const summary = metricData.hedgeOffSiteGainSiteSummary?.find(item => String(item['Gain site reference']) === h)
    if (summary) {
      hedgeTotal += parseFloat(summary['Hedge Offsite unit change per gain site (Post SRM)'])
    }
  })

  watercourseRefs.forEach(h => {
    const summary = metricData.waterCourseOffSiteGainSiteSummary?.find(item => String(item['Gain site reference']) === h)
    if (summary) {
      watercourseTotal += parseFloat(summary['Watercourse Offsite unit change per gain site (Post SRM)'])
    }
  })

  return {
    offsiteUnitChange: {
      habitat: habitatTotal,
      hedge: hedgeTotal,
      watercourse: watercourseTotal
    }
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
        gainSite: calculateGainSite(session),
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
      files: getRegistrationAndAllocationFiles(session),
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
