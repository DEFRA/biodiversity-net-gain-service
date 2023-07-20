import fs from 'fs'
import _ from 'lodash'
import path from 'path'
import start from './metric/start.js'
import { logger } from 'defra-logging-facade'

const getCellHeaders = (role, headers) => {
  if (headers) {
    switch (role) {
      case 'developer':
        return headers.developer ? [...headers.common, ...headers.developer] : headers.common
      default:
        return headers.landowner ? [...headers.common, ...headers.landowner] : headers.common
    }
  }
}

export default {
  startExtractionConfig: start,
  getExtractionConfiguration: async (options = {}) => {
    try {
      const result = {}
      const currentMetricVersion = _.isEmpty(options.v) ? (process.env.CURRENT_METRIC_VERSION || 'v4.0') : options.v
      const configFolderPath = `bng-metric-service/src/helpers/extractors/extraction-config/metric/${currentMetricVersion}/`
      let fullConfigFolderPath = path.resolve('./', `../${configFolderPath}`)
      if (!fs.existsSync(fullConfigFolderPath)){
        fullConfigFolderPath = path.resolve(`packages/${configFolderPath}`) 
      }
      const files = fs.readdirSync(fullConfigFolderPath)
      for (const file of files) {
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
