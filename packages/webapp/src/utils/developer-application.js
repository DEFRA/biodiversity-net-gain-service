import constants from './constants.js'
import paymentConstants from '../payment/constants.js'
import savePayment from '../payment/save-payment.js'
import path from 'path'

const getDeveloperApplicationReference = session => session.get(constants.redisKeys.DEVELOPER_APP_REFERENCE) || ''

// {
//   contentMediaType: session.get(constants.redisKeys.DEVELOPER_CONSENT_FILE_TYPE),
//   fileType: 'developer-upload-consent',
//   fileSize: session.get(constants.redisKeys.DEVELOPER_CONSENT_FILE_SIZE),
//   fileLocation: session.get(constants.redisKeys.DEVELOPER_CONSENT_FILE_LOCATION),
//   fileName: session.get(constants.redisKeys.DEVELOPER_CONSENT_FILE_NAME) && path.basename(session.get(constants.redisKeys.DEVELOPER_CONSENT_FILE_LOCATION))
// }

// Developer Application object schema must match the expected payload format for the Operator application
export default (session, account) => {
  return {
    developerAllocation: {
      applicant: {
        id: account.idTokenClaims.contactId
      },
      developmentDetails: {
        projectName: session.get(constants.redisKeys.DEVELOPER_DEVELOPMENT_NAME),
        localAuthority: session.get(constants.redisKeys.DEVELOPER_PLANNING_AUTHORITY_LIST),
        planningReference: session.get(constants.redisKeys.DEVELOPER_PLANNING_APPLICATION_REF)
      },
      gainSite: getGainSite(session),
      habitats: getHabitats(session),
      submittedOn: new Date().toISOString(),
      files: [
        {
          contentMediaType: session.get(constants.redisKeys.DEVELOPER_METRIC_FILE_TYPE),
          fileType: 'developer-upload-metric',
          fileSize: session.get(constants.redisKeys.DEVELOPER_METRIC_FILE_SIZE),
          fileLocation: session.get(constants.redisKeys.DEVELOPER_METRIC_LOCATION),
          fileName: session.get(constants.redisKeys.DEVELOPER_METRIC_FILE_NAME) && path.basename(session.get(constants.redisKeys.DEVELOPER_METRIC_LOCATION))
        }
      ],
      allocationReference: getDeveloperApplicationReference(session),
      payment: getPayment(session)
    }
  }
}

const getPayment = session => {
  const payment = savePayment(session, paymentConstants.ALLOCATION, getDeveloperApplicationReference(session))
  return {
    reference: payment.reference,
    method: payment.type
  }
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
