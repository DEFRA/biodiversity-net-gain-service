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
    const previousCostCalculation = request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_COST_CALCULATION)
    const formData = (previousCostCalculation)
      ? Object.fromEntries(previousCostCalculation.tierCosts.map(({ tier, unitAmount, _ }) => [tier, unitAmount]))
      : {}
    const errorMessages = request.yar.get('errorMessages') || null
    const errorList = request.yar.get('errorList') || null

    request.yar.clear('errorMessages')
    request.yar.clear('errorList')

    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_CREDITS_SELECTION, {
      formData,
      errorMessages,
      err: errorList,
      backLink
    })
  },
  post: async (request, h) => {
    request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_COST_CALCULATION, calculateCost(request.payload))
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

  request.yar.set('errorMessages', errorMessages)
  request.yar.set('errorList', errorList)
  request.yar.set('formData', request.payload)

  return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_CREDITS_SELECTION).takeover()
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
