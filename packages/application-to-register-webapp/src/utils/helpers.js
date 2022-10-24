import moment from 'moment'
import constants from './constants.js'
import REGISTER_TASK_LIST from './register-task-list.js'

const validateDate = (payload, ID, desc) => {
  const day = payload[`${ID}-day`]
  const month = payload[`${ID}-month`]
  const year = payload[`${ID}-year`]
  const context = {}
  if (!day && !month && !year) {
    context.err = [{
      text: `Enter the ${desc}`,
      href: `#${ID}-day`,
      dateError: true
    }]
  } else if (!day) {
    context.err = [{
      text: 'Start date must include a day',
      href: `#${ID}-day`,
      dayError: true
    }]
  } else if (!month) {
    context.err = [{
      text: 'Start date must include a month',
      href: `#${ID}-month`,
      monthError: true
    }]
  } else if (!year) {
    context.err = [{
      text: 'Start date must include a year',
      href: `#${ID}-year`,
      yearError: true
    }]
  } else if (!moment(`${year}-${month}-${day}`).isValid()) {
    context.err = [{
      text: 'Start date must be a real date',
      href: `#${ID}-day`,
      dateError: true
    }]
  }
  return {
    day,
    month,
    year,
    context
  }
}
const setReferrer = (request, referrerId) => {
  if (request.info.referrer !== '') {
    const referrerUrl = new URL(request.info.referrer).pathname
    request.yar.set(referrerId, referrerUrl)
  }
}
const getReferrer = (request, referrerId, unsetFlag) => {
  const currentReferrer = request.yar.get(referrerId)
  if (currentReferrer !== undefined && currentReferrer !== null && unsetFlag) {
    request.yar.clear(referrerId)
  }
  return currentReferrer
}

const getRegistrationTasks = request => {
  const registrationTasks = request.yar.get(constants.redisKeys.REGISTRATION_TASK_DETAILS)
  if (registrationTasks === undefined || registrationTasks === null) {
    return Object.assign({}, REGISTER_TASK_LIST)
  }
  return registrationTasks
}

const dateClasses = (localError, dateError, classes) => (localError || dateError) ? `${classes} govuk-input--error` : classes

export {
  validateDate,
  dateClasses,
  getReferrer,
  setReferrer,
  getRegistrationTasks
}
