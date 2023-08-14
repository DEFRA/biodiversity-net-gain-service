import fs from 'fs'
import _ from 'lodash'
import path from 'path'
import start from './metric/start.js'
import url from 'url'

export const getCellHeaders = (role, headers) => {
  let _header = []
  /* istanbul ignore else */
  if (!_.isEmpty(headers)) {
    if (role === 'developer') {
      _header = headers.developer && !_.isEmpty(headers.developer) ? [...headers.common, ...headers.developer] : headers.common
    } else {
      _header = headers.landowner && !_.isEmpty(headers.landowner) ? [...headers.common, ...headers.landowner] : headers.common
    }
  }
  return _header
}

export default {
  startExtractionConfig: start,
  getExtractionConfiguration: async (options = {}) => {
    try {
      const result = {}
      const currentMetricVersion = _.isEmpty(options.v) ? (process.env.CURRENT_METRIC_VERSION || 'v4.0') : options.v
      const configFolderPath = `bng-metric-service/src/helpers/extractors/extraction-config/metric/${currentMetricVersion}/`
      let fullConfigFolderPath = path.resolve('./', `../${configFolderPath}`)
      /* istanbul ignore else */
      console.log(`Checking for existence of ${fullConfigFolderPath}`)
      if (!fs.existsSync(url.pathToFileURL(fullConfigFolderPath))) {
        fullConfigFolderPath = path.resolve(`packages/${configFolderPath}`)
      }
      console.log(`Reading ${fullConfigFolderPath}`)
      const files = fs.readdirSync(url.pathToFileURL(fullConfigFolderPath))
      for (const file of files) {
        console.log(`Importing ${fullConfigFolderPath}/${file}`)
        const cnf = await import(path.resolve(`${fullConfigFolderPath}/${file}`))
        const sheetConfig = cnf.default
        const cellHeaders = getCellHeaders(options.role, cnf.headers)
        sheetConfig.cellHeaders = cellHeaders
        result[_.camelCase(path.parse(file).name)] = sheetConfig
      }
      return result
    } catch (error) {
      throw new Error(error)
    }
  }
}
