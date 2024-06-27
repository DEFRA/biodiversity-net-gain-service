import constants from '../utils/constants.js'
import {
  taskSections as registrationTaskSections,
  checkYourAnswers as registrationCheckYourAnswers, getTaskById
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
  checkYourAnswers as combinedCaseCheckYourAnswers
} from './combined-case/task-sections.js'

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

const generateTaskList = (taskSections, session) => {
  const locked = (section, taskList) => {
    if (section.dependantIds && section.dependantIds.length > 0) {
      for (const dependantId of section.dependantIds) {
        const dependantSection = taskList.find(s => s.id === dependantId)
        if (dependantSection) {
          const completedTasks = dependantSection.tasks.filter(task => task.status !== constants.COMPLETE_REGISTRATION_TASK_STATUS)
          if (completedTasks.length > 0) {
            return true
          }
        }
      }
    }
    return false
  }
  const taskList = taskSections.map(section => {
    return {
      taskTitle: section.title,
      tasks: section.tasks.map(task => getTaskStatus(task, session)),
      id: section.id,
      dependantIds: section.dependantIds
    }
  })

  const lockedTaskList = taskList.map(section => {
    const isLocked = locked(section, taskList)
    if (isLocked) {
      return {
        ...section,
        ...{
          tasks: section.tasks.map(task => {
            task.status = constants.CANNOT_START_YET_STATUS
            task.isLocked = true
            return task
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

export {
  getTaskList,
  getIndividualTaskStatus
}
