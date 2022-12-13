import { habitatBaselineExtractionConfig, startExtractionConfig } from './extractors/extractionconfig/configuration.js'
import BngMetricSingleDataExtractor from './extractors/BngMetricSingleDataExtractor.js'

const extractMetricContent = (contentInputStream) => {
  const bngSingleExtractor = new BngMetricSingleDataExtractor()
  const extractionConfiguration = {
    startPage: startExtractionConfig,
    siteHabitatBaseline: habitatBaselineExtractionConfig
  }

  return bngSingleExtractor.extractContent(contentInputStream, extractionConfiguration)
}

export default { extractMetricContent }
