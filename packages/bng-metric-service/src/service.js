import extractMetricContent from './helpers/bng-metric-extraction-service.js'
import extractionConfiguration from './helpers/extractors/extraction-config/configuration.js'
import validationConfiguration from './helpers/extractors/validation-config/index.js'

export default {
  extractMetricContent,
  extractionConfiguration,
  validationConfiguration
}

// extractionConfiguration.getExtractionConfiguration({ role: 'a', v: 'v4.0' })
