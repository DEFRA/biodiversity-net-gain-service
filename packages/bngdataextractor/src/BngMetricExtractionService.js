import {
  habitatBaselineExtractionConfig, habitatCreationExtractionConfig,
  offSiteHabitatBaselineExtractionConfig, offSiteHabitatCreationExtractionConfig,
  enhancementTemporalExtractionConfig, habitatGroupExtractionConfig, startExtractionConfig,
  offSiteHabitatEnhancementExtractionConfig
} from './extractors/extractionconfig/configuration.js'
import BNGMetrixSingleDataExtracrtor from './extractors/BNGMetrixSingleDataExtracrtor.js'

class BngMetricExtractionService {
  #bngSingleExtractor = undefined

  constructor () {
    this.#bngSingleExtractor = new BNGMetrixSingleDataExtracrtor()
  }

  extractMetricContent = async contentInputStream => {
    const extractionConfiguration = {
      startPage: startExtractionConfig,
      siteHabitatBaseline: habitatBaselineExtractionConfig,
      siteHabitatCreation: habitatCreationExtractionConfig,
      offSiteHabitatBaseline: offSiteHabitatBaselineExtractionConfig,
      offSiteHabitatCreation: offSiteHabitatCreationExtractionConfig,
      enhancementTemporal: enhancementTemporalExtractionConfig,
      habitatGroup: habitatGroupExtractionConfig,
      offSiteHabitatEnhancement: offSiteHabitatEnhancementExtractionConfig
    }

    return this.#bngSingleExtractor.extractContent(contentInputStream, extractionConfiguration)
  }
}

export default BngMetricExtractionService
