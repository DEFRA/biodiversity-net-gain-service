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
  checkYourAnswers as allocationCheckYourAnswers
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
  const taskStatus = getTaskStatus(regTask, session)
  return taskStatus.status
}
const getTaskStatus = (task, session) => {
  const calculatedStatus = checkTaskStatus(task, session)
  return {
    id: task.id,
    title: task.title,
    status: calculatedStatus.status,
    url: calculatedStatus.url
  }
}

const retrieveTask = (routeDefinitions, startUrl) => {
  return routeDefinitions.find(route => route.startUrl === startUrl) || null
}

const generateTaskList = (taskSections, session) => {
  const taskList = taskSections.map(section => ({
    taskTitle: section.title,
    tasks: section.tasks.map(task => getTaskStatus(task, session))
  }))
  return taskList
}

const getTaskList = (journey, session) => {
  let taskList

  switch (journey) {
    case constants.applicationTypes.REGISTRATION:
      taskList = generateTaskList(registrationTaskSections, session)
      taskList.push(registrationCheckYourAnswers)
      break
    case constants.applicationTypes.CREDITS_PURCHASE:
      taskList = generateTaskList(creditsPurchaseTaskSections, session)
      taskList.push(creditsPurchaseCheckYourAnswers)
      break
    case constants.applicationTypes.ALLOCATION:
      taskList = generateTaskList(allocationTaskSections, session)
      taskList.push(allocationCheckYourAnswers)
      break
    case constants.applicationTypes.COMBINED_CASE:
      taskList = generateTaskList(combinedCaseTaskSections, session)
      taskList.push(combinedCaseCheckYourAnswers)
      break
    default:
      taskList = []
  }

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
