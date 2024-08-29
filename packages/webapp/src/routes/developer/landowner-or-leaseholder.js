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

    // If there's already a response and it matches the new response then we've likely entered from Check And Submit so
    // don't want to go any further (otherwise we're just confirming additional questions that we don't need to). We
    // likely started at Check And Submit so we'll go back there if the key is set, but use the task list as a fallback.
    if (request.yar.get(constants.redisKeys.DEVELOPER_LANDOWNER_OR_LEASEHOLDER) === landownerOrLeaseholder) {
      const returnRoute = request.yar.get(constants.redisKeys.CHECK_AND_SUBMIT_JOURNEY_ROUTE) || constants.routes.DEVELOPER_TASKLIST
      return h.redirect(returnRoute)
    }

    request.yar.set(constants.redisKeys.DEVELOPER_LANDOWNER_OR_LEASEHOLDER, landownerOrLeaseholder)

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
