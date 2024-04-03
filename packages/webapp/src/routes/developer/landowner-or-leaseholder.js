import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const isApplicantAgent = request.yar.get(constants.cacheKeys.DEVELOPER_IS_AGENT)
    const landownerOrLeaseholder = request.yar.get(constants.cacheKeys.DEVELOPER_LANDOWNER_OR_LEASEHOLDER)
    return h.view(constants.views.DEVELOPER_LANDOWNER_OR_LEASEHOLDER, {
      isApplicantAgent,
      landownerOrLeaseholder
    })
  },
  post: async (request, h) => {
    const landownerOrLeaseholder = request.payload.landownerOrLeaseholder
    const isApplicantAgent = request.yar.get(constants.cacheKeys.DEVELOPER_IS_AGENT)
    request.yar.set(constants.cacheKeys.DEVELOPER_LANDOWNER_OR_LEASEHOLDER, landownerOrLeaseholder)
    if (landownerOrLeaseholder && isApplicantAgent === constants.APPLICANT_IS_AGENT.YES) {
      return h.redirect(constants.routes.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION)
    } else if (landownerOrLeaseholder && isApplicantAgent === constants.APPLICANT_IS_AGENT.NO) {
      return h.redirect(constants.routes.DEVELOPER_APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION)
    } else {
      return h.view(constants.views.DEVELOPER_LANDOWNER_OR_LEASEHOLDER, {
        err: [{
          text: `Select yes if ${isApplicantAgent === constants.APPLICANT_IS_AGENT.YES ? 'your client is' : 'you are'} the landowner or leaseholder`,
          href: '#is-landowner-or-leaseholder-yes'
        }],
        landownerOrLeaseholder,
        isApplicantAgent
      })
    }
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
