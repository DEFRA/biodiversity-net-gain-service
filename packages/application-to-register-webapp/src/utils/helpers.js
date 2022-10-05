import moment from 'moment'

const validateDate = (context, day, month, year, ID, desc) => {
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
}

const dateClasses = (localError, dateError, classes) => {
  return (localError || dateError) ? `${classes} govuk-input--error` : classes
}

export {
  validateDate,
  dateClasses
}
