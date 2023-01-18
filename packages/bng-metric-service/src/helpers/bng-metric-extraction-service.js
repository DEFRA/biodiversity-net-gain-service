import BngMetricSingleDataExtractor from './extractors/BngMetricSingleDataExtractor.js'

export default (contentInputStream, options) => {
  const bngSingleExtractor = new BngMetricSingleDataExtractor()
  return bngSingleExtractor.extractContent(contentInputStream, options.extractionConfiguration)
}
