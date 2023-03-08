import BngMetricSingleDataExtractor from './extractors/bng-metric-single-data-extractor.js'

export default (contentInputStream, options) => {
  const bngSingleExtractor = new BngMetricSingleDataExtractor()
  return bngSingleExtractor.extractContent(contentInputStream, options)
}
