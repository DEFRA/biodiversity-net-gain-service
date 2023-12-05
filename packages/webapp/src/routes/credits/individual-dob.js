import constants from '../../utils/constants.js'
import { 
  dateClasses,
  validateDate,
  validateAndParseISOString
} from '../../utils/helpers.js'

const individualDob = {
  method: 'GET',
  path: constants.routes.CREDITS_INDIVIDUAL_DOB,
  handler: (_request, h) => {
    return h.view(constants.views.CREDITS_INDIVIDUAL_DOB, { dateClasses })
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CREDITS_INDIVIDUAL_DOB,
  handler: (_request, h) => {
    return h.view(constants.views.CREDITS_INDIVIDUAL_DOB, { dateClasses })
  }
}, {
  method: 'POST',
  path: constants.routes.CREDITS_INDIVIDUAL_DOB,
  handler: (request, h) => {
    const { day, month, year, dateAsISOString, context } = validateDate(
      request.payload, 
      'dob', 
      'date of birth', 
      'Date of birth',
      false
      )
    console.log('errp')


  }
}]
