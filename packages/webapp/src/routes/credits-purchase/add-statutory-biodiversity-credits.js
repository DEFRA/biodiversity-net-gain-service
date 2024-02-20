import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import calculateCost from '../../credits/calculate.js'
import Joi from 'joi'

const errorMessage = { text: 'Enter at least one credit from the metric up to 2 decimal places, like 23.75' }
const inputSchema = Joi.string().regex(/^[0-9]*(\.\d{1,2})?$/).allow('')

const handlers = {
  get: async (request, h) => {
    const previousCostCalculation = request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_COST_CALCULATION)
    const inputValues = (previousCostCalculation)
      ? Object.fromEntries(previousCostCalculation.tierCosts.map(({ tier, unitAmount, _ }) => [tier, unitAmount]))
      : {}
    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_CREDITS_SELECTION, { inputValues })
  },
  post: async (request, h) => {
    request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_COST_CALCULATION, calculateCost(request.payload))
    return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_CREDITS_COST)
  }
}

const payloadValidationSchema = Joi.object({
  a1: inputSchema,
  a2: inputSchema,
  a3: inputSchema,
  a4: inputSchema,
  a5: inputSchema,
  h: inputSchema,
  w: inputSchema
}).custom((value, helpers) => {
  if (Object.values(value).every(v => v === '' || v === '0')) {
    throw new Error('at least one credit unit input should have a value')
  }
})

const validationFailAction = (request, h, err) => {
  const errorMessages = {}
  const errorList = []

  if (err.details.some(e => e.type === 'any.custom')) {
    const errorId = 'custom-err'
    errorMessages[errorId] = errorMessage
    errorList.push({
      ...errorMessage,
      href: `#${errorId}`
    })
  } else {
    err.details.forEach(e => {
      errorMessages[e.context.key] = errorMessage
      errorList.push({
        ...errorMessage,
        href: `#${e.context.key}-units`
      })
    })
  }

  return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_CREDITS_SELECTION, {
    errorMessages,
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
