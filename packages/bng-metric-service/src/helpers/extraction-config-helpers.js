import _ from 'lodash'
// Metric 3.0
// import d1OffSiteHabitatBaseline from './metric/v3.1/d1OffSiteHabitatBaseline.js'
// import d2OffSiteHabitatCreation from './metric/v3.1/d2OffSiteHabitatCreation.js'
// import d3OffSiteHabitatEnhancement from './metric/v3.1/d3OffSiteHabitatEnhancement.js'
// import e1OffSiteHedgeBaseline from './metric/v3.1/e1OffSiteHedgeBaseline.js'
// import e2OffSiteHedgeCreation from './metric/v3.1/e2OffSiteHedgeCreation.js'
// import e3OffSiteHedgeEnhancement from './metric/v3.1/e3OffSiteHedgeEnhancement.js'
// import f1OffSiteRiverBaseline from './metric/v3.1/f1OffSiteRiverBaseline.js'
// import f2OffSiteRiverCreation from './metric/v3.1/f2OffSiteRiverCreation.js'
// import f3OffSiteRiverEnhancement from './metric/v3.1/f3OffSiteRiverEnhancement.js'

// Metric 4.0
// import d1OffSiteHabitatBaselinev4 from './metric/v4.0/d1OffSiteHabitatBaseline.js'
// import d2OffSiteHabitatCreationv4 from './metric/v4.0/d2OffSiteHabitatCreation.js'
// import d3OffSiteHabitatEnhancementv4 from './metric/v4.0/d3OffSiteHabitatEnhancement.js'
// import e1OffSiteHedgeBaselinev4 from './metric/v4.0/e1OffSiteHedgeBaseline.js'
// import e2OffSiteHedgeCreationv4 from './metric/v4.0/e2OffSiteHedgeCreation.js'
// import e3OffSiteHedgeEnhancementv4 from './metric/v4.0/e3OffSiteHedgeEnhancement.js'
// import f1OffSiteWaterCBaselinev4 from './metric/v4.0/f1OffSiteWaterCBaseline.js'
// import f2OffSiteWaterCCreationv4 from './metric/v4.0/f2OffSiteWaterCCreation.js'
// import f3OffSiteWaterCEnhancementv4 from './metric/v4.0/f3OffSiteWaterCEnhancement.js'

/** ================================================================================================
 ** Returns sheet names array on the basis of given array.
 *@param names type: array | The array of sheet names will be combined and validated for config.
 *@return type array
 *================================================================================================**/
const validateSheetNameArray = names => {
  const combinedArray = [].concat(...names)
  if ((new Set(combinedArray)).size !== combinedArray.length) {
    logger.error(`${new Date().toUTCString()} Duplicate sheet name`)
    return false
  }

  return combinedArray.map(name => _.isString(name) && name.trim())
}

/** ================================================================================================
 ** Returns config object on the basis of given version.
 ** Config file of each sheet will be imported dynamically and assigning key to it
 *@param version type: string | The version of the metric file.
 *@return type array
 *================================================================================================**/
export const getPreprocessedConfigs = async (version) => {
  try {
    let config = {}
    const sheetNames = (await import(`./config/${version}/sheetsToBeExtracted.js`)).default
    const finalSheetNames = validateSheetNameArray(sheetNames)
  
    for (const sheetName of finalSheetNames) {
      const _key = _.camelCase(sheetName)
      const sheetConfig = (await import(`./config/${version}/${_key}.js`)).default
      sheetConfig.sheetName = sheetName
      config[_key] = sheetConfig
    }
    return config
  } catch (error) {
    console.error(error.message)
  }
}

// export default {
//   startExtractionConfig: start,
//   'v3.1': {
//     d1OffSiteHabitatBaseline,
//     d2OffSiteHabitatCreation,
//     d3OffSiteHabitatEnhancement,
//     e1OffSiteHedgeBaseline,
//     e2OffSiteHedgeCreation,
//     e3OffSiteHedgeEnhancement,
//     f1OffSiteRiverBaseline,
//     f2OffSiteRiverCreation,
//     f3OffSiteRiverEnhancement
//   },
//   'v4.0': {
//     d1OffSiteHabitatBaseline: d1OffSiteHabitatBaselinev4,
//     d2OffSiteHabitatCreation: d2OffSiteHabitatCreationv4,
//     d3OffSiteHabitatEnhancement: d3OffSiteHabitatEnhancementv4,
//     e1OffSiteHedgeBaseline: e1OffSiteHedgeBaselinev4,
//     e2OffSiteHedgeCreation: e2OffSiteHedgeCreationv4,
//     e3OffSiteHedgeEnhancement: e3OffSiteHedgeEnhancementv4,
//     f1OffSiteWaterCBaseline: f1OffSiteWaterCBaselinev4,
//     f2OffSiteWaterCCreation: f2OffSiteWaterCCreationv4,
//     f3OffSiteWaterCEnhancement: f3OffSiteWaterCEnhancementv4
//   }
// }
