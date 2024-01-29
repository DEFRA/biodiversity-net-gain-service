import { taskListSections, REGISTRATION, JOURNEYS } from './task-list-sections.js'
import constants from '../utils/constants.js'

const ANY = 'any'

const STATUSES = {
  NOT_STARTED: 'NOT STARTED',
  IN_PROGRESS: 'IN PROGRESS',
  COMPLETE: 'COMPLETED'
}

Object.freeze(STATUSES)

const getReturnObject = (status, url, title, valid) => ({ status, url, title, valid })
const arrayOfAnyComparator = JSON.stringify([ANY])

const sessionMatches = (part, session) => {
  const checkSessionMatches = ([k, v]) => {
    if (JSON.stringify(v) === arrayOfAnyComparator) {
      return session.get(k)?.length > 0
    }

    return v === ANY ? session.get(k) !== null && session.get(k) !== undefined : session.get(k) === v
  }

  return Object.entries(part.sessionDataRequired).every(checkSessionMatches)
}

const sessionMismatches = (part, session) => {
  const checkSessionMismatch = ([k, v]) => v === ANY ? false : session.get(k) !== null && session.get(k) !== v
  return Object.entries(part.sessionDataRequired).some(checkSessionMismatch)
}

const getTaskStatuses = (schema, session) => {
  const statuses = schema.journeyParts.map(journey => {
    for (const part of journey) {
      if (!sessionMatches(part, session)) {
        let valid = true

        if (part.sessionMismatchWillInvalidate && sessionMismatches(part, session)) {
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

  return statuses
}

// We should move to Joi to do the validation in a later iteration
const checkTaskStatus = (schema, session) => {
  const taskStatuses = getTaskStatuses(schema, session)

  // Return a completed task if there is one
  const completedTask = taskStatuses.find(s => s.status === STATUSES.COMPLETE)
  if (completedTask) {
    return completedTask
  }

  // If there is a valid in-progress task return it
  const inProgressTask = taskStatuses.find(s => s.valid && s.status === STATUSES.IN_PROGRESS)
  if (inProgressTask) {
    return inProgressTask
  }

  // Found no complete or valid in-progress tasks, so return not started
  return getReturnObject(STATUSES.NOT_STARTED, schema.startUrl, schema.title, true)
}

const getTaskListSectionStatus = (journey, section, session) => {
  return checkTaskStatus(taskListSections[journey][section], session)
}

const getTaskList = (journey, session) => {
  const applicantInfoTask = getTaskListSectionStatus(journey, REGISTRATION.APPLICANT_INFO, session)
  const landOwnershipTask = getTaskListSectionStatus(journey, REGISTRATION.LAND_OWNERSHIP, session)
  const siteBoundaryTask = getTaskListSectionStatus(journey, REGISTRATION.SITE_BOUNDARY, session)
  const habitatInfoTask = getTaskListSectionStatus(journey, REGISTRATION.HABITAT_INFO, session)
  const legalAgreementTask = getTaskListSectionStatus(journey, REGISTRATION.LEGAL_AGREEMENT, session)
  const localLandChargeTask = getTaskListSectionStatus(journey, REGISTRATION.LOCAL_LAND_CHARGE, session)

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

const getTaskListWithStatusCounts = (session) => {
  const taskList = getTaskList(JOURNEYS.REGISTRATION, session)

  let completedTasks = 0
  let totalTasks = 0

  taskList.forEach(task => {
    if (task.tasks.length === 1) {
      totalTasks += 1
      if (task.tasks[0].status === constants.COMPLETE_REGISTRATION_TASK_STATUS) {
        completedTasks += 1
      }
    } else {
      task.tasks.forEach(currentTask => {
        totalTasks += 1
        if (currentTask.status === constants.COMPLETE_REGISTRATION_TASK_STATUS) {
          completedTasks += 1
        }
      })
    }
  })

  const canSubmit = completedTasks === (totalTasks - 1)

  return { taskList, totalTasks, completedTasks, canSubmit }
}

export {
  STATUSES,
  getTaskList,
  getTaskListWithStatusCounts
}
