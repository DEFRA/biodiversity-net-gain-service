import constants from './constants.js'
import path from 'path'

export const getApplicant = (account, session, isAgentKey = constants.redisKeys.IS_AGENT, orgRole = constants.applicantTypes.REPRESENTATIVE) => ({
  id: account.idTokenClaims.contactId,
  role: getApplicantRole(session, isAgentKey)
})

export const getApplicantRole = (session, isAgentKey, orgRole) => {
  const applicantIsAgent = session.get(isAgentKey)
  const organisationId = session.get(constants.redisKeys.ORGANISATION_ID)

  let applicantRole

  if (applicantIsAgent === constants.APPLICANT_IS_AGENT.YES) {
    applicantRole = constants.applicantTypes.AGENT
  } else if (organisationId) {
    applicantRole = orgRole
  } else {
    applicantRole = constants.applicantTypes.LANDOWNER
  }

  return applicantRole
}

export const getFile = (session, fileType, filesize, fileLocation, optional) => ({
  contentMediaType: session.get(fileType),
  fileType: fileType.replace('-file-type', ''),
  fileSize: session.get(filesize),
  fileLocation: session.get(fileLocation),
  fileName: session.get(fileLocation) && path.basename(session.get(fileLocation)),
  optional
})

export const getGainSite = session => {
  const gainSiteReference = session.get(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER)
  const metricData = session.get(constants.redisKeys.DEVELOPER_METRIC_DATA)
  const habitat = metricData.habitatOffSiteGainSiteSummary?.find(item => item['Gain site reference'] === gainSiteReference)
  const hedge = metricData.hedgeOffSiteGainSiteSummary?.find(item => item['Gain site reference'] === gainSiteReference)
  const waterCourse = metricData.waterCourseOffSiteGainSiteSummary?.find(item => item['Gain site reference'] === gainSiteReference)

  return {
    reference: gainSiteReference,
    offsiteUnitChange: {
      habitat: habitat ? parseFloat(habitat['Habitat Offsite unit change per gain site (Post SRM)']) : 0,
      hedge: hedge ? parseFloat(hedge['Hedge Offsite unit change per gain site (Post SRM)']) : 0,
      watercourse: waterCourse ? parseFloat(waterCourse['Watercourse Offsite unit change per gain site (Post SRM)']) : 0
    }
  }
}
