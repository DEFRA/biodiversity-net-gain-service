import moment from 'moment'
import path from 'path'
import crypto from 'crypto'
import constants from './constants.js'
import registerTaskList from './register-task-list.js'
import developerTaskList from './developer-task-list.js'
import validator from 'email-validator'
import habitatTypeMap from './habitatTypeMap.js'
const isoDateFormat = 'YYYY-MM-DD'

const parsePayload = (payload, ID) => {
  const day = (payload[`${ID}-day`] && payload[`${ID}-day`].length === 1) ? payload[`${ID}-day`].padStart(2, '0') : payload[`${ID}-day`]
  const month = (payload[`${ID}-month`] && payload[`${ID}-month`].length === 1) ? payload[`${ID}-month`].padStart(2, '0') : payload[`${ID}-month`]
  const year = payload[`${ID}-year`]
  return {
    day,
    month,
    year
  }
}

const validateDate = (payload, ID, desc, fieldType = 'Start date', checkFuture = false) => {
  const { day, month, year } = parsePayload(payload, ID)
  const date = moment.utc(`${year}-${month}-${day}`, isoDateFormat, true)
  const context = {}
  if (!day && !month && !year) {
    context.err = [{
      text: `Enter the ${desc}`,
      href: `#${ID}-day`,
      dateError: true
    }]
  } else if (!day) {
    context.err = [{
      text: `${fieldType} must include a day`,
      href: `#${ID}-day`,
      dayError: true
    }]
  } else if (!month) {
    context.err = [{
      text: `${fieldType} must include a month`,
      href: `#${ID}-month`,
      monthError: true
    }]
  } else if (!year) {
    context.err = [{
      text: `${fieldType} must include a year`,
      href: `#${ID}-year`,
      yearError: true
    }]
  } else if (!date.isValid()) {
    context.err = [{
      text: `${fieldType} must be a real date`,
      href: `#${ID}-day`,
      dateError: true
    }]
  } else if (checkFuture === true) {
    const dateString = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })
    const format = 'DD/MM/YYYY, HH:mm:ss'
    const currentMomentInBritish = moment(dateString, format)
    if (date.isAfter(currentMomentInBritish)) {
      context.err = [{
        text: `${fieldType} cannot be in the future`,
        href: `#${ID}-day`,
        dateError: true
      }]
    }
  }
  const dateAsISOString = !context.err && date.toISOString()
  return {
    day,
    month,
    year,
    dateAsISOString,
    context
  }
}

const getMinDateCheckError = (dateAsISOString, ID, minDateISOString, fieldType = 'Start date') => {
  if (isDate1LessThanDate2(dateAsISOString, minDateISOString)) {
    return [{
      text: `${fieldType} must be after ${formatDateBefore(minDateISOString)}`,
      href: `#${ID}-day`,
      dateError: true
    }]
  } else {
    return undefined
  }
}
const getLegalAgreementFileNames = (legalAgreementFiles) => {
  if (!legalAgreementFiles) return ''
  const filenames = legalAgreementFiles.map(file => getFileName(file.location))
  return filenames.join('<br>')
}

const getLocalPlanningAuthorities = lpas => {
  if (!lpas) return ''
  return lpas.join('<br>')
}
const getFileName = fileLocation => fileLocation ? path.parse(fileLocation).base : ''
const dateClasses = (localError, dateError, classes) => (localError || dateError) ? `${classes} govuk-input--error` : classes

const isDate1LessThanDate2 = (isoString1, isoString2) => {
  const date1 = moment.utc(isoString1)
  const date2 = moment.utc(isoString2)
  return date1.isValid() && date2.isValid() && (date1).isBefore(date2, 'day')
}

const validateAndParseISOString = isoString => {
  const date = moment.utc(isoString)
  return {
    day: date.isValid() && date.format('DD'),
    month: date.isValid() && date.format('MM'),
    year: date.isValid() && date.format('YYYY')
  }
}

const getFormattedDate = dateString => {
  const date = moment.utc(dateString)
  return date.isValid() && date.format('D MMMM YYYY')
}

const formatDateBefore = (isoString, format = 'D MMMM YYYY') => moment.utc(isoString).subtract(1, 'day').format(format)

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

const getDeveloperTasks = request => {
  const developersTasks = request.yar.get(constants.redisKeys.DEVELOPER_TASK_DETAILS)
  if (!developersTasks) {
    return JSON.parse(JSON.stringify(developerTaskList))
  }
  return developersTasks
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

const processDeveloperTask = (request, taskDetails, options) => {
  const developerTasks = getDeveloperTasks(request)
  const affectedTask = developerTasks.taskList.find(task => task.taskTitle === taskDetails.taskTitle)
  affectedTask.tasks.forEach(task => {
    if (task.title === taskDetails.title) {
      /* istanbul ignore else */
      if (task.status !== constants.COMPLETE_DEVELOPER_TASK_STATUS && options.status) {
        task.status = options.status
      }
      task.inProgressUrl = options.inProgressUrl || task.inProgressUrl
    }
  })
  request.yar.set(constants.redisKeys.DEVELOPER_TASK_DETAILS, developerTasks)
}
const initialCapitalization = text => text[0].toUpperCase() + text.slice(1)

const boolToYesNo = bool => JSON.parse(bool) ? 'Yes' : 'No'

const dateToString = (date, format = 'DD MMMM YYYY') => moment.utc(date).format(format)

const hideClass = hidden => hidden ? 'hidden' : ''

const getNameAndRoles = legalAgreementParties => {
  const partySelectionContent = []
  legalAgreementParties && Object.values(legalAgreementParties).forEach(organisation => {
    organisation.organisationRole === 'Other'
      ? partySelectionContent.push(`${organisation.organisationName} (${organisation.organisationOtherRole})`)
      : partySelectionContent.push(`${organisation.organisationName} (${organisation.organisationRole})`)
  })
  return partySelectionContent
}
const getDateString = (dateValue, type) => {
  let status = 'Not started yet'
  if (type === 'end date') {
    status = 'No end date'
  }
  const returnDateValue = dateValue ? dateToString(dateValue) : status
  return returnDateValue
}
const getResponsibleBodies = responsibleBodies => {
  const responsibleBodiesParsed = JSON.parse(JSON.stringify(responsibleBodies)) || []
  const responsibleBodiesOutput = responsibleBodiesParsed.map(item => item.responsibleBodyName).join('<br>')
  return responsibleBodiesOutput
}

const getLandowners = landOwners => {
  const organisationNames = []
  const individualNames = []

  landOwners.forEach(item => {
    if (item.type === 'organisation') {
      organisationNames.push(item.organisationName)
    } else if (item.type === 'individual') {
      const nameParts = [item.firstName, item.middleNames, item.lastName].filter(Boolean)
      individualNames.push(nameParts.join(' '))
    }
  })

  const result = [...organisationNames, ...individualNames].join('<br>')
  return result
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
  return legalAgreementParties?.map(item => {
    return {
      name: item.organisationName,
      role: item.organisationRole
    }
  })
}
const generateUniqueId = () => {
  return crypto.randomBytes(16).toString('hex')
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

const getDeveloperEligibilityResults = session => {
  const developerEligibilityResults = {
    yes: [],
    no: [],
    'not-sure': []
  }
  session.get(constants.redisKeys.DEVELOPER_WRITTEN_CONTENT_VALUE) &&
  developerEligibilityResults[session.get(constants.redisKeys.DEVELOPER_WRITTEN_CONTENT_VALUE)].push(constants.redisKeys.DEVELOPER_WRITTEN_CONTENT_VALUE)
  session.get(constants.redisKeys.DEVELOPER_ELIGIBILITY_METRIC_VALUE) &&
  developerEligibilityResults[session.get(constants.redisKeys.DEVELOPER_ELIGIBILITY_METRIC_VALUE)].push(constants.redisKeys.DEVELOPER_ELIGIBILITY_METRIC_VALUE)
  return developerEligibilityResults
}

const formatSortCode = sortCode => `${sortCode.substring(0, 2)} ${sortCode.substring(2, 4)} ${sortCode.substring(4, 6)}`

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
    if (!Object.hasOwn(combinedHabitats, item.type)) {
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

const validateName = (fullName, hrefId) => {
  const error = {}
  if (!fullName) {
    error.err = [{
      text: 'Enter your full name',
      href: hrefId
    }]
  } else if (fullName.length < 2) {
    error.err = [{
      text: 'Full name must be 2 characters or more',
      href: hrefId
    }]
  }
  return error.err ? error : null
}

const validateFirstLastName = (name, text, hrefId) => {
  const error = {}
  if (!name) {
    error.err = [{
      text: `Enter the ${text} of the landowner or leaseholder`,
      href: hrefId
    }]
  } else if (name.length > 50) {
    error.err = [{
      text: `${text.charAt(0).toUpperCase() + text.slice(1)} must be 50 characters or fewer`,
      href: hrefId
    }]
  }
  return error.err ? error : null
}

const validateTextInput = (text, hrefId, fieldType = 'input', maxLength = null, target = null) => {
  const error = {}
  const fieldTypeLower = fieldType.toLowerCase()

  if (!text) {
    error.err = [{
      text: `Enter the ${fieldTypeLower} of the ${target}`,
      href: hrefId
    }]
  } else if (maxLength !== null && text.length > maxLength) {
    error.err = [{
      text: `${fieldType} must be ${maxLength} characters or fewer`,
      href: hrefId
    }]
  }

  return error.err ? error : null
}

const validateBNGNumber = (bngNumber, hrefId) => {
  const error = {}
  if (!bngNumber.trim()) {
    error.err = [{
      text: 'Enter your Biodiversity gain site number',
      href: hrefId
    }]
  }
  return error.err ? error : null
}

const emailValidator = (email, id) => {
  try {
    const tester = /^[-!#$%&'*+\0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
    // https://en.wikipedia.org/wiki/Email_address  The format of an email address is local-part@domain, where the
    // local part may be up to 64 octets long and the domain may have a maximum of 255 octets.
    if (!email || email.length === 0) {
      return {
        err: [{
          text: 'Enter your email address',
          href: id
        }]
      }
    }

    if (email.length > 255) {
      return {
        err: [{
          text: 'Email address must be 254 characters or less',
          href: id
        }]
      }
    }

    const emailParts = email.split('@')

    if (emailParts.length !== 2 || !tester.test(email)) {
      return {
        err: [{
          text: 'Enter an email address in the correct format, like name@example.com',
          href: id
        }]
      }
    }

    const account = emailParts[0]
    const address = emailParts[1]
    const invalidEmailError = {
      err: [{
        text: 'Enter a valid email address',
        href: id
      }]
    }
    if (account.length > 64 || address.length > 255) {
      return invalidEmailError
    }

    const domainParts = address.split('.')

    // https://en.wikipedia.org/wiki/Email_address#Domain
    // It must match the requirements for a hostname, a list of dot-separated DNS labels, each label being limited to a length of 63 characters
    if (domainParts.some(function (part) {
      return part.length > 63
    })) {
      return invalidEmailError
    }

    return null
  } catch (error) {
    return {
      err: [{
        text: 'Unexpected valdation error',
        href: id
      }]
    }
  }
}

// Nunjucks template function
const getErrById = (err, fieldId) => (err || []).find(e => e.href === `#${fieldId}`)

const getMaximumFileSizeExceededView = config => {
  return config.h.view(config.view, {
    err: [
      {
        text: `The selected file must not be larger than ${config.maximumFileSize}MB`,
        href: config.href
      }
    ]
  })
}

const getHumanReadableFileSize = (fileSizeInBytes, maximumDecimalPlaces = 2) => {
  // Convert from bytes to kilobytes initially.
  let humanReadableFileSize = parseFloat(fileSizeInBytes / 1024)
  let units = 'kB'
  if (parseInt(fileSizeInBytes) > 1048576) {
    // Convert from kilobytes to megabytes
    humanReadableFileSize = parseFloat(fileSizeInBytes / 1024 / 1024)
    units = 'MB'
  }
  return `${parseFloat(humanReadableFileSize.toFixed(parseInt(maximumDecimalPlaces)))} ${units}`
}

const getMetricFileValidationErrors = (metricValidation, href) => {
  const error = {
    err: [
      {
        text: '',
        href
      }
    ]
  }
  if (!metricValidation.isSupportedVersion) {
    error.err[0].text = 'The selected file must use Biodiversity Metric version 4.1'
  } else if (!metricValidation.isOffsiteDataPresent) {
    error.err[0].text = 'The selected file does not have enough data'
  } else if (!metricValidation.areOffsiteTotalsCorrect) {
    error.err[0].text = 'The selected file has an error - the baseline total area does not match the created and enhanced total area for the off-site'
  }
  return error.err[0].text ? error : null
}

const checkDeveloperDetails = (request, h) => {
  if (!areDeveloperDetailsPresent(request.yar)) {
    return h.redirect(constants.routes.START).takeover()
  }
  return h.continue
}

const areDeveloperDetailsPresent = session => (
  session.get(constants.redisKeys.DEVELOPER_FULL_NAME) &&
  session.get(constants.redisKeys.DEVELOPER_EMAIL_VALUE)
)

const buildFullName = (item) => {
  return item.value.middleName
    ? item.value.firstName.concat(' ', item.value.middleName, ' ' + item.value.lastName)
    : item.value.firstName.concat(' ' + item.value.lastName)
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
  getResponsibleBodies,
  getLandowners,
  getLegalAgreementDocumentType,
  getLegalAgreementParties,
  checked,
  getEligibilityResults,
  formatSortCode,
  generateUniqueId,
  habitatTypeAndConditionMapper,
  combineHabitats,
  validateAndParseISOString,
  isDate1LessThanDate2,
  getFormattedDate,
  validateTextInput,
  formatDateBefore,
  getMinDateCheckError,
  getLegalAgreementFileNames,
  getLocalPlanningAuthorities,
  getFileName,
  validateName,
  validateFirstLastName,
  emailValidator,
  getDateString,
  getDeveloperEligibilityResults,
  validateBNGNumber,
  getErrById,
  getMaximumFileSizeExceededView,
  getHumanReadableFileSize,
  processDeveloperTask,
  getDeveloperTasks,
  getMetricFileValidationErrors,
  initialCapitalization,
  checkDeveloperDetails,
  buildFullName
}
