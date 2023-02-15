import constants from '../../utils/constants.js'
import { blobStorageConnector } from '@defra/bng-connectors-lib'

const href = '#offsite-details-checked-yes'
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
      return h.redirect('/' + constants.views.DEVELOPER_LEGAL_AGREEMENT_UPLOAD)
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
  const offSiteHabitatTableContent = getFormattedTableContent(metricData?.offSiteHabitatBaseline, constants.offSiteGainTypes.HABITAT)
  const offSiteHedgerowTableContent = getFormattedTableContent(metricData?.offSiteHedgeBaseline, constants.offSiteGainTypes.HEDGEROW)

  return {
    offSiteHabitatTableContent,
    offSiteHedgerowTableContent
  }
}

const getFormattedTableContent = (content, type) => {
  let formattedContent
  const noOfUnits = (content || []).map(item => type === constants.offSiteGainTypes.HABITAT ? item.areaHectares : item.lengthKm).reduce((prev, next) => prev + next, 0)
  switch (type) {
    case constants.offSiteGainTypes.HABITAT:
      formattedContent = (content || []).map(item => item.broadHabitat !== null
        ? (
            [
              {
                html: "<span class='govuk-body-m govuk-!-display-block govuk-!-margin-top-0 govuk-!-margin-bottom-0'>" + item.broadHabitat + "</span> <span class='govuk-body-s govuk-!-display-block govuk-!-margin-top-0 govuk-!-margin-bottom-0'>" + item.habitatType + '</span>',
                classes: 'govuk-!-width-two-thirds'
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
            classes: 'govuk-!-width-two-thirds'
          },
          {
            text: noOfUnits
          }
        ]
      )
      break
    case constants.offSiteGainTypes.HEDGEROW:
      formattedContent = (content || []).map(item => item.hedgerowType !== null
        ? (
            [
              {
                html: "<span class='govuk-body-m govuk-!-display-block govuk-!-margin-top-0 govuk-!-margin-bottom-0'>" + item.hedgerowType + '</span>',
                classes: 'govuk-!-width-two-thirds'
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
            text: noOfUnits
          }
        ]
      )
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
