import constants from '../../utils/constants.js'
import { blobStorageConnector } from '@defra/bng-connectors-lib'

const href = '#offsite-details-checked-yes'
const tableRowCss = 'govuk-!-width-two-thirds'
const tableRowHTML = "<span class='govuk-body-m govuk-!-display-block govuk-!-margin-top-0 govuk-!-margin-bottom-0'>"
const handlers = {
  get: (request, h) => {
    const context = getContext(request)
    return h.view(constants.views.DEVELOPER_CONFIRM_OFF_SITE_GAIN, {
      ...context.offSiteHedgerowTableContent,
      ...context.offSiteHabitatTableContent,
      ...context
    })
  },
  post: async (request, h) => {
    const confirmOffsiteGain = request.payload.confirmOffsiteGain
    const metricUploadLocation = request.yar.get(constants.redisKeys.DEVELOPER_METRIC_LOCATION)
    request.yar.set(constants.redisKeys.CONFIRM_OFFSITE_GAIN_CHECKED, confirmOffsiteGain)
    if (confirmOffsiteGain === constants.CONFIRM_OFF_SITE_GAIN.NO) {
      // delete the file from blob storage
      const config = {
        containerName: 'trusted',
        blobName: metricUploadLocation
      }
      await blobStorageConnector.deleteBlobIfExists(config)
      request.yar.clear(constants.redisKeys.DEVELOPER_METRIC_LOCATION)
      return h.redirect(constants.routes.DEVELOPER_UPLOAD_METRIC)
    } else if (confirmOffsiteGain === constants.CONFIRM_OFF_SITE_GAIN.YES) {
      return h.redirect('/#')
    } else {
      return h.view(constants.views.DEVELOPER_CONFIRM_OFF_SITE_GAIN, {
        ...await getContext(request),
        err: [
          {
            text: 'Select yes if this is the correct data',
            href
          }
        ]
      })
    }
  }
}

const getContext = request => {
  const metricData = request.yar.get(constants.redisKeys.DEVELOPER_METRIC_DATA)
  const offSiteHabitatTableContent = metricData?.offSiteHabitatBaseline ? getFormattedTableContent(metricData?.offSiteHabitatBaseline, constants.offSiteGainTypes.HABITAT) : []
  const offSiteHedgerowTableContent = metricData?.offSiteHedgeBaseline ? getFormattedTableContent(metricData?.offSiteHedgeBaseline, constants.offSiteGainTypes.HEDGEROW) : []

  return {
    offSiteHabitatTableContent,
    offSiteHedgerowTableContent
  }
}

const getFormattedTableContent = (content, type) => {
  let formattedContent
  switch (type) {
    case constants.offSiteGainTypes.HABITAT: {
      const noOfHabitatUnits = content.map(item => item.broadHabitat ? item.areaHectares : 0).reduce((prev, next) => prev + next, 0)
      formattedContent = (content).map(item => item.broadHabitat
        ? (
            [
              {
                html: `${tableRowHTML} ${item.habitatType} </span>`,
                classes: tableRowCss
              },
              {
                text: item.areaHectares
              }
            ]
          )
        : null)
      formattedContent.push(
        [
          {
            text: 'Total area',
            classes: tableRowCss
          },
          {
            text: noOfHabitatUnits
          }
        ]
      )
    }
      break
    case constants.offSiteGainTypes.HEDGEROW: {
      const noOfHedgerowUnits = content.map(item => item.hedgerowType ? item.lengthKm : 0).reduce((prev, next) => prev + next, 0)
      formattedContent = (content).map(item => item.hedgerowType
        ? (
            [
              {
                html: `${tableRowHTML} ${item.hedgerowType} </span>`,
                classes: tableRowCss
              },
              {
                text: item.lengthKm
              }
            ]
          )
        : null)

      formattedContent.push(
        [
          {
            text: 'Total length',
            classes: 'govuk-!-width-two-thirds'
          },
          {
            text: noOfHedgerowUnits
          }
        ]
      )
    }
      break
    default:
      formattedContent = []
  }

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
