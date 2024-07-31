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
  NOT_STARTED: 'NOT STARTED',
  IN_PROGRESS: 'IN PROGRESS',
  COMPLETE: 'COMPLETED'
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
    title: { text: task.title },
    status: calculatedStatus.status === STATUSES.COMPLETE
      ? {
          text: calculatedStatus.status
        }
      : {
          tag: {
            text: calculatedStatus.status,
            classes: 'govuk-tag--blue'
          }
        },
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
          const uncompletedTasks = dependantSection.items.filter(item => item.status?.text !== constants.COMPLETE_REGISTRATION_TASK_STATUS && item.status?.tag?.text !== constants.COMPLETE_REGISTRATION_TASK_STATUS)
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
            item.status = {
              tag: {
                text: constants.CANNOT_START_YET_STATUS,
                classes: 'govuk-tag--blue'
              }
            }
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

const statusForDisplay = status => status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()

// Recursively iterate over a task list object and convert each `text` property (which will be the task item status) to
// have an initial capital with the rest of the string lower case.
const formatStatusesForDisplay = taskList => {
  if (Array.isArray(taskList)) {
    taskList.forEach(item => formatStatusesForDisplay(item))
  } else if (typeof taskList === 'object' && taskList !== null) {
    Object.keys(taskList).forEach(key => {
      if (key === 'text' && typeof taskList[key] === 'string') {
        taskList[key] = statusForDisplay(taskList[key])
      } else {
        formatStatusesForDisplay(taskList[key])
      }
    })
  }
}

const getTaskList = (journey, session) => {
  let taskList

  // The Check Your Answers section href is deleted later if the tasks aren't completed, so we deep clone the section to
  // prevent the original version being affected by this.
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
      const status = currentTask.status.tag?.text || currentTask.status.text
      if (status === constants.COMPLETE_REGISTRATION_TASK_STATUS) {
        completedTasks += 1
      }
    })
  })

  const canSubmit = completedTasks === (totalTasks - 1)

  // If the Check Your Answers task (ie. the last one) has an items array then the tasklist has been migrated to the v5
  // component, so we handle the submission href and status here (whereas the v4 html handles this within the template)
  const lastSection = taskList[taskList.length - 1]
  if (lastSection.items?.length) {
    const lastItem = lastSection.items[lastSection.items.length - 1]

    // If the application can be submitted then set the item status accordingly. Otherwise delete the href so Check Your
    // Answers cannot be accessed (the status will already be "CANNOT START YET" so we don't need to change it)
    if (canSubmit) {
      lastItem.status.tag.text = 'NOT STARTED YET'
    } else {
      delete lastItem.href
    }
  }

  // v5 gov uk frontend has statuses displayed in lower case with an initial capital rather than all caps as before. We
  // may be reliant elsewhere on the status being all caps, so for now instead of changing the statuses to be the
  // correct case throughout the code, we simply reformat them at this point once we're ready to display them
  formatStatusesForDisplay(taskList)

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
