import path from 'path'
import creditsPurchaseConstants from './credits-purchase-constants.js'
import constants from './constants.js'
import { getLpaNamesAndCodes } from './get-lpas.js'

const getLpaCode = name => {
  const foundLpa = getLpaNamesAndCodes().find(lpa => lpa.name === name)
  return foundLpa ? foundLpa.id : null
}

const getCreditAmounts = session => {
  const credits = session.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_COST_CALCULATION)
  return credits.tierCosts.map(credit => ({ code: credit.tier, qty: credit.unitAmount }))
}

const getFile = (session, fileType, filesize, fileLocation) => ({
  contentMediaType: session.get(fileType),
  fileType: fileType.replace('-file-type', ''),
  fileSize: session.get(filesize),
  fileLocation: session.get(fileLocation),
  fileName: session.get(fileLocation) && path.basename(session.get(fileLocation))
})

const getFiles = session => {
  return [
    getFile(
      session,
      creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_FILE_TYPE,
      creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_FILE_SIZE,
      creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_LOCATION
    )
  ]
}

const application = (session, account) => {
  const metricData = session.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_DATA)
  const planningAuthorityName = metricData.startPage.planningAuthority

  const applicationDetails = {
    creditsPurchase: {
      applicant: {
        id: account.idTokenClaims.contactId
      },
      development: {
        name: metricData.startPage.projectName ?? null,
        planningReference: metricData.startPage.planningApplicationReference ?? null,
        localPlanningAuthority: {
          code: getLpaCode(planningAuthorityName),
          name: planningAuthorityName ?? null
        }
      },
      products: getCreditAmounts(session),
      purchaseOrderNumber: session.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_PURCHASE_ORDER_NUMBER),
      files: getFiles(session),
      creditReference: session.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_APPLICATION_REFERENCE),
      submittedOn: new Date().toISOString()
    }
  }

  if (session.get(constants.redisKeys.ORGANISATION_ID)) {
    applicationDetails.creditsPurchase.organisation = {
      id: session.get(constants.redisKeys.ORGANISATION_ID)
    }
  }

  if (session.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_USER_TYPE) === creditsPurchaseConstants.applicantTypes.INDIVIDUAL) {
    const applicant = applicationDetails.creditsPurchase.applicant
    applicant.middleName = session.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_MIDDLE_NAME)?.middleName ?? null
    applicant.dateOfBirth = session.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_DATE_OF_BIRTH)?.split('T')[0] ?? null
    const nationality = session.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_NATIONALITY)
    applicant.nationality = nationality ? Object.values(nationality).filter(n => n !== '') : null
  }

  return applicationDetails
}

export default application
