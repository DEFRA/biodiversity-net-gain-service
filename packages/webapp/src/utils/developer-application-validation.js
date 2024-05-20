import Joi from 'joi'

const developerApplicationValidation = Joi.object({
  developerAllocation: Joi.object({
    applicant: Joi.object({
      id: Joi.string().required()
    }),
    developmentDetails: Joi.object({
      projectName: Joi.string().required(),
      localAuthority: Joi.string().required(),
      planningReference: Joi.string().required()
    }),
    gainSite: Joi.object().required(),
    habitats: Joi.array().required(),
    submittedOn: Joi.date().required(),
    files: Joi.array().items(
      Joi.object({
        contentMediaType: Joi.string().required(),
        fileType: Joi.string().valid('developer-upload-metric', 'developer-upload-consent').required(),
        fileSize: Joi.number().required(),
        fileLocation: Joi.string().required(),
        fileName: Joi.string().required()
      })
    ).required(),
    allocationReference: Joi.string().allow('', null).optional(),
    payment: Joi.object({
      reference: Joi.string().allow('', null).optional(),
      method: Joi.string().required()
    }).required()
  })
})

export default developerApplicationValidation
