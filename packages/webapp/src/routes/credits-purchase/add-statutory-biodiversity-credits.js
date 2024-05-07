import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import calculateCost from '../../credits/calculate.js'
import Joi from 'joi'
import { creditsValidationFailAction, creditsValidationSchema } from '../../utils/helpers.js'

const defaultErrorMessage = { text: 'Enter at least one credit from the metric up to 2 decimal places, like 23.75' }
const charLengthErrorMessage = { text: 'Number of credits must be 10 characters or fewer' }
const inputSchema = Joi.string().max(10).regex(/^\d*(\.\d{1,2})?$/).allow('')
const backLink = creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASK_LIST

const handlers = {
  get: async (request, h) => {
    const previousCostCalculation = request.yar.get(creditsPurchaseConstants.cacheKeys.CREDITS_PURCHASE_COST_CALCULATION)
    const inputValues = (previousCostCalculation)
      ? Object.fromEntries(previousCostCalculation.tierCosts.map(({ tier, unitAmount, _ }) => [tier, unitAmount]))
      : {}
    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_CREDITS_SELECTION, {
      inputValues,
      backLink
    })
  },
  post: async (request, h) => {
    request.yar.set(creditsPurchaseConstants.cacheKeys.CREDITS_PURCHASE_COST_CALCULATION, calculateCost(request.payload))
    return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_CREDITS_COST)
  }
}

const payloadValidationSchema = creditsValidationSchema(inputSchema)

const validationFailAction = (request, h, err) => {
  const { errorMessages, errorList } = creditsValidationFailAction({
    err,
    defaultErrorMessage,
    charLengthErrorMessage
  })

  return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_CREDITS_SELECTION, {
    errorMessages,
    backLink,
    inputValues: { ...request.payload },
    err: errorList
  }).takeover()
}

export default [
  {
    method: 'GET',
    path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CREDITS_SELECTION,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CREDITS_SELECTION,
    options: {
      validate: {
        payload: payloadValidationSchema,
        failAction: validationFailAction
      }
    },
    handler: handlers.post
  }
]
