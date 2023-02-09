import constants from '../../utils/constants.js'

const handlers = {
  get: (request, h) => {
    const context = getContext(request)
    const offSiteHabitatTableContent = context.offSiteHabitatBaseline.map(item => item.broadHabitat !== null
      ? (
          [
            {
              html: "<span class='govuk-body-m govuk-!-display-block govuk-!-margin-top-0 govuk-!-margin-bottom-0'>" + item.broadHabitat + "</span> <span class='govuk-body-s govuk-!-display-block govuk-!-margin-top-0 govuk-!-margin-bottom-0'>" + item.habitatType + '</span>',
              classes: 'govuk-!-width-two-thirds'
            },
            {
              text: item.score
            }
          ]
        )
      : null)
    offSiteHabitatTableContent.push(
      [
        {
          html: "<span class='govuk-body-m govuk-!-display-block govuk-!-margin-top-0 govuk-!-margin-bottom-0'>Biodiversity net gain added</span>",
          classes: 'govuk-!-width-two-thirds'
        },
        {
          text: '3%' // THIS VALUE CALCULATION SHOULD BE DONE
        }
      ]
    )
    return h.view(constants.views.DEVELOPER_CONFIRM_OFF_SITE_GAIN, { offSiteHabitatTableContent, ...context })
  },
  post: async (request, h) => {
    const confirmOffsiteGain = request.payload.confirmOffsiteGain
    request.yar.set(constants.redisKeys.METRIC_FILE_CHECKED, confirmOffsiteGain)
  }
}

const getContext = request => request.yar.get(constants.redisKeys.DEVELOPER_METRIC_DATA)

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_CONFIRM_OFF_SITE_GAIN,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_CONFIRM_OFF_SITE_GAIN,
  handler: handlers.post
}]
