import BngMetricSingleDataExtractor from './extractors/BngMetricSingleDataExtractor.js'

const extractMetricContent = (contentInputStream, options) => {
  const bngSingleExtractor = new BngMetricSingleDataExtractor()
  return bngSingleExtractor.extractContent(contentInputStream, options.extractionConfiguration)
}

export default extractMetricContent
