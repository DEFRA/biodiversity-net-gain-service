import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import { logger } from 'defra-logging-facade'

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
    const config = {}
    // Check if specific version directory exists
    const __dirname = path.resolve()
    const configBasePath = path.join(__dirname, '../', `bng-metric-service/src/helpers/config/${version}`)
    const sheetsToBeExtractedPath = `${configBasePath}/sheetsToBeExtracted.js`
    if (!fs.existsSync(sheetsToBeExtractedPath)) {
      fs.mkdirSync(configBasePath)
      fs.openSync(sheetsToBeExtractedPath, 'a')

      logger.info(`${new Date().toUTCString()} A new file ${sheetsToBeExtractedPath} created and needs to add sheet names there`)
      return null
    }

    // Creates all configs file if not exists, as per defined sheet names into sheetsToBeExtracted.js
    const sheetNames = (await import(sheetsToBeExtractedPath)).default
    const finalSheetNames = validateSheetNameArray(sheetNames)
    if (finalSheetNames.length > 0) {
      for (const sheetName of finalSheetNames) {
        const _key = _.camelCase(sheetName)
        const sheetNameConfigPath = `${configBasePath}/${_key}.js`
        if (!fs.existsSync(sheetNameConfigPath)) {
          const configTemplate =
            `const cellHeaders = []\n
            export default {
              titleCellAddress: '',
              startCell: '',
              endCell: '',
              columnsToCheckNull: '',
              cellHeaders
            }`

          fs.writeFileSync(sheetNameConfigPath, configTemplate)
          logger.info(`${new Date().toUTCString()} A new file ${_key}.js created under ${version} directory`)
        } else {
          const sheetConfig = (await import(`./config/${version}/${_key}.js`)).default
          sheetConfig.sheetName = sheetName
          config[_key] = sheetConfig
        }
      }
    }

    return config
  } catch (error) {
    logger.error(`${new Date().toUTCString()} ${error.message}`)
  }
}
