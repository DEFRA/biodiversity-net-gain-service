import buildSignalRMessage from '../../Shared/build-signalr-message.js'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import bngMetricService from '@defra/bng-metric-service'

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
      const extractionConfiguration = {
        startPage: bngMetricService.extractionConfiguration.startExtractionConfig,
        d1OffSiteHabitatBaselinev31: bngMetricService.extractionConfiguration['v3.1'].d1OffSiteHabitatBaseline,
        d2OffSiteHabitatCreationv31: bngMetricService.extractionConfiguration['v3.1'].d2OffSiteHabitatCreation,
        d3OffSiteHabitatEnhancementv31: bngMetricService.extractionConfiguration['v3.1'].d3OffSiteHabitatEnhancement,
        e1OffSiteHedgeBaselinev31: bngMetricService.extractionConfiguration['v3.1'].e1OffSiteHedgeBaseline,
        e2OffSiteHedgeCreationv31: bngMetricService.extractionConfiguration['v3.1'].e2OffSiteHedgeCreation,
        e3OffSiteHedgeEnhancementv31: bngMetricService.extractionConfiguration['v3.1'].e3OffSiteHedgeEnhancement,
        f1OffSiteRiverBaselinev31: bngMetricService.extractionConfiguration['v3.1'].f1OffSiteRiverBaseline,
        f2OffSiteRiverCreationv31: bngMetricService.extractionConfiguration['v3.1'].f2OffSiteRiverCreation,
        f3OffSiteRiverEnhancementv31: bngMetricService.extractionConfiguration['v3.1'].f3OffSiteRiverEnhancement,
        // Metric 4.0
        d1OffSiteHabitatBaselinev4: bngMetricService.extractionConfiguration['v4.0'].d1OffSiteHabitatBaseline,
        d2OffSiteHabitatCreationv4: bngMetricService.extractionConfiguration['v4.0'].d2OffSiteHabitatCreation,
        d3OffSiteHabitatEnhancementv4: bngMetricService.extractionConfiguration['v4.0'].d3OffSiteHabitatEnhancement,
        e1OffSiteHedgeBaselinev4: bngMetricService.extractionConfiguration['v4.0'].e1OffSiteHedgeBaseline,
        e2OffSiteHedgeCreationv4: bngMetricService.extractionConfiguration['v4.0'].e2OffSiteHedgeCreation,
        e3OffSiteHedgeEnhancementv4: bngMetricService.extractionConfiguration['v4.0'].e3OffSiteHedgeEnhancement,
        f1OffSiteWaterCBaselinev4: bngMetricService.extractionConfiguration['v4.0'].f1OffSiteWaterCBaseline,
        f2OffSiteWaterCCreationv4: bngMetricService.extractionConfiguration['v4.0'].f2OffSiteWaterCCreation,
        f3OffSiteWaterCEnhancementv4: bngMetricService.extractionConfiguration['v4.0'].f3OffSiteWaterCEnhancement
      }
      metricData = await bngMetricService.extractMetricContent(documentStream, { extractionConfiguration })
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
const processMetric = metricData => {
  return {
    startPage: metricData.startPage,
    d1: metricData.d1OffSiteHabitatBaselinev31 || metricData.d1OffSiteHabitatBaselinev4,
    d2: metricData.d2OffSiteHabitatCreationv31 || metricData.d2OffSiteHabitatCreationv4,
    d3: metricData.d3OffSiteHabitatEnhancementv31 || metricData.d3OffSiteHabitatEnhancementv4,
    e1: metricData.e1OffSiteHedgeBaselinev31 || metricData.e1OffSiteHedgeBaselinev4,
    e2: metricData.e2OffSiteHedgeCreationv31 || metricData.e2OffSiteHedgeCreationv4,
    e3: metricData.e3OffSiteHedgeEnhancementv31 || metricData.e3OffSiteHedgeEnhancementv4,
    f1: metricData.f1OffSiteRiverBaselinev31 || metricData.f1OffSiteWaterCBaselinev4,
    f2: metricData.f2OffSiteRiverCreationv31 || metricData.f2OffSiteWaterCCreationv4,
    f3: metricData.f3OffSiteRiverEnhancementv31 || metricData.f3OffSiteWaterCEnhancementv4
  }
}
