import {
  habitatBaselineExtractionConfig, startExtractionConfig
} from './extractors/extractionconfig/configuration.js'
import BNGMetrixSingleDataExtracrtor from './extractors/BNGMetrixSingleDataExtracrtor.js'

class BNGMetricExtractionService {
  #bngSingleExtractor = undefined

  constructor () {
    this.#bngSingleExtractor = new BNGMetrixSingleDataExtracrtor()
  }

  extractMetricContent = async contentInputStream => {
    const extractionConfiguration = {
      startPage: startExtractionConfig,
      siteHabitatBaseline: habitatBaselineExtractionConfig
    }

    return this.#bngSingleExtractor.extractContent(contentInputStream, extractionConfiguration)
  }
}

export default BNGMetricExtractionService
