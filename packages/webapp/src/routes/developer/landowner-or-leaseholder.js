import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const isApplicantAgent = request.yar.get(constants.redisKeys.DEVELOPER_IS_AGENT)
    const landownerOrLeaseholder = request.yar.get(constants.redisKeys.DEVELOPER_LANDOWNER_OR_LEASEHOLDER)
    return h.view(constants.views.DEVELOPER_LANDOWNER_OR_LEASEHOLDER, {
      isApplicantAgent,
      landownerOrLeaseholder
    })
  },
  post: async (request, h) => {
    const landownerOrLeaseholder = request.payload.landownerOrLeaseholder
    const isApplicantAgent = request.yar.get(constants.redisKeys.DEVELOPER_IS_AGENT)

    if (!landownerOrLeaseholder) {
      return h.view(constants.views.DEVELOPER_LANDOWNER_OR_LEASEHOLDER, {
        err: [{
          text: `Select yes if ${isApplicantAgent === constants.APPLICANT_IS_AGENT.YES ? 'your client is' : 'you are'} the landowner or leaseholder`,
          href: '#is-landowner-or-leaseholder-yes'
        }],
        landownerOrLeaseholder,
        isApplicantAgent
      })
    }

    const previousResponse = request.yar.get(constants.redisKeys.DEVELOPER_LANDOWNER_OR_LEASEHOLDER)

    // Force replay of full journey if switching between landowner and non-landowner application
    if (previousResponse && previousResponse !== landownerOrLeaseholder) {
      request.yar.clear(constants.redisKeys.REFERER)
    }

    // If there's already a response which matches the new response then we've likely entered from Check And Submit so
    // don't want to go any further (otherwise we're just confirming additional questions that we don't need to). We
    // go back there if the key is set, but use the task list as a fallback.
    if (previousResponse === landownerOrLeaseholder) {
      const returnRoute = request.yar.get(constants.redisKeys.CHECK_AND_SUBMIT_JOURNEY_ROUTE) || constants.routes.DEVELOPER_TASKLIST
      return h.redirect(returnRoute)
    }

    request.yar.set(constants.redisKeys.DEVELOPER_LANDOWNER_OR_LEASEHOLDER, landownerOrLeaseholder)

    // If there was a previous response and the response is now "yes" then we don't need any further info so we return
    // to Check And Submit (since that's likely where they came from if they're confirming info), or the task list as a
    // fallback.
    if (previousResponse && landownerOrLeaseholder === constants.DEVELOPER_IS_LANDOWNER_OR_LEASEHOLDER.YES) {
      const returnRoute = request.yar.get(constants.redisKeys.CHECK_AND_SUBMIT_JOURNEY_ROUTE) || constants.routes.DEVELOPER_TASKLIST
      return h.redirect(returnRoute)
    }

    return isApplicantAgent === constants.APPLICANT_IS_AGENT.YES
      ? h.redirect(constants.routes.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION)
      : h.redirect(constants.routes.DEVELOPER_APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_LANDOWNER_OR_LEASEHOLDER,
  handler: handlers.get
},
{
  method: 'POST',
  path: constants.routes.DEVELOPER_LANDOWNER_OR_LEASEHOLDER,
  handler: handlers.post
}]
