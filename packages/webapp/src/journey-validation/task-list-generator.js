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
  const taskList = taskSections.map(section => ({
    taskTitle: section.title,
    tasks: section.tasks.map(task => getTaskStatus(task, session)),
    // While migrating from HTML task list to v5 task list component, we also add `items` in the component format so we
    // can support the new component without breaking the existing HTML task lists
    items: section.tasks.map(task => getTaskItems(task, session))
  }))
  return taskList
}

const statusForDisplay = status => status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()

// Recursively iterate over a task list object and convert each `text` property (which will be the task item status) to
// have an initial capital with the rest of the string lower case
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
