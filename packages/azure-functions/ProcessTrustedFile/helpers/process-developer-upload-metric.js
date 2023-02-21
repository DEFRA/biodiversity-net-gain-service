import buildSignalRMessage from '../../Shared/build-signalr-message.js'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import bngMetricService from '@defra/bng-metric-service'
import { ValidationError } from '@defra/bng-errors-lib'

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

      // Configs of all required sheets from metric file
      // const extractionConfiguration = {
      //   startPage: bngMetricService.config.startExtractionConfig,
      //   offSiteHabitatBaseline: bngMetricService.config.offSiteHabitatBaselineExtractionConfig,
      //   offSiteHedgeBaseline: bngMetricService.config.offSiteHedgeBaselineExtractionConfig
      // }
      // const extractionConfiguration = {
      //   startPage: bngMetricService.config.startExtractionConfig,
      //   // d1OffSiteHabitatBaseline: bngMetricService.config.d1OffSiteHabitatBaseline,
      //   d1OffSiteHabitatBaselinev31: bngMetricService.config['v3.1'].d1OffSiteHabitatBaseline,
      //   // d2OffSiteHabitatCreationv31: bngMetricService.config['v3.1'].d2OffSiteHabitatCreation,
      //   // d3OffSiteHabitatEnhancementv31: bngMetricService.config['v3.1'].d3OffSiteHabitatEnhancement,
      //   e1OffSiteHedgeBaselinev31: bngMetricService.config['v3.1'].e1OffSiteHedgeBaseline,
      //   // e2OffSiteHedgeCreationv31: bngMetricService.config['v3.1'].e2OffSiteHedgeCreation,
      //   // e3OffSiteHedgeEnhancementv31: bngMetricService.config['v3.1'].e3OffSiteHedgeEnhancement,
      //   // f1OffSiteRiverBaselinev31: bngMetricService.config['v3.1'].f1OffSiteRiverBaseline,
      //   // f2OffSiteRiverCreationv31: bngMetricService.config['v3.1'].f2OffSiteRiverCreation,
      //   // f3OffSiteRiverEnhancementv31: bngMetricService.config['v3.1'].f3OffSiteRiverEnhancement,
      //   // Metric 4.0
      //   d1OffSiteHabitatBaselinev4: bngMetricService.config['v4.0'].d1OffSiteHabitatBaseline,
      //   // d2OffSiteHabitatCreationv4: bngMetricService.config['v4.0'].d2OffSiteHabitatCreation,
      //   // d3OffSiteHabitatEnhancementv4: bngMetricService.config['v4.0'].d3OffSiteHabitatEnhancement,
      //   e1OffSiteHedgeBaselinev4: bngMetricService.config['v4.0'].e1OffSiteHedgeBaseline,
      //   // e2OffSiteHedgeCreationv4: bngMetricService.config['v4.0'].e2OffSiteHedgeCreation,
      //   // e3OffSiteHedgeEnhancementv4: bngMetricService.config['v4.0'].e3OffSiteHedgeEnhancement,
      //   // f1OffSiteWaterCBaselinev4: bngMetricService.config['v4.0'].f1OffSiteWaterCBaseline,
      //   // f2OffSiteWaterCCreationv4: bngMetricService.config['v4.0'].f2OffSiteWaterCCreation,
      //   // f3OffSiteWaterCEnhancementv4: bngMetricService.config['v4.0'].f3OffSiteWaterCEnhancement
      // }

      // Process to extract metric file data using bng-metric-service package
      metricData = await bngMetricService.extractMetricContent(documentStream),
      console.log("DMD==>", metricData)
    } else {
      throw new Error('Unable to retrieve blob')
    }

    signalRMessageArguments = [{
      location: config.fileConfig.fileLocation,
      metricData
    }]
  } catch (err) {
    context.log.error(err)
    if (err instanceof ValidationError) {
      signalRMessageArguments = [{ errorCode: err.code }]
    } else {
      signalRMessageArguments = [{ errorCode: err.message }]
    }  
  } finally {
    context.bindings.signalRMessages = [buildSignalRMessage(config.signalRMessageConfig, signalRMessageArguments)]
  }
}
