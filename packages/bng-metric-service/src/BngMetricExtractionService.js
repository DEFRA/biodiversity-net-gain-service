import {
  habitatBaselineExtractionConfig, startExtractionConfig
} from './extractors/extractionconfig/configuration.js'
import BngMetricSingleDataExtractor from './extractors/BngMetricSingleDataExtractor.js'
import _ from 'lodash'

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

    const extractedData = await this.#bngSingleExtractor.extractContent(contentInputStream, extractionConfiguration)
    const newExtractedData = {}
    for (const key in extractedData) {
      if (Object.hasOwnProperty.call(extractedData, key)) {
        newExtractedData[key] = Object.keys(extractedData[key]).reduce((r, k) => {
          r[_.camelCase(k)] = extractedData[key][k]
          return r
        }, {})
      }
    }
    return newExtractedData
  }
}

export default BngMetricExtractionService
