import moment from 'moment'
import path from 'path'
import crypto from 'crypto'
import Joi from 'joi'
import constants from './constants.js'
import validator from 'email-validator'
import habitatTypeMap from './habitatTypeMap.js'

const isoDateFormat = 'YYYY-MM-DD'
const postcodeRegExp = /^([A-Za-z][A-Ha-hJ-Yj-y]?\d[A-Za-z0-9]? ?\d[A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$/ // https://stackoverflow.com/a/51885364

const parsePayload = (payload, ID) => {
  const isNonNumericInput = value => {
    if (value === undefined) return undefined
    return value !== null && value !== '' && isNaN(value)
  }
  const dayRaw = payload[`${ID}-day`]
  const monthRaw = payload[`${ID}-month`]
  const yearRaw = payload[`${ID}-year`]
  const day = dayRaw && !isNaN(dayRaw) ? dayRaw.padStart(2, '0') : dayRaw
  const month = monthRaw && !isNaN(monthRaw) ? monthRaw.padStart(2, '0') : monthRaw
  const year = yearRaw
  return {
    day,
    month,
    year,
    isNonNumeric: {
      day: isNonNumericInput(dayRaw),
      month: isNonNumericInput(monthRaw),
      year: isNonNumericInput(yearRaw)
    }
  }
}
const validateDate = (payload, ID, desc, fieldType = 'Start date', checkFuture = false) => {
  const { day, month, year, isNonNumeric } = parsePayload(payload, ID)
  const context = {}
  const setErrorAndReturn = (condition, errorText, errorField, errorFlag) => {
    if (condition) {
      context.err = [{ text: errorText, href: `#${ID}-${errorField}`, [errorFlag]: true }]
      return true
    }
    return false
  }
  if (setErrorAndReturn(!day && !month && !year, `Enter the ${desc}`, 'day', 'dateError')) {
    return { day, month, year, context }
  }
  if (!day || !month || !year) {
    if (setErrorAndReturn(isNonNumeric.day, `${fieldType} must include a day that is a number`, 'day', 'dayError') ||
      setErrorAndReturn(isNonNumeric.month, `${fieldType} must include a month that is a number`, 'month', 'monthError') ||
      setErrorAndReturn(isNonNumeric.year, `${fieldType} must include a year that is a number`, 'year', 'yearError')) {
      return { day, month, year, context }
    }

    if (setErrorAndReturn(!day, `${fieldType} must include a day`, 'day', 'dayError') ||
    setErrorAndReturn(!month, `${fieldType} must include a month`, 'month', 'monthError') ||
    setErrorAndReturn(!year, `${fieldType} must include a year`, 'year', 'yearError')) {
      return { day, month, year, context }
    }
  }
  const date = moment.utc(`${year}-${month}-${day}`, isoDateFormat, true)
  if (!date.isValid()) {
    context.err = [{ text: `${fieldType} must be a real date`, href: `#${ID}-day`, dateError: true }]
  } else if (checkFuture && date.isAfter(moment())) {
    context.err = [{ text: `${fieldType} cannot be in the future`, href: `#${ID}-day`, dateError: true }]
  }
  const dateAsISOString = !context.err ? date.toISOString() : undefined
  return { day, month, year, dateAsISOString, context }
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
  if (!legalAgreementFiles) return []
  const filenames = legalAgreementFiles.map(file => getFileName(file.location))
  return filenames
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

/*
  Helper function to set a task's status and inProgressUrl
  options = {
    status: constants.COMPLETE_REGISTRATION_TASK_STATUS,
    inProgressUrl: constants.ADD_HECTARES
  }
*/

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
const validateIdGetSchemaOptional = {
  validate: {
    query: Joi.object({
      id: Joi.string().alphanum().min(1).allow(null).optional()
    })
  }
}
const getLandowners = landOwners => {
  if (!landOwners) {
    return null
  }

  const organisationNames = []
  const individualNames = []

  landOwners.forEach(item => {
    if (item.type === 'organisation') {
      organisationNames.push(item.organisationName)
    } else if (item.type === 'individual') {
      const nameParts = [item.firstName, item.middleNames, item.lastName].filter(Boolean)
      const individualName = nameParts.join(' ') + ` (${item.emailAddress})`
      individualNames.push(individualName)
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
          const habitatItems = {
            header: item[habitatTypeMap[key].header],
            description: item[habitatTypeMap[key].description],
            condition: item.Condition,
            amount: item[habitatTypeMap[key].unitKey]
          }
          const isObjectWithEmptyValues = Object.values(habitatItems).every(value => value === null || value === '' || value === undefined)
          if (!isObjectWithEmptyValues) {
            items.push(habitatItems)
          }
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

const extractAllocationHabitatsByGainSiteNumber = (metricData, gainSiteNumber) => {
  const filteredMetricData = {}
  const sheetLabels = ['d2', 'd3', 'e2', 'e3', 'f2', 'f3']

  sheetLabels.forEach(label => {
    filteredMetricData[label] = metricData[label].filter(habitat => String(habitat['Off-site reference']) === gainSiteNumber)

    // calculate the area based on the filtered out habitats and add to the habitat array
    // as the last entry, this is then used by habitatTypeAndConditionMapper later
    const unitKey = habitatTypeMap[label].unitKey
    const measurementTotal = filteredMetricData[label].reduce((acc, cur) => acc + cur[unitKey], 0)
    filteredMetricData[label].push({
      [unitKey]: measurementTotal
    })
  })

  const habitats = habitatTypeAndConditionMapper(['d2', 'd3', 'e2', 'e3', 'f2', 'f3'], filteredMetricData)
  return combineHabitats(habitats)
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

const validateFirstLastNameOfLandownerOrLeaseholder = (name, text, hrefId) => {
  return validateFirstLastName(name, text, hrefId, ' of the landowner or leaseholder')
}

const validateFirstLastNameOfDeveloperClient = (name, text, hrefId) => {
  return validateFirstLastName(name, text, hrefId)
}

const validateFirstLastName = (name, text, hrefId, noValueErrorSuffix) => {
  const error = {}
  if (!name) {
    error.err = [{
      text: `Enter ${noValueErrorSuffix ? 'the ' : ''}${text}${noValueErrorSuffix ?? ''}`,
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

const validateLengthOfCharsLessThan50 = (input, text, hrefId) => {
  const error = {}
  if (input?.length > 50) {
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
/**
 * Checks for duplicate objects in an array based on concatenated properties.
 *
 * @param {Array} array - The array of objects to be checked.
 * @param {Array} properties - The properties of the objects to be concatenated for checking.
 * @param {Object} targetObject - The object whose concatenated properties are to be checked against the array.
 * @param {String} hrefId - The href ID to be used in the error object.
 * @param {String} errorMessage - The error message to be used in the error object.
 * @param {Number|null} excludedIndex - The index in the array to be excluded from duplicate checking.
 * @returns {Object|null} An error object if a duplicate is found, otherwise null.
 */
const checkForDuplicate = (array, property, value, hrefId, errorMessage, excludeIndex) => {
  const duplicate = array.some((item, index) => {
    if (typeof item === 'object' && item !== null && property in item) {
      return index !== excludeIndex && item[property] && item[property].toLowerCase() === value.toLowerCase()
    } else if (typeof item === 'string') {
      return index !== excludeIndex && item.toLowerCase() === value.toLowerCase()
    }
    return false
  })
  if (duplicate) {
    return {
      err: {
        text: errorMessage,
        href: hrefId
      }
    }
  }
  return null
}
/**
 * Checks for duplicates in an array based on concatenated property values of the objects.
 *
 * @param {Array} array - Array of objects to check for duplicates.
 * @param {Array} properties - List of properties whose values are concatenated and compared for duplicates.
 * @param {Object} targetObject - Object whose properties are compared against the array.
 * @param {String} hrefId - ID used for creating a reference link in the error message.
 * @param {String} errorMessage - Error message to be returned if a duplicate is found.
 * @param {Number|null} excludedIndex - Index in the array to exclude from duplicate checking.
 * @returns {Object|null} Returns an error object if a duplicate is found, otherwise null.
 */
const checkForDuplicateConcatenated = (array, properties, targetObject, hrefId, errorMessage, excludedIndex) => {
  const targetValue = properties.map(prop => targetObject[prop].toLowerCase()).join(' ').trim()
  const error = {}
  const duplicate = array.some((item, index) => {
    if (excludedIndex !== null && index === excludedIndex) return false
    const itemValue = properties.map(prop => item[prop]?.toLowerCase()).join(' ').trim()
    return itemValue === targetValue
  })
  if (duplicate) {
    error.err = {
      text: errorMessage,
      href: hrefId
    }
    return error
  }
  return null
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
async function handleFileUploadOperation (operation, { logger, request, h, onSuccess, onError }) {
  try {
    const result = await operation()
    return onSuccess(result, request, h)
  } catch (err) {
    logger.error(`${new Date().toUTCString()} Problem uploading file ${err}`)
    return onError(err, h)
  }
}
// Nunjucks template function
const getErrById = (err, fieldId) => (err || []).find(e => e.href === `#${fieldId}`)

const maximumSizeExceeded = (h, { href, maximumFileSize, view }) => {
  return getMaximumFileSizeExceededView({
    h,
    href,
    maximumFileSize,
    view
  })
}
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

const getMetricFileValidationErrors = (metricValidation, href, useStatutoryMetric = false) => {
  const error = {
    err: [
      {
        text: '',
        href
      }
    ]
  }
  if (!metricValidation.isSupportedVersion) {
    error.err[0].text = useStatutoryMetric
      ? 'The selected file must use the statutory biodiversity metric'
      : 'The selected file must use Biodiversity Metric version 4.1'
  } else if (metricValidation.isDraftVersion) {
    error.err[0].text = 'The selected file must not be a draft version'
  } else if (!metricValidation.isOffsiteDataPresent) {
    error.err[0].text = 'The selected file does not have enough data'
  } else if (!metricValidation.areOffsiteTotalsCorrect) {
    // BNGP-4219 METRIC Validation: Suppress total area calculations
    // error.err[0].text = 'The selected file has an error - the baseline total area does not match the created and enhanced total area for the off-site'
    return null
  }
  return error.err[0].text ? error : null
}

const buildFullName = (item) => {
  return item.value.middleName
    ? item.value.firstName.concat(' ', item.value.middleName, ' ' + item.value.lastName)
    : item.value.firstName.concat(' ' + item.value.lastName)
}

const isValidPostcode = (postcode) => {
  return postcodeRegExp.test(postcode)
}

const validateAddress = (address, isUkAddress) => {
  const errors = {}
  if (!address.addressLine1 || address.addressLine1.length === 0) {
    errors.addressLine1Error = {
      text: 'Enter address line 1',
      href: '#addressLine1'
    }
  }
  if (!address.town || address.town.length === 0) {
    errors.townError = {
      text: 'Enter town or city',
      href: '#town'
    }
  }
  const addressLine1Validation = validateLengthOfCharsLessThan50(address?.addressLine1, 'addressLine1', 'addressLine1Id')
  if (addressLine1Validation) {
    errors.addressLine1Error = addressLine1Validation.err[0]
  }
  const addressLine2Validation = validateLengthOfCharsLessThan50(address?.addressLine2, 'addressLine2', 'addressLine2Id')
  if (addressLine2Validation) {
    errors.addressLine2Error = addressLine2Validation.err[0]
  }
  const addressLine3Validation = validateLengthOfCharsLessThan50(address?.addressLine3, 'addressLine3', 'addressLine3Id')
  if (addressLine3Validation) {
    errors.addressLine3Error = addressLine3Validation.err[0]
  }

  const townValidation = validateLengthOfCharsLessThan50(address?.town, 'town', 'townId')
  if (townValidation) {
    errors.townError = townValidation.err[0]
  }
  const countyValidation = validateLengthOfCharsLessThan50(address?.county, 'county', 'countyId')
  if (countyValidation) {
    errors.countyError = countyValidation.err[0]
  }
  if (isUkAddress) {
    validateUkAddress(address, errors)
  } else {
    validateNonUkAddress(address, errors)
  }
  return Object.keys(errors).length > 0 ? errors : null
}

const validateUkAddress = (address, errors) => {
  if (!address.postcode || address.postcode.length === 0) {
    errors.postcodeError = {
      text: 'Enter postcode',
      href: '#postcode'
    }
  } else if (!isValidPostcode(address.postcode)) {
    errors.postcodeError = {
      text: 'Enter a full UK postcode',
      href: '#postcode'
    }
  }
}

const validateNonUkAddress = (address, errors) => {
  if (!address.country || address.country.length === 0) {
    errors.countryError = {
      text: 'Enter country',
      href: '#country'
    }
  }
  if (address?.postcode?.length > 14) {
    errors.postcodeError = {
      text: 'Postal code must be 14 characters or fewer',
      href: '#postcode'
    }
  }

  const countryValidation = validateLengthOfCharsLessThan50(address?.country, 'country', 'countryId')
  if (countryValidation) {
    errors.countryError = countryValidation.err[0]
  }
}
const getValidReferrerUrl = (yar, validReferrers) => {
  const referrerUrl = yar.get(constants.redisKeys.REFERER)
  const isReferrerValid = validReferrers.includes(referrerUrl)
  return isReferrerValid ? referrerUrl : null
}

const redirectAddress = (h, yar, isApplicantAgent, isIndividualOrOrganisation) => {
  if (isApplicantAgent === 'no') {
    return h.redirect(constants.routes.CHECK_APPLICANT_INFORMATION)
  }
  const referrerUrl = getValidReferrerUrl(yar, constants.LAND_APPLICANT_INFO_VALID_REFERRERS)
  if (isIndividualOrOrganisation === constants.individualOrOrganisationTypes.INDIVIDUAL) {
    return h.redirect(referrerUrl || constants.routes.CLIENTS_EMAIL_ADDRESS)
  } else {
    return h.redirect(referrerUrl || constants.routes.UPLOAD_WRITTEN_AUTHORISATION)
  }
}
const getFileHeaderPrefix = (fileNames) => {
  const fileCount = fileNames.length
  return fileCount > 1 ? 'files' : 'file'
}

const redirectDeveloperClient = (h, yar) => {
  const clientIsLandownerOrLeaseholder = yar.get(constants.redisKeys.DEVELOPER_LANDOWNER_OR_LEASEHOLDER)
  if (clientIsLandownerOrLeaseholder === constants.DEVELOPER_IS_LANDOWNER_OR_LEASEHOLDER.YES) {
    return h.redirect(yar.get(constants.redisKeys.REFERER, true) || constants.routes.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION)
  } else {
    return h.redirect(yar.get(constants.redisKeys.REFERER, true) || constants.routes.DEVELOPER_NEED_PROOF_OF_PERMISSION)
  }
}

const getAuthenticatedUserRedirectUrl = () => {
  // BNGP- 4368 - Simplify the redirection logic for authenticated users.
  // For MVP, only registrations are enabled so redirect to the dashboard for registrations.
  // When two or more journey types are enabled, redirect the user to select the dashboard for
  // the required journey type.

  return process.env.ENABLE_ROUTE_SUPPORT_FOR_DEV_JOURNEY === 'Y' || process.env.ENABLE_ROUTE_SUPPORT_FOR_CREDIT_PURCHASE_JOURNEY === 'Y'
    ? constants.routes.MANAGE_BIODIVERSITY_GAINS
    : constants.routes.BIODIVERSITY_GAIN_SITES
}

const creditsValidationSchema = (inputSchema) => {
  return Joi.object({
    a1: inputSchema,
    a2: inputSchema,
    a3: inputSchema,
    a4: inputSchema,
    a5: inputSchema,
    h: inputSchema,
    w: inputSchema
  }).custom((value, helpers) => {
    if (Object.values(value).every(v => v === '' || Number(v) === 0)) {
      throw new Error('at least one credit unit input should have a value')
    }
  })
}

const creditsValidationFailAction = ({
  err,
  defaultErrorMessage,
  charLengthErrorMessage
}) => {
  const errorMessages = {}
  const errorList = []

  if (err.details.some(e => e.type === 'any.custom')) {
    const errorId = 'custom-err'
    errorMessages[errorId] = defaultErrorMessage
    errorList.push({
      ...defaultErrorMessage,
      href: `#${errorId}`
    })
  } else {
    err.details.forEach(e => {
      const errorMessage = e.type === 'string.max' ? charLengthErrorMessage : defaultErrorMessage
      errorMessages[e.context.key] = errorMessage
      errorList.push({
        ...errorMessage,
        href: `#${e.context.key}-units`
      })
    })
  }

  return { errorMessages, errorList }
}

const isAgentAndNotLandowner = session => {
  const isAgent = session.get(constants.redisKeys.DEVELOPER_IS_AGENT) === constants.APPLICANT_IS_AGENT.YES
  const clientIsNotLandownerOrLeaseholder = session.get(constants.redisKeys.DEVELOPER_LANDOWNER_OR_LEASEHOLDER) === constants.DEVELOPER_IS_LANDOWNER_OR_LEASEHOLDER.NO
  return isAgent && clientIsNotLandownerOrLeaseholder
}

export {
  validateDate,
  dateClasses,
  listArray,
  boolToYesNo,
  dateToString,
  hideClass,
  validateEmail,
  getNameAndRoles,
  getAllLandowners,
  checkForDuplicate,
  checkForDuplicateConcatenated,
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
  extractAllocationHabitatsByGainSiteNumber,
  getFileHeaderPrefix,
  getValidReferrerUrl,
  validateIdGetSchemaOptional,
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
  validateFirstLastNameOfDeveloperClient,
  validateFirstLastNameOfLandownerOrLeaseholder,
  emailValidator,
  getDateString,
  getErrById,
  getMaximumFileSizeExceededView,
  maximumSizeExceeded,
  getHumanReadableFileSize,
  getMetricFileValidationErrors,
  initialCapitalization,
  buildFullName,
  isValidPostcode,
  redirectAddress,
  validateAddress,
  handleFileUploadOperation,
  redirectDeveloperClient,
  validateLengthOfCharsLessThan50,
  getAuthenticatedUserRedirectUrl,
  creditsValidationSchema,
  creditsValidationFailAction,
  isAgentAndNotLandowner
}
