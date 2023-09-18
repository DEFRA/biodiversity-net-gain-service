import constants from '../../utils/constants.js'
import { processRegistrationTask } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Need landowners conservation covenant'
    }, {
      inProgressUrl: constants.routes.LANDOWNER_CONSERVATION_COVENANT_INDIVIDUAL_ORGANISATION
    })

    return h.view(constants.views.LANDOWNER_CONSERVATION_COVENANT_INDIVIDUAL_ORGANISATION, {

    })
  },
  post: async (request, h) => {
    const { landownerType } = request.payload

    if (!landownerType) {
      return h.view(constants.views.LANDOWNER_CONSERVATION_COVENANT_INDIVIDUAL_ORGANISATION, {
        err: [{
          text: 'Select if the landowner or leaseholder is an individual or organisation',
          href: '#landownerType'
        }]
      })
    }

    if (landownerType === 'individual') {
      return h.redirect(constants.routes.ADD_LANDOWNER_INDIVIDUAL_CONSERVATION_COVENANT)
    } else {
      return h.redirect(constants.routes.ADD_LANDOWNER_ORGANISATION_CONSERVATION_COVENANT)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.LANDOWNER_CONSERVATION_COVENANT_INDIVIDUAL_ORGANISATION,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.LANDOWNER_CONSERVATION_COVENANT_INDIVIDUAL_ORGANISATION,
  handler: handlers.post
}]
