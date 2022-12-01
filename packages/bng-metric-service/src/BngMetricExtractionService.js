import {
  habitatBaselineExtractionConfig, startExtractionConfig
} from './extractors/extractionconfig/configuration.js'
import BngMetricSingleDataExtractor from './extractors/BngMetricSingleDataExtractor.js'

class BngMetricExtractionService {
  #bngSingleExtractor = undefined

  constructor () {
    this.#bngSingleExtractor = new BngMetricSingleDataExtractor()
  }

  extractMetricContent = async contentInputStream => {
    const extractionConfiguration = {
      startPage: startExtractionConfig,
      siteHabitatBaseline: habitatBaselineExtractionConfig
    }

    return this.#bngSingleExtractor.extractContent(contentInputStream, extractionConfiguration)
  }
}

export default BngMetricExtractionService
