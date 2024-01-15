import constants from '../utils/constants.js'
import { applicantInfoJourneys } from './applicant-info.js'
import { landOwnershipJourneys } from './land-ownership.js'
import { siteBoundaryJourneys } from './site-boundary.js'
import { localLandChargeJourneys } from './local-land-charge.js'
import { habitatInfoJourneys } from './habitat-info.js'
import { legalAgreementJourneys } from './legal-agreement.js'

applicantInfoJourneys.map(journey => console.log(journey))

const ANY = 'any'

const STATUSES = {
  NOT_STARTED: 'NOT STARTED',
  IN_PROGRESS: 'IN PROGRESS',
  COMPLETE: 'COMPLETED'
}

const JOURNEYS = {
  REGISTRATION: 'registration'
}

const REGISTRATION = {
  APPLICANT_INFO: 'applicantInfo',
  LAND_OWNERSHIP: 'landOwnership',
  SITE_BOUNDARY: 'siteBoundary',
  HABITAT_INFO: 'habitatInfo',
  LEGAL_AGREEMENT: 'legalAgreement',
  LOCAL_LAND_CHARGE: 'localLandCharge'
}

Object.freeze(STATUSES)
Object.freeze(JOURNEYS)
Object.freeze(REGISTRATION)

const journeyDefinition = {
  [JOURNEYS.REGISTRATION]: {
    [REGISTRATION.APPLICANT_INFO]: {
      title: 'Add details about the applicant',
      startUrl: constants.routes.AGENT_ACTING_FOR_CLIENT,
      completeUrl: constants.routes.CHECK_APPLICANT_INFORMATION,
      journeyParts: applicantInfoJourneys
    },
    [REGISTRATION.LAND_OWNERSHIP]: {
      title: 'Add land ownership details',
      startUrl: constants.routes.UPLOAD_LAND_OWNERSHIP,
      completeUrl: constants.routes.LAND_OWNERSHIP_PROOF_LIST,
      journeyParts: landOwnershipJourneys
    },
    [REGISTRATION.SITE_BOUNDARY]: {
      title: 'Add biodiversity gain site boundary details',
      startUrl: constants.routes.UPLOAD_LAND_BOUNDARY,
      completeUrl: constants.routes.CHECK_LAND_BOUNDARY_DETAILS,
      journeyParts: siteBoundaryJourneys
    },
    [REGISTRATION.HABITAT_INFO]: {
      title: 'Add habitat baseline, creation and enhancements',
      startUrl: constants.routes.UPLOAD_METRIC,
      completeUrl: constants.routes.CHECK_METRIC_DETAILS,
      journeyParts: habitatInfoJourneys
    },
    [REGISTRATION.LEGAL_AGREEMENT]: {
      title: 'Add legal agreement details',
      startUrl: constants.routes.LEGAL_AGREEMENT_TYPE,
      completeUrl: constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS,
      journeyParts: legalAgreementJourneys
    },
    [REGISTRATION.LOCAL_LAND_CHARGE]: {
      title: 'Add local land charge search certificate',
      startUrl: constants.routes.UPLOAD_LOCAL_LAND_CHARGE,
      completeUrl: constants.routes.CHECK_LOCAL_LAND_CHARGE_FILE,
      journeyParts: localLandChargeJourneys
    }
  }
}

const getReturnObject = (status, url, title, valid) => ({ status, url, title, valid })

// FIXME: we should move to Joi to do the validation
const check = (schema, session) => {
  const arrayOfAnyComparator = JSON.stringify([ANY])

  const sessionMatches = ([k, v]) => {
    if (JSON.stringify(v) === arrayOfAnyComparator) {
      return session.get(k)?.length > 0
    }

    return v === ANY ? session.get(k) !== null : session.get(k) === v
  }

  const sessionMismatch = ([k, v]) => v === ANY ? false : session.get(k) !== null && session.get(k) !== v

  const journeyStatuses = schema.journeyParts.map(journey => {
    for (const part of journey) {
      if (!Object.entries(part.sessionDataRequired).every(sessionMatches)) {
        let valid = true

        if (part.sessionMismatchWillInvalidate && Object.entries(part.sessionDataRequired).some(sessionMismatch)) {
          valid = false
        }

        if (part.startUrl === schema.startUrl) {
          return getReturnObject(STATUSES.NOT_STARTED, schema.startUrl, schema.title, valid)
        }

        return getReturnObject(STATUSES.IN_PROGRESS, part.startUrl, schema.title, valid)
      }
    }

    return getReturnObject(STATUSES.COMPLETE, schema.completeUrl, schema.title, true)
  })

  // console.log(journeyStatuses)

  // Return a complete journey if there is one
  const completeJourney = journeyStatuses.find(s => s.status === STATUSES.COMPLETE)
  if (completeJourney) {
    return completeJourney
  }

  // If there is a valid in-progress journey return it
  const inProgressJourney = journeyStatuses.find(s => s.valid && s.status === STATUSES.IN_PROGRESS)
  if (inProgressJourney) {
    return inProgressJourney
  }

  // Found no complete or valid in-progress journeys, so return not started
  return getReturnObject(STATUSES.NOT_STARTED, schema.startUrl, schema.title, true)
}

// FIXME: probably just want a single function for all statuses
const getJourneySectionStatus = (journey, section, session) => {
  return check(journeyDefinition[journey][section], session)
}

const getTaskList = (journey, session) => {
  console.log('=== Applicant Info ===')
  const applicantInfoTask = getJourneySectionStatus(journey, REGISTRATION.APPLICANT_INFO, session)
  console.log('=== Land Ownership ===')
  const landOwnershipTask = getJourneySectionStatus(journey, REGISTRATION.LAND_OWNERSHIP, session)
  console.log('=== Site Boundary ===')
  const siteBoundaryTask = getJourneySectionStatus(journey, REGISTRATION.SITE_BOUNDARY, session)
  console.log('=== Habitat Info ===')
  const habitatInfoTask = getJourneySectionStatus(journey, REGISTRATION.HABITAT_INFO, session)
  console.log('=== Legal Agreement ===')
  const legalAgreementTask = getJourneySectionStatus(journey, REGISTRATION.LEGAL_AGREEMENT, session)
  console.log('=== Local Land Charge ===')
  const localLandChargeTask = getJourneySectionStatus(journey, REGISTRATION.LOCAL_LAND_CHARGE, session)

  // FIXME: how to handle the end of the land ownership journey? (probably need that last page in the
  // journey, and I think maybe for the other journeys too)

  console.log('---***---***---')
  console.log(applicantInfoTask)
  console.log(landOwnershipTask)
  console.log(siteBoundaryTask)
  console.log(habitatInfoTask)
  console.log(legalAgreementTask)
  console.log(localLandChargeTask)
  console.log('---***---***---')

  return [
    {
      taskTitle: 'Applicant information',
      tasks: [
        {
          title: applicantInfoTask.title,
          status: applicantInfoTask.status,
          url: applicantInfoTask.url,
          id: 'add-applicant-information'
        }
      ]
    },
    {
      taskTitle: 'Land information',
      tasks: [
        {
          title: landOwnershipTask.title,
          status: landOwnershipTask.status,
          url: landOwnershipTask.url,
          id: 'add-land-ownership'
        },
        {
          title: siteBoundaryTask.title,
          status: siteBoundaryTask.status,
          url: siteBoundaryTask.url,
          id: 'add-land-boundary'
        },
        {
          title: habitatInfoTask.title,
          status: habitatInfoTask.status,
          url: habitatInfoTask.url,
          id: 'add-habitat-information'
        }
      ]
    },
    {
      taskTitle: 'Legal information',
      tasks: [
        {
          title: legalAgreementTask.title,
          status: legalAgreementTask.status,
          url: legalAgreementTask.url,
          id: 'add-legal-agreement'
        },
        {
          title: localLandChargeTask.title,
          status: localLandChargeTask.status,
          url: localLandChargeTask.url,
          id: 'add-local-land-charge-search-certificate'
        }
      ]
    },
    {
      taskTitle: 'Submit your biodiversity gain site information',
      tasks: [
        {
          title: 'Check your answers and submit information',
          status: 'CANNOT START YET',
          url: constants.routes.CHECK_AND_SUBMIT,
          id: 'check-your-answers'
        }
      ]
    }
  ]
}

export {
  STATUSES,
  JOURNEYS,
  REGISTRATION,
  getJourneySectionStatus,
  getTaskList
}
