import {
  habitatBaselineExtractionConfig, startExtractionConfig
} from './extractors/extractionconfig/configuration.js'
import BngMetricSingleDataExtractor from './extractors/BngMetricSingleDataExtractor.js'
import { mapKeys, camelCase } from 'lodash'

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

    const extractedData = this.#bngSingleExtractor.extractContent(contentInputStream, extractionConfiguration)
    mapKeys(extractedData, (v, k) => camelCase(k))
    return extractedData
  }
}

export default BngMetricExtractionService
