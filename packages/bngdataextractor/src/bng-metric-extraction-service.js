import {
  habitatBaselineExtractionConfig, habitatCreationExtractionConfig,
  offSiteHabitatBaselineExtractionConfig, offSiteHabitatCreationExtractionConfig,
  enhancementTemporalExtractionConfig, habitatGroupExtractionConfig, startExtractionConfig,
  offSiteHabitatEnhancementExtractionConfig, headlineResultExtractionConfig
} from './extractors/extractionconfig/configuration.js'
import BNGMetrixSingleDataExtracrtor from './extractors/bng-singletable-extractor.js'

class BngExtractionService {
  #bngSingleExtractor = undefined

  constructor () {
    this.#bngSingleExtractor = new BNGMetrixSingleDataExtracrtor()
  }

  extractMetricContent = async (contentInputStream, extractByKeys=[]) => {
    const extractionConfiguration = {
      startPage: startExtractionConfig,
      headlineResult: headlineResultExtractionConfig,
      siteHabitatBaseline: habitatBaselineExtractionConfig,
      siteHabitatCreation: habitatCreationExtractionConfig,
      offSiteHabitatBaseline: offSiteHabitatBaselineExtractionConfig,
      offSiteHabitatCreation: offSiteHabitatCreationExtractionConfig,
      enhancementTemporal: enhancementTemporalExtractionConfig,
      habitatGroup: habitatGroupExtractionConfig,
      offSiteHabitatEnhancement: offSiteHabitatEnhancementExtractionConfig
    }

    // This will help us to find only the required sheet object
		if(extractByKeys.length > 0){
			for (const key in extractionConfiguration) {
				if(!extractByKeys.includes(key)){
					delete extractionConfiguration[key]
				}
			}
		}

    return await this.#bngSingleExtractor.extractContent(contentInputStream, extractionConfiguration)
  }
}

export default BngExtractionService
