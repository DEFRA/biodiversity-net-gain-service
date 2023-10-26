import Joi from 'joi'
import constants from './constants.js'

const landownerSchema = Joi.object({
  type: Joi.string().valid('organisation', 'individual').required(),
  organisationName: Joi.when('type', {
    is: 'organisation',
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  }),
  firstName: Joi.when('type', {
    is: 'individual',
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  }),
  middleNames: Joi.when('type', {
    is: 'individual',
    then: Joi.string().allow('').optional(),
    otherwise: Joi.forbidden()
  }),
  lastName: Joi.when('type', {
    is: 'individual',
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  })
}).required()

const responsibleBodySchema = Joi.object({
  responsibleBodyName: Joi.string().required()
}).required()

const legalAgreementPlanningAuthoritySchema = Joi.object({
  localPlanningAuthorityName: Joi.string().required()
}).required()

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
        optional: Joi.boolean().required()
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
    legalAgreementResponsibleBodies: Joi.array().items(responsibleBodySchema)
      .when('legalAgreementType', {
        is: Joi.string().not('759150000'), // When legalAgreementType is NOT '759150000'
        then: Joi.array().min(1), // Array must have at least one item
        otherwise: Joi.forbidden() // Otherwise, it shouldn't be present
      }),
    legalAgreementPlanningAuthorities: Joi.array().items(legalAgreementPlanningAuthoritySchema)
      .when('legalAgreementType', {
        is: Joi.string().valid('759150000'), // When legalAgreementType is  '759150000'
        then: Joi.array().min(1), // Array must have at least one item
        otherwise: Joi.forbidden() // Otherwise, it shouldn't be present
      }),
    legalAgreementLandowners: Joi.array().items(landownerSchema).min(1).required(),
    enhancementWorkStartDate: Joi.date().allow(null),
    legalAgreementEndDate: Joi.date().allow(null),
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
