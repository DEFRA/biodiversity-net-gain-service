import moment from 'moment'
import constants from './constants.js'
import registerTaskList from './register-task-list.js'
import validator from 'email-validator'
import habitatTypeMap from './habitatTypeMap.js'

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
    return JSON.parse(JSON.stringify(registerTaskList))
  }
  return registrationTasks
}

/*
  Helper function to set a task's status and inProgressUrl
  options = {
    status: constants.COMPLETE_REGISTRATION_TASK_STATUS,
    inProgressUrl: constants.ADD_HECTARES
  }
*/
const processRegistrationTask = (request, taskDetails, options) => {
  const registrationTasks = getRegistrationTasks(request)
  const affectedTask = registrationTasks.taskList.find(task => task.taskTitle === taskDetails.taskTitle)
  affectedTask.tasks.forEach(task => {
    if (task.title === taskDetails.title) {
      if (task.status !== constants.COMPLETE_REGISTRATION_TASK_STATUS && options.status) {
        task.status = options.status
      }
      task.inProgressUrl = options.inProgressUrl || task.inProgressUrl
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

const getLegalAgreementDocumentType = documentType => constants.LEGAL_AGREEMENT_DOCUMENTS.find(item => item.id === documentType)?.text

const getLegalAgreementParties = legalAgreementParties => {
  return legalAgreementParties && legalAgreementParties.organisations.map((item, i) => {
    return {
      name: item.value,
      role: legalAgreementParties.roles[i].other ? `Other: ${legalAgreementParties.roles[i].otherPartyName}` : legalAgreementParties.roles[i].value
    }
  })
}
// Nunjucks template function
const checked = (selectedVal, val) => selectedVal === val

const getEligibilityResults = session => {
  const eligibilityResults = {
    yes: [],
    no: [],
    'not sure': []
  }
  session.get(constants.redisKeys.ELIGIBILITY_BOUNDARY) &&
    eligibilityResults[session.get(constants.redisKeys.ELIGIBILITY_BOUNDARY)].push(constants.redisKeys.ELIGIBILITY_BOUNDARY)
  session.get(constants.redisKeys.ELIGIBILITY_CONSENT) &&
    eligibilityResults[session.get(constants.redisKeys.ELIGIBILITY_CONSENT)].push(constants.redisKeys.ELIGIBILITY_CONSENT)
  session.get(constants.redisKeys.ELIGIBILITY_OWNERSHIP_PROOF) &&
    eligibilityResults[session.get(constants.redisKeys.ELIGIBILITY_OWNERSHIP_PROOF)].push(constants.redisKeys.ELIGIBILITY_OWNERSHIP_PROOF)
  session.get(constants.redisKeys.ELIGIBILITY_BIODIVERSITY_METRIC) &&
    eligibilityResults[session.get(constants.redisKeys.ELIGIBILITY_BIODIVERSITY_METRIC)].push(constants.redisKeys.ELIGIBILITY_BIODIVERSITY_METRIC)
  session.get(constants.redisKeys.ELIGIBILITY_HMMP) &&
    eligibilityResults[session.get(constants.redisKeys.ELIGIBILITY_HMMP)].push(constants.redisKeys.ELIGIBILITY_HMMP)
  session.get(constants.redisKeys.ELIGIBILITY_LEGAL_AGREEMENT) &&
    eligibilityResults[session.get(constants.redisKeys.ELIGIBILITY_LEGAL_AGREEMENT)].push(constants.redisKeys.ELIGIBILITY_LEGAL_AGREEMENT)
  return eligibilityResults
}

const formatAppRef = appRef => `${appRef.substr(0, 3)}-${appRef.substr(3, 3)} ${appRef.substr(6, 3)} ${appRef.substr(9, appRef.length)}`

const habitatTypeAndConditionMapper = (sheets, metricData) => {
  const habitatTypeAndCondition = []
  for (const key in metricData) {
    if (sheets.indexOf(key) > -1 && metricData[key].length > 1) {
      // build up habitat
      const items = []
      metricData[key].forEach((item, index) => {
        // ignore final item
        if (index !== metricData[key].length - 1) {
          items.push({
            header: item[habitatTypeMap[key].header],
            description: item[habitatTypeMap[key].description],
            condition: item.Condition,
            amount: item[habitatTypeMap[key].unitKey]
          })
        }
      })

      // push habitat parent information + items array
      habitatTypeAndCondition.push({
        ...habitatTypeMap[key],
        total: metricData[key][metricData[key].length - 1][habitatTypeMap[key].unitKey],
        items
      })
    }
  }
  return habitatTypeAndCondition
}

const combineHabitats = habitatTypeAndCondition => {
  const combinedHabitats = {}
  const combinedHabitatTypeAndCondition = []
  habitatTypeAndCondition.forEach(item => {
    if (!Object.prototype.hasOwnProperty.call(combinedHabitats, item.type)) {
      combinedHabitats[item.type] = item
    } else {
      // concatenate the habitat items arrays
      combinedHabitats[item.type].items = combinedHabitats[item.type].items.concat(item.items)
      // Add totals
      combinedHabitats[item.type].total += item.total
    }
  })

  for (const key in combinedHabitats) {
    combinedHabitatTypeAndCondition.push(combinedHabitats[key])
  }
  return combinedHabitatTypeAndCondition
}

export {
  validateDate,
  dateClasses,
  getRegistrationTasks,
  processRegistrationTask,
  listArray,
  boolToYesNo,
  dateToString,
  hideClass,
  validateEmail,
  getNameAndRoles,
  getAllLandowners,
  getLegalAgreementDocumentType,
  getLegalAgreementParties,
  checked,
  getEligibilityResults,
  formatAppRef,
  habitatTypeAndConditionMapper,
  combineHabitats
}
