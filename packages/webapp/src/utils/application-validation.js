import Joi from 'joi'
import constants from './constants.js'

const applicationValidation = Joi.object({
  landownerGainSiteRegistration: Joi.object({
    applicant: Joi.object({
      firstName: Joi.string().allow('', null),
      lastName: Joi.string(),
      role: Joi.string(),
      email: Joi.string().email()
    }),
    files: Joi.array().items(
      Joi.object({
        contentMediaType: Joi.string(),
        fileType: Joi.string().valid('legal-agreement', 'land-boundary', 'management-plan', 'metric', 'land-ownership'),
        fileSize: Joi.number(),
        fileLocation: Joi.string(),
        fileName: Joi.string()
      })
    ),
    gainSiteReference: Joi.string().allow(''),
    habitatWorkStartDate: Joi.date(),
    landBoundaryGridReference: Joi.string().regex(constants.gridReferenceRegEx),
    landBoundaryHectares: Joi.number(),
    legalAgreementParties: Joi.array().items(
      Joi.object({
        name: Joi.string(),
        role: Joi.string()
      })
    ),
    legalAgreementType: Joi.string().valid(...constants.LEGAL_AGREEMENT_DOCUMENTS.map(item => item.id)),
    legalAgreementStartDate: Joi.date(),
    otherLandowners: Joi.array().items(
      Joi.object({
        name: Joi.string()
      })
    ).when('applicant.role', {
      // if applicant not landowner then length of array must be at least 1
      is: Joi.string().disallow('Landowner'),
      then: Joi.array().items(
        Joi.object({
          name: Joi.string()
        })
      ).min(1)
    }),
    managementMonitoringStartDate: Joi.date().when('habitatWorkStartDate', {
      // managementMonitoringStartDate must be greater or equal to habitatWorkStartDate
      is: Joi.date().required(),
      then: Joi.date().min(Joi.ref('habitatWorkStartDate'))
    }),
    submittedOn: Joi.date(),
    landownerConsent: Joi.string().when('otherLandowners', {
      // landownerConsent must be true if otherLandowners is an array of 1 or more items
      is: Joi.array().min(1),
      then: Joi.valid('true'),
      otherwise: Joi.valid('true', 'false')
    })
  })
})

export default applicationValidation
