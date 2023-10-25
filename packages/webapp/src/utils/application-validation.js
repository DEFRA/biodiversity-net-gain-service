import Joi from 'joi'
import constants from './constants.js'

const applicationValidation = Joi.object({

  landownerGainSiteRegistration: Joi.object({
    applicant: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      emailAddress: Joi.string().email().required(),
      contactId: Joi.string().required()
    }),
    habitatPlanIncludedLegalAgreementYesNo: Joi.string().valid('Yes', 'No').required(),
    files: Joi.array().items(
      Joi.object({
        fileType: Joi.string().valid('legal-agreement', 'local-land-charge', 'habitat-plan', 'land-boundary', 'management-plan', 'metric', 'land-ownership', 'geojson').required(),
        contentMediaType: Joi.when('optional', {
          is: true,
          then: Joi.string().allow(null),
          otherwise: Joi.string().required()
        }),
        fileSize: Joi.when('optional', {
          is: true,
          then: Joi.number().allow(null),
          otherwise: Joi.number().required()
        }),
        fileLocation: Joi.when('optional', {
          is: true,
          then: Joi.string().allow(null),
          otherwise: Joi.string().required()
        }),
        fileName: Joi.when('optional', {
          is: true,
          then: Joi.string().allow(null),
          otherwise: Joi.string().required()
        }),
        optional: Joi.boolean()
      })
    ).required(),
    gainSiteReference: Joi.string().allow(''),
    landBoundaryGridReference: Joi.string().regex(constants.gridReferenceRegEx).required(),
    landBoundaryHectares: Joi.number().required(),
    legalAgreementType: Joi.string().valid(...constants.LEGAL_AGREEMENT_DOCUMENTS.map(item => item.id)).required(),
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
    }).default([]),
    managementMonitoringStartDate: Joi.date().when('habitatWorkStartDate', {
      // managementMonitoringStartDate must be greater or equal to habitatWorkStartDate
      is: Joi.date().required(),
      then: Joi.date().min(Joi.ref('habitatWorkStartDate'))
    }).required(),
    submittedOn: Joi.date().required(),
    landownerConsent: Joi.string().when('otherLandowners', {
      // landownerConsent must be true if otherLandowners is an array of 1 or more items
      is: Joi.array().min(1),
      then: Joi.valid('true'),
      otherwise: Joi.valid('true', 'false')
    }).default('false'),
    metricData: Joi.object().allow(null),
    payment: Joi.object({
      caseType: Joi.string().required(),
      fee: Joi.number().required(),
      reference: Joi.string().allow('', null).optional(),
      type: Joi.string().required()
    })
  })
})

export default applicationValidation
