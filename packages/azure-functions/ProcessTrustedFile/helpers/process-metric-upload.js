import buildSignalRMessage from '../../Shared/build-signalr-message.js'
import bngMetricService from '@defra/bng-metric-service'
import { blobStorageConnector } from '@defra/bng-connectors-lib'

export default async function (context, config) {
  let signalRMessageArguments, metricData
  try {
    const blobConfig = {
      blobName: config.fileConfig.fileLocation,
      containerName: config.containerName
    }
    const response = await blobStorageConnector.downloadStreamIfExists(context, blobConfig)
    if (response) {
      const documentStream = response.readableStreamBody
      const { startExtractionConfig, getExtractionConfiguration } = bngMetricService.extractionConfiguration
      const metricExtractionConfig = {
        extractionConfiguration: {
          start: startExtractionConfig,
          ...await getExtractionConfiguration({ role: config.role })
        },
        validationConfiguration: bngMetricService.validationConfiguration
      }
      metricData = await bngMetricService.extractMetricContent(documentStream, metricExtractionConfig)
    } else {
      throw new Error('Unable to retrieve blob')
    }

    signalRMessageArguments = [{
      location: config.fileConfig.fileLocation,
      metricData: processMetric(metricData)
    }]
  } catch (err) {
    context.log.error(err)
    signalRMessageArguments = [{ errorCode: err.code }]
  } finally {
    context.bindings.signalRMessages = [buildSignalRMessage(config.signalRMessageConfig, signalRMessageArguments)]
  }
}

const processMetric = metricData => ({
  startPage: metricData.start,
  d1: metricData.d1OffSiteHabitatBaseline,
  d2: metricData.d2OffSiteHabitatCreation,
  d3: metricData.d3OffSiteHabitatEnhancement,
  e1: metricData.e1OffSiteHedgeBaseline,
  e2: metricData.e2OffSiteHedgeCreation,
  e3: metricData.e3OffSiteHedgeEnhancement,
  f1: metricData.f1OffSiteWaterCBaseline,
  f2: metricData.f2OffSiteWaterCCreation,
  f3: metricData.f3OffSiteWaterCEnhancement,
  validation: metricData.validation
})
