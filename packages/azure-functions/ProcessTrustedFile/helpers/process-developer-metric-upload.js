import prepareUploadMetric from '../../Shared/prepare-upload-metric.js'

export default async (context, config) => {
  const { extractionConfiguration, validationConfiguration, extractMetricContent } = bngMetricService
  let metricData
  try {
    const response = await blobStorageConnector.downloadStreamIfExists(context, config)
    if (response) {
      const docStream = response.readableStreamBody
      const metricExtractionConfig = {
        extractionConfiguration: {
          start: extractionConfiguration.startExtractionConfig,
          ...extractionConfiguration['v4.1']
        },
        validationConfiguration
      }
      metricData = await extractMetricContent(docStream, metricExtractionConfig)
    } else {
      throw new Error('Unable to retrieve blob for developer metric file')
    }
    return {
      metricData: processMetric(metricData)
    }
  } catch (err) {
    context.log.error(err)
    throw err
  }
}
