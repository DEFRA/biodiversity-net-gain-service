import constants from '../utils/constants.js'
import {
  taskSections as registrationTaskSections,
  checkYourAnswers as registrationCheckYourAnswers,
  getTaskById,
  routeDefinitions as registrationRouteDefinitions
} from './registration/task-sections.js'
import {
  taskSections as creditsPurchaseTaskSections,
  checkYourAnswers as creditsPurchaseCheckYourAnswers
} from './credits-purchase/task-sections.js'
import {
  taskSections as allocationTaskSections,
  checkYourAnswers as allocationCheckYourAnswers,
  routeDefinitions as allocationRouteDefinitions
} from './allocation/task-sections.js'
import {
  taskSections as combinedCaseTaskSections,
  checkYourAnswers as combinedCaseCheckYourAnswers,
  routeDefinitions as combinedCaseRouteDefinitions
} from './combined-case/task-sections.js'
import { FormError } from '../utils/form-error.js'

const ANY = 'any'

const STATUSES = {
  NOT_STARTED: constants.DEFAULT_REGISTRATION_TASK_STATUS,
  IN_PROGRESS: constants.IN_PROGRESS_REGISTRATION_TASK_STATUS,
  COMPLETE: constants.COMPLETE_REGISTRATION_TASK_STATUS,
  CANNOT_START_YET: constants.CANNOT_START_YET_STATUS
}

const replaceStatusesWithDisplayStatuses = taskList => {
  const statusText = status => status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
  const statusHtml = (status, id) => `<span id="${id}-status">${statusText(status)}</span>`

  const statusTag = (status, tagClass, id) => {
    return {
      tag:
        {
          html: statusHtml(status, id),
          classes: tagClass
        }
    }
  }

  const statusNoTag = (status, id) => {
    return {
      html: statusHtml(status, id)
    }
  }

  const DISPLAY_STATUSES = {
    [STATUSES.NOT_STARTED]: (id) => statusTag(STATUSES.NOT_STARTED, 'govuk-tag--grey', id),
    [STATUSES.IN_PROGRESS]: (id) => statusTag(STATUSES.IN_PROGRESS, 'govuk-tag--blue', id),
    [STATUSES.CANNOT_START_YET]: (id) => statusTag(STATUSES.CANNOT_START_YET, 'govuk-tag--grey', id),
    [STATUSES.COMPLETE]: (id) => statusNoTag(STATUSES.COMPLETE, id),
    UNKNOWN_STATUS: (id) => statusTag(STATUSES.COMPLETE, 'govuk-tag--grey', id)
  }

  taskList.forEach(task => {
    task.items.forEach(item => {
      item.status = DISPLAY_STATUSES[item.status](item.id) || DISPLAY_STATUSES.UNKNOWN_STATUS(item.id)
    })
  })
}

const getReturnObject = (status, url, valid) => ({ status, url, valid })
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
          return getReturnObject(STATUSES.NOT_STARTED, schema.startUrl, valid)
        }

        return getReturnObject(STATUSES.IN_PROGRESS, part.startUrl, valid)
      }
    }

    return getReturnObject(STATUSES.COMPLETE, schema.completeUrl, true)
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
  return getReturnObject(STATUSES.NOT_STARTED, schema.startUrl, true)
}

const getIndividualTaskStatus = (session, taskId) => {
  const regTask = getTaskById(taskId)
  const { status } = checkTaskStatus(regTask, session)
  return status
}

const getTaskItems = (task, session) => {
  const calculatedStatus = checkTaskStatus(task, session)
  return {
    id: task.id,
    title: { html: `<span id='${task.id}'>${task.title}</span>` },
    status: calculatedStatus.status,
    href: calculatedStatus.url
  }
}

const retrieveTask = (routeDefinitions, startUrl) => {
  return routeDefinitions.find(route => route.startUrl === startUrl) || null
}

const generateTaskList = (taskSections, session) => {
  const locked = (section, taskList) => {
    if (section.dependantIds && section.dependantIds.length > 0) {
      for (const dependantId of section.dependantIds) {
        const dependantSection = taskList.find(s => s.id === dependantId)
        if (dependantSection) {
          const uncompletedTasks = dependantSection.items.filter(item => item.status !== STATUSES.COMPLETE)
          if (uncompletedTasks.length > 0) {
            return true
          }
        }
      }
    }
    return false
  }

  const taskList = taskSections.map(section => ({
    taskTitle: section.title,
    items: section.tasks.map(task => getTaskItems(task, session)),
    id: section.id,
    dependantIds: section.dependantIds
  }))

  const lockedTaskList = taskList.map(section => {
    const isLocked = locked(section, taskList)
    if (isLocked) {
      return {
        ...section,
        ...{
          items: section.items.map(item => {
            item.status = STATUSES.CANNOT_START_YET
            item.isLocked = true
            item.href = undefined
            return item
          })
        }
      }
    }
    return section
  })

  return lockedTaskList
}

const getTaskList = (journey, session) => {
  let taskList

  // We deep clone the Check Your Answers section so the original isn't affected when we amend the status or href later.
  switch (journey) {
    case constants.applicationTypes.REGISTRATION:
      taskList = generateTaskList(registrationTaskSections, session)
      taskList.push(structuredClone(registrationCheckYourAnswers))
      break
    case constants.applicationTypes.CREDITS_PURCHASE:
      taskList = generateTaskList(creditsPurchaseTaskSections, session)
      taskList.push(structuredClone(creditsPurchaseCheckYourAnswers))
      break
    case constants.applicationTypes.ALLOCATION:
      taskList = generateTaskList(allocationTaskSections, session)
      taskList.push(structuredClone(allocationCheckYourAnswers))
      break
    case constants.applicationTypes.COMBINED_CASE:
      taskList = generateTaskList(combinedCaseTaskSections, session)
      taskList.push(structuredClone(combinedCaseCheckYourAnswers))
      break
    default:
      taskList = []
  }

  let completedTasks = 0
  let totalTasks = 0

  taskList.forEach(task => {
    task.items.forEach(currentTask => {
      totalTasks += 1
      if (currentTask.status === STATUSES.COMPLETE) {
        completedTasks += 1
      }
    })
  })

  const canSubmit = completedTasks === (totalTasks - 1)

  const lastSection = taskList.at(-1)
  const lastItem = lastSection.items.at(-1)

  // If the application can be submitted then set the status of the Check Your Answers item to NOT_STARTED (it can never
  // be anything else since the task list cannot be returned to once Check Your Answers has been submitted). Otherwise,
  // set the href to undefined so it cannot be visited (the status defaults to CANNOT_START_YET so we don't need to
  // change it).
  if (canSubmit) {
    lastItem.status = STATUSES.NOT_STARTED
  } else {
    lastItem.href = undefined
  }

  // The task list requires the status to be in a specific format, so we iterate over the task list items and replace
  // the status with the correctly-formatted status for display
  replaceStatusesWithDisplayStatuses(taskList)

  return { taskList, totalTasks, completedTasks, canSubmit }
}

const getNextStep = (request, h, errCallback) => {
  const path = request.path
  const journey = request.yar.get(constants.redisKeys.APPLICATION_TYPE)
  let task
  switch (journey) {
    case constants.applicationTypes.REGISTRATION:
      task = retrieveTask(registrationRouteDefinitions, path)
      break
    case constants.applicationTypes.CREDITS_PURCHASE:
      break
    case constants.applicationTypes.ALLOCATION:
      task = retrieveTask(allocationRouteDefinitions, path)
      break
    case constants.applicationTypes.COMBINED_CASE:
      task = retrieveTask(combinedCaseRouteDefinitions, path)
      break
  }

  if (task?.nextUrl) {
    try {
      const nextUrl = task.nextUrl(request.yar, request)
      if (nextUrl) {
        return h.redirect(nextUrl)
      }
    } catch (e) {
      if (e instanceof FormError) {
        return errCallback({
          text: e.text,
          href: e.href
        })
      }
      return errCallback(e)
    }
  }

  throw new Error('Next URL is not set')
}

export {
  getTaskList,
  getIndividualTaskStatus,
  getNextStep
}
