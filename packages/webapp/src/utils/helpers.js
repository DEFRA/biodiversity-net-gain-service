import moment from 'moment'
import constants from './constants.js'
import registerTaskList from './register-task-list.js'
import validator from 'email-validator'

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
  } else if (!moment.utc(`${year}-${month}-${day}`).isValid()) {
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

const dateClasses = (localError, dateError, classes) => (localError || dateError) ? `${classes} govuk-input--error` : classes

const listArray = array => {
  let html = ''
  if (array && array.length > 0) {
    array.forEach(item => {
      if (html.length > 0) {
        html += `<br> ${item} `
      } else {
        html += ` ${item} `
      }
    })
  }
  return html
}

const getRegistrationTasks = request => {
  const registrationTasks = request.yar.get(constants.redisKeys.REGISTRATION_TASK_DETAILS)
  if (!registrationTasks) {
    return Object.assign({}, registerTaskList)
  }
  return registrationTasks
}

const processCompletedRegistrationTask = (request, taskDetails) => {
  const registrationTasks = getRegistrationTasks(request)
  const affectedTask = registrationTasks.taskList.find(task => task.taskTitle === taskDetails.taskTitle)
  affectedTask.tasks.forEach(task => {
    if (task.title === taskDetails.title) {
      task.status = constants.COMPLETE_REGISTRATION_TASK_STATUS
    }
  })
  request.yar.set(constants.redisKeys.REGISTRATION_TASK_DETAILS, registrationTasks)
}

const boolToYesNo = bool => JSON.parse(bool) ? 'Yes' : 'No'

const dateToString = (date, format = 'DD MMMM YYYY') => moment.utc(date).format(format)

const hideClass = hidden => hidden ? 'hidden' : ''

const getNameAndRoles = legalAgreementParties => {
  const partySelectionContent = []
  legalAgreementParties && legalAgreementParties.organisations.forEach((organisation, index) => {
    const selectedRole = legalAgreementParties.roles[index]
    const roleName = selectedRole.value !== undefined ? selectedRole.value : selectedRole.otherPartyName
    partySelectionContent.push(`${organisation.value} (${roleName})`)
  })
  return partySelectionContent
}
const validateEmail = (emailAddress, ID) => {
  const error = {}
  if (!emailAddress) {
    error.err = [{
      text: 'Enter your email address',
      href: ID
    }]
  } else if (emailAddress.length > 254) {
    error.err = [{
      text: 'Email address must be 254 characters or less',
      href: ID
    }]
  } else if (!validator.validate(emailAddress)) {
    error.err = [{
      text: 'Enter an email address in the correct format, like name@example.com',
      href: ID
    }]
  }
  return error.err ? error : null
}

const getAllLandowners = session => {
  const landowners = JSON.parse(JSON.stringify(session.get(constants.redisKeys.LANDOWNERS))) || []
  if (session.get(constants.redisKeys.ROLE_KEY) === 'Landowner') {
    if (landowners.length === 0) {
      landowners.push(session.get(constants.redisKeys.FULL_NAME))
    } else {
      landowners.unshift(session.get(constants.redisKeys.FULL_NAME))
    }
  }
  return landowners
}

const getLegalAgreementDocumentType = documentType => constants.LEGAL_AGREEMENT_DOCUMENTS.find(item => item.id === documentType).text

const getLegalAgreementParties = legalAgreementParties => {
  return legalAgreementParties && legalAgreementParties.organisations.map((item, i) => {
    return {
      name: item.value,
      role: legalAgreementParties.roles[i].other ? `Other: ${legalAgreementParties.roles[i].otherPartyName}` : legalAgreementParties.roles[i].value
    }
  })
}

export {
  validateDate,
  dateClasses,
  getRegistrationTasks,
  processCompletedRegistrationTask,
  listArray,
  boolToYesNo,
  dateToString,
  hideClass,
  getNameAndRoles,
  validateEmail
  getNameAndRoles,
  getAllLandowners,
  getLegalAgreementDocumentType,
  getLegalAgreementParties
}
