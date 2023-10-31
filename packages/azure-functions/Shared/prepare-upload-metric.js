import bngMetricService from "@defra/bng-metric-service";
import { blobStorageConnector } from "@defra/bng-connectors-lib";
import buildSignalRMessage from "./build-signalr-message.js";
import processMetric from "./process-metric.js";

export default async (context, config) => {
  const {
    extractionConfiguration,
    validationConfiguration,
    extractMetricContent,
  } = bngMetricService;
  const { fileConfig, containerName, signalRMessageConfig } = config;
  let signalRMessageArgs, metricData;
  try {
    const blobConfig = {
      blobName: fileConfig.fileLocation,
      containerName,
    };
    const response = await blobStorageConnector.downloadStreamIfExists(
      context,
      blobConfig
    );
    if (response) {
      const docStream = response.readableStreamBody;
      const metricExtractionConfig = {
        extractionConfiguration: {
          start: extractionConfiguration.startExtractionConfig,
          ...extractionConfiguration["v4.0"],
        },
        validationConfiguration,
      };
      metricData = await extractMetricContent(
        docStream,
        metricExtractionConfig
      );
    } else {
      throw new Error(`Unable to retrieve blob ${fileConfig.fileLocation}`);
    }

    signalRMessageArgs = [
      {
        location: fileConfig.fileLocation,
        metricData: processMetric(metricData),
      },
    ];
  } catch (err) {
    context.log.error(err);
    signalRMessageArgs = [{ errorCode: err.code }];
  } finally {
    context.bindings.signalRMessages = [
      buildSignalRMessage(signalRMessageConfig, signalRMessageArgs),
    ];
  }
};
