import constants from '../../utils/constants.js'
import { processRegistrationTask, validateTextInput } from '../../utils/helpers.js'
import isEmpty from 'lodash/isEmpty.js'

const firstNameID = '#firstName'
const lastNameID = '#lastName'
const validateIndividual = individual => {
  const errors = {}
  const firstNameError = validateTextInput(individual.firstName, firstNameID, 'First name', null, 50, 'landowner or leaseholder')
  if (firstNameError) {
    errors.firstNameError = firstNameError.err[0]
  }
  const lastNameError = validateTextInput(individual.lastName, lastNameID, 'Last name', null, 50, 'landowner or leaseholder')
  if (lastNameError) {
    errors.lastNameError = lastNameError.err[0]
  }

  return errors
}
const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Add landowner individual details'
    }, {
      inProgressUrl: constants.routes.ADD_LANDOWNER_INDIVIDUAL_CONSERVATION_COVENANT
    })
    const { id } = request.query
    let individual = {
      firstName: '',
      middleNames: '',
      lastName: ''
    }
    const landownerIndividuals = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENTS)
    if (id) {
      individual = landownerIndividuals[id]
    }
    return h.view(constants.views.ADD_LANDOWNER_INDIVIDUAL_CONSERVATION_COVENANT, {
      individual
    })
  },
  post: async (request, h) => {
    const individual = request.payload
    individual.type = 'individual'
    const { id } = request.query

    const individualError = validateIndividual(individual)
    if (!isEmpty(individualError)) {
      return h.view(constants.views.ADD_LANDOWNER_INDIVIDUAL_CONSERVATION_COVENANT, {
        individual,

        err: Object.values(individualError),
        firstNameError: individualError?.firstNameError,
        lastNameError: individualError?.lastNameError

      })
    }
    const landownerIndividuals = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENTS) ?? []

    if (id) {
      landownerIndividuals.splice(id, 1, individual)
    } else {
      landownerIndividuals.push(individual)
    }

    request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENTS, landownerIndividuals)
    return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.CHECK_LANDOWNERS)
  }

}

export default [{
  method: 'GET',
  path: constants.routes.ADD_LANDOWNER_INDIVIDUAL_CONSERVATION_COVENANT,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.ADD_LANDOWNER_INDIVIDUAL_CONSERVATION_COVENANT,
  handler: handlers.post
}]
