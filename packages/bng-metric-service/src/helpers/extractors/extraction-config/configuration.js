import start from './metric/start.js'

// Metric 4.0
import d1OffSiteHabitatBaselinev4 from './metric/v4.1/d1-off-site-habitat-baseline.js'
import d2OffSiteHabitatCreationv4 from './metric/v4.1/d2-off-site-habitat-creation.js'
import d3OffSiteHabitatEnhancementv4 from './metric/v4.1/d3-off-site-habitat-enhancement.js'
import e1OffSiteHedgeBaselinev4 from './metric/v4.1/e1-off-site-hedge-baseline.js'
import e2OffSiteHedgeCreationv4 from './metric/v4.1/e2-off-site-hedge-creation.js'
import e3OffSiteHedgeEnhancementv4 from './metric/v4.1/e3-off-site-hedge-enhancement.js'
import f1OffSiteWaterCBaselinev4 from './metric/v4.1/f1-off-site-waterC-baseline.js'
import f2OffSiteWaterCCreationv4 from './metric/v4.1/f2-off-site-waterC-creation.js'
import f3OffSiteWaterCEnhancementv4 from './metric/v4.1/f3-off-site-waterC-enhancement.js'

export default {
  startExtractionConfig: start,
  'v4.1': {
    d1OffSiteHabitatBaseline: d1OffSiteHabitatBaselinev4,
    d2OffSiteHabitatCreation: d2OffSiteHabitatCreationv4,
    d3OffSiteHabitatEnhancement: d3OffSiteHabitatEnhancementv4,
    e1OffSiteHedgeBaseline: e1OffSiteHedgeBaselinev4,
    e2OffSiteHedgeCreation: e2OffSiteHedgeCreationv4,
    e3OffSiteHedgeEnhancement: e3OffSiteHedgeEnhancementv4,
    f1OffSiteWaterCBaseline: f1OffSiteWaterCBaselinev4,
    f2OffSiteWaterCCreation: f2OffSiteWaterCCreationv4,
    f3OffSiteWaterCEnhancement: f3OffSiteWaterCEnhancementv4
  }
}
