import constants from '../../utils/constants.js'

const handlers = {
  get: (request, h) => {
    const context = getContext(request)
    const offSiteHabitatTableContent = getFormattedTableContent(context.offSiteHabitatBaseline, constants.offSiteGainTypes.HABITAT)
    const offSiteHedgerowTableContent = getFormattedTableContent(context.offSiteHedgeBaseline, constants.offSiteGainTypes.HABITAT)

    return h.view(constants.views.DEVELOPER_CONFIRM_OFF_SITE_GAIN, {
      offSiteHedgerowTableContent,
      offSiteHabitatTableContent,
      ...context
    })
  },
  post: async (request, h) => {
    const confirmOffsiteGain = request.payload.confirmOffsiteGain
    request.yar.set(constants.redisKeys.METRIC_FILE_CHECKED, confirmOffsiteGain)
  }
}

const getContext = request => request.yar.get(constants.redisKeys.DEVELOPER_METRIC_DATA)

const getFormattedTableContent = (content, type) => {
  let formattedContent
  const noOfUnits = content.map(item => item.score).reduce((prev, next) => prev + next)
  switch (type) {
    case constants.offSiteGainTypes.HABITAT:
      formattedContent = content.map(item => item.broadHabitat !== null
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
      break
    case constants.offSiteGainTypes.HEDGEROW:
      formattedContent = content.map(item => item.hedgerowType !== null
        ? (
            [
              {
                html: "<span class='govuk-body-m govuk-!-display-block govuk-!-margin-top-0 govuk-!-margin-bottom-0'>" + item.hedgerowType + '</span>',
                classes: 'govuk-!-width-two-thirds'
              },
              {
                text: item.score
              }
            ]
          )
        : null)
      break
    default:
      formattedContent = []
  }

  // Last 2 rows for each table to display  No_of_units and % gain
  formattedContent.push(
    [
      {
        html: "<span class='govuk-body-m govuk-!-display-block govuk-!-margin-top-0 govuk-!-margin-bottom-0'>Number of units</span>",
        classes: 'govuk-!-width-two-thirds'
      },
      {
        text: noOfUnits
      }
    ],
    [
      {
        html: "<span class='govuk-body-m govuk-!-display-block govuk-!-margin-top-0 govuk-!-margin-bottom-0'>Biodiversity net gain added</span>",
        classes: 'govuk-!-width-two-thirds'
      },
      {
        text: '3%' // TODO: THIS VALUE CALCULATION SHOULD BE DONE AS PER BUSINESS REQUIREMENT
      }
    ]
  )
  return formattedContent
}
export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_CONFIRM_OFF_SITE_GAIN,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_CONFIRM_OFF_SITE_GAIN,
  handler: handlers.post
}]
