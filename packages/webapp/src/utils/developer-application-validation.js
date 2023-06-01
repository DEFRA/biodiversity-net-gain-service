import Joi from 'joi'

const developerApplicationValidation = Joi.object({
  developerAllocation: Joi.object({
    applicant: Joi.object({
      name: Joi.string().allow('', null),
      emailAddress: Joi.string().required(),
      role: Joi.string().valid('Developer').required()
    }),
    developmentDetails: Joi.object({
      projectName: Joi.string().required(),
      localAuthority: Joi.string().required(),
      planningReference: Joi.string().required()
    }),
    additionalEmailAddresses: Joi.array().items(Joi.object({
      fullName: Joi.string().required(),
      email: Joi.string().required()
    })).required(),
    biodiversityGainSiteNumber: Joi.string().allow(''),
    metricData: Joi.object().allow(null),
    referenceNumber: Joi.string().allow(''),
    submittedOn: Joi.date().required(),
    files: Joi.array().items(
      Joi.object({
        contentMediaType: Joi.string().required(),
        fileType: Joi.string().valid('developer-upload-metric', 'developer-upload-consent').required(),
        fileSize: Joi.number().required(),
        fileLocation: Joi.string().required(),
        fileName: Joi.string().required()
      })
    ).required()
  })
})

export default developerApplicationValidation
