import creditsApplication from '../../utils/credits-application.js'
import creditsApplicationValidation from '../../utils/credits-application-validation.js'
import { postJson } from '../../utils/http.js'
import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import constants from '../../utils/constants.js'
import getOrganisationDetails from '../../utils/get-organisation-details.js'
import {
  getHumanReadableFileSize,
  dateToString
} from '../../utils/helpers.js'

const getApplicationDetails = (session, currentOrganisation) => {
  const metricData = session.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_DATA)
  const metricFileSize = getHumanReadableFileSize(session.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_FILE_SIZE), 1)
  const credits = session.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_COST_CALCULATION)
  const creditsAmounts = Object.fromEntries(credits.tierCosts.map(element => [element.tier, element.unitAmount]))
  const usingPurchaseOrder = session.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_PURCHASE_ORDER_USED)
  const nationality = session.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_NATIONALITY)
  const nationalityHtml = nationality ? Object.values(nationality).filter(n => n !== '').join('<br/>') : ''

  return {
    metric: {
      fileName: session.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_FILE_NAME),
      fileNameUrl: creditsPurchaseConstants.routes.CREDITS_PURCHASE_UPLOAD_METRIC,
      fileSize: metricFileSize,
      detailsConfirmed: session.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_DETAILS_CONFIRMED),
      detailsConfirmedUrl: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CONFIRM_DEV_DETAILS,
      projectName: metricData.startPage.projectName,
      localAuthority: metricData.startPage.planningAuthority,
      planningRef: metricData.startPage.planningApplicationReference
    },
    credits: {
      amounts: creditsAmounts,
      total: credits.total.toLocaleString('en-gb', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }),
      changeUrl: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CREDITS_SELECTION
    },
    purchaseOrder: {
      usingPurchaseOrder,
      number: session.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_PURCHASE_ORDER_NUMBER),
      changeUrl: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_PURCHASE_ORDER
    },
    dueDiligence: {
      individualOrOrg: session.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_USER_TYPE),
      individualOrOrgUrl: creditsPurchaseConstants.routes.CREDITS_PURCHASE_INDIVIDUAL_OR_ORG,
      organisationName: currentOrganisation,
      middleName: session.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_MIDDLE_NAME)?.middleName,
      middleNameUrl: creditsPurchaseConstants.routes.CREDITS_PURCHASE_MIDDLE_NAME,
      dateOfBirth: dateToString(session.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_DATE_OF_BIRTH)),
      dateOfBirthUrl: creditsPurchaseConstants.routes.CREDITS_PURCHASE_DATE_OF_BIRTH,
      nationality: nationalityHtml,
      nationalityUrl: creditsPurchaseConstants.routes.CREDITS_PURCHASE_NATIONALITY
    }
  }
}

const handlers = {
  get: (request, h) => {
    const claims = request.auth.credentials.account.idTokenClaims
    const { currentOrganisation } = getOrganisationDetails(claims)
    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_CHECK_YOUR_ANSWERS, {
      ...getApplicationDetails(request.yar, currentOrganisation),
      backLink: creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASK_LIST
    })
  },
  post: async (request, h) => {
    const { value, error } = creditsApplicationValidation.validate(creditsApplication(request.yar, request.auth.credentials.account))
    if (error) {
      throw new Error(error)
    }

    const result = await postJson(`${constants.AZURE_FUNCTION_APP_URL}/processcreditspurchaseapplication`, value)
    request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_APPLICATION_REFERENCE, result.creditReference)
    return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_CONFIRMATION)
  }
}

export default [
  {
    method: 'GET',
    path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_YOUR_ANSWERS,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_YOUR_ANSWERS,
    handler: handlers.post
  }
]
