import Joi from 'joi'

const creditsApplicationValidation = Joi.object({
  creditsPurchase: Joi.object({
    applicant: Joi.object({
      id: Joi.string().required(),
      middleName: Joi.string().allow(null, '').optional(),
      dateOfBirth: Joi.string().allow(null, '').optional(),
      nationality: Joi.array().items(
        Joi.string().allow(null, '').required()
      ).optional()
    }),
    organisation: Joi.object({
      id: Joi.string().required()
    }).optional(),
    development: Joi.object({
      name: Joi.string().allow(null, '').required(),
      planningReference: Joi.string().allow(null, '').required(),
      localPlanningAuthority: Joi.object({
        code: Joi.string().allow(null, '').required(),
        name: Joi.string().allow(null, '').required()
      })
    }),
    purchaseOrderNumber: Joi.string().allow(null, '').required(),
    products: Joi.array().items(
      Joi.object({
        code: Joi.string().required(),
        qty: Joi.number().required()
      })
    ).required(),
    files: Joi.array().items(
      Joi.object({
        fileType: Joi.string().valid('credits-purchase-metric').required(),
        contentMediaType: Joi.string().required(),
        fileSize: Joi.number().required(),
        fileLocation: Joi.string().required(),
        fileName: Joi.string().required()
      })
    ).required(),
    creditReference: Joi.string().allow(null, ''),
    submittedOn: Joi.date().required()
  })
})

export default creditsApplicationValidation
