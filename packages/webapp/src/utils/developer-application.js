import constants from './constants.js'
import paymentConstants from '../payment/constants.js'
import savePayment from '../payment/save-payment.js'
import { getLpaNamesAndCodes } from './get-lpas.js'
import path from 'path'

const getDeveloperApplicationReference = session => session.get(constants.redisKeys.DEVELOPER_APP_REFERENCE) || ''

// Developer Application object schema must match the expected payload format for the Operator application
const getApplicant = (account, session) => ({
  id: account.idTokenClaims.contactId,
  role: getApplicantRole(session)
})

const getApplicantRole = session => {
  const applicantIsAgent = session.get(constants.redisKeys.IS_AGENT)
  const organisationId = session.get(constants.redisKeys.ORGANISATION_ID)
  let applicantRole

  if (applicantIsAgent === constants.APPLICANT_IS_AGENT.YES) {
    applicantRole = constants.applicantTypes.AGENT
  } else if (organisationId) {
    applicantRole = constants.applicantTypes.REPRESENTATIVE
  } else {
    applicantRole = 'individual'
  }

  return applicantRole
}

const getHabitats = session => {
  const metricData = session.get(constants.redisKeys.DEVELOPER_METRIC_DATA)
  const allocatedIdentifiers = ['d2', 'e2', 'f2', 'd3', 'e3', 'f3']
  const getModule = identifier => {
    switch (identifier.charAt(identifier.length - 1)) {
      case '2':
        return 'Created'
      case '3':
        return 'Enhanced'
    }
  }
  const getState = identifier => {
    switch (identifier.charAt(0)) {
      case 'd':
        return 'Habitat'
      case 'e':
        return 'Hedge'
      case 'f':
        return 'Watercourse'
    }
  }

  const allocated = allocatedIdentifiers.flatMap(identifier =>
    metricData[identifier].filter(details => 'Condition' in details).map(details => ({
      habitatId: details['Habitat reference Number'] ? String(details['Habitat reference Number']) : details['Habitat reference Number'],
      area: details['Length (km)'] ?? details['Area (hectares)'],
      module: getModule(identifier),
      state: getState(identifier),
      measurementUnits: 'Length (km)' in details ? 'kilometres' : 'hectares'
    }))
  )
  return allocated
}

const getFile = (session, fileType, filesize, fileLocation, optional) => ({
  contentMediaType: session.get(fileType),
  fileType: fileType.replace('-file-type', ''),
  fileSize: session.get(filesize),
  fileLocation: session.get(fileLocation),
  fileName: session.get(fileLocation) && path.basename(session.get(fileLocation)),
  optional
})

const getFiles = session => {
  // const writtenAuthorisationOptional = session.get(constants.redisKeys.IS_AGENT).toLowerCase() === 'no'
  return [
    getFile(session, constants.redisKeys.DEVELOPER_METRIC_FILE_TYPE, constants.redisKeys.DEVELOPER_METRIC_FILE_SIZE, constants.redisKeys.DEVELOPER_METRIC_LOCATION),
    getFile(session, constants.redisKeys.DEVELOPER_PLANNING_DECISION_NOTICE_FILE_TYPE, constants.redisKeys.DEVELOPER_PLANNING_DECISION_NOTICE_FILE_SIZE, constants.redisKeys.DEVELOPER_PLANNING_DECISION_NOTICE_LOCATION),
    getFile(session, constants.redisKeys.DEVELOPER_CONSENT_FILE_TYPE, constants.redisKeys.DEVELOPER_CONSENT_FILE_SIZE, constants.redisKeys.DEVELOPER_CONSENT_FILE_LOCATION),
    getFile(session, constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_FILE_TYPE, constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_FILE_SIZE, constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_LOCATION)
    // getFile(session, constants.redisKeys.WRITTEN_AUTHORISATION_FILE_TYPE, constants.redisKeys.WRITTEN_AUTHORISATION_FILE_SIZE, constants.redisKeys.WRITTEN_AUTHORISATION_LOCATION, writtenAuthorisationOptional)
  ]
}

const getGainSite = session => {
  const gainSiteReference = session.get(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER)
  const metricData = session.get(constants.redisKeys.DEVELOPER_METRIC_DATA)
  const habitat = metricData.habitatOffSiteGainSiteSummary.find(item => item['Gain site reference'] === gainSiteReference)
  const hedge = metricData.hedgeOffSiteGainSiteSummary.find(item => item['Gain site reference'] === gainSiteReference)
  const waterCourse = metricData.waterCourseOffSiteGainSiteSummary.find(item => item['Gain site reference'] === gainSiteReference)
  return {
    reference: gainSiteReference,
    offsiteUnitChange: {
      habitat: habitat ? parseFloat(habitat['Habitat Offsite unit change per gain site (Post SRM)']) : 0,
      hedge: hedge ? parseFloat(hedge['Hedge Offsite unit change per gain site (Post SRM)']) : 0,
      watercourse: waterCourse ? parseFloat(waterCourse['Watercourse Offsite unit change per gain site (Post SRM)']) : 0
    }
  }
}

const getLpaCode = name => {
  const foundLpa = getLpaNamesAndCodes().find(lpa => lpa.name === name)
  return foundLpa ? foundLpa.id : null
}

const getPayment = session => {
  const payment = savePayment(session, paymentConstants.REGISTRATION, getDeveloperApplicationReference(session))
  return {
    reference: payment.reference,
    method: payment.type
  }
}

const application = (session, account) => {
  const stringOrNull = value => value ? String(value) : null

  const metricData = session.get(constants.redisKeys.DEVELOPER_METRIC_DATA)
  const planningReference = stringOrNull(metricData.startPage.planningApplicationReference)
  const planningAuthorityName = stringOrNull(metricData.startPage.planningAuthority)

  const applicationDetails = {
    developerRegistration: {
      applicant: getApplicant(account, session),
      isLandownerLeaseholder: session.get(constants.redisKeys.DEVELOPER_LANDOWNER_OR_LEASEHOLDER),
      gainSite: getGainSite(session),
      habitats: getHabitats(session),
      files: getFiles(session),
      development: {
        localPlanningAuthority: {
          code: getLpaCode(planningAuthorityName),
          name: planningAuthorityName
        },
        planningReference,
        name: session.get(constants.redisKeys.DEVELOPER_METRIC_DATA)?.startPage.projectName
      },
      payment: getPayment(session),
      allocationReference: getDeveloperApplicationReference(session), // Need to get one after submitting application
      submittedOn: new Date().toISOString()
    }
  }
  return applicationDetails
}

export default application
