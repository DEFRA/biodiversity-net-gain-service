import fs from 'fs'
import _ from 'lodash'
import path from 'path'
import start from './metric/start.js'
import dirname from './dirname.cjs'

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

const prepareExtractionConfig = async role => {
  try {
    const result = {}
    const currentMetricVersion = process.env.CURRENT_METRIC_VERSION || 'v4.0'
    const fullConfigFolderPath = path.join(dirname, 'metric', currentMetricVersion)
    const files = fs.readdirSync(fullConfigFolderPath)
    for (const file of files) {
      const cnf = await import(path.resolve(`${fullConfigFolderPath}/${file}`))
      const sheetConfig = cnf.default
      const cellHeaders = getCellHeaders(role, cnf.headers)
      sheetConfig.cellHeaders = cellHeaders
      result[_.camelCase(path.parse(file).name)] = sheetConfig
    }
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export default {
  startExtractionConfig: start,
  getExtractionConfigForDeveloper: async () => prepareExtractionConfig('developer'),
  getExtractionConfigForLandowner: async () => prepareExtractionConfig('landowner')
}
