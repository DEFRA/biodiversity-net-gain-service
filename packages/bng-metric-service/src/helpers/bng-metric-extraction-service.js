import _ from 'lodash'
import xslx from 'xlsx'
import { logger } from 'defra-logging-facade'
import { getPreprocessedConfigs } from './get-preprocessed-configs.js'
import { ValidationError, uploadMetricFileErrorCodes } from '@defra/bng-errors-lib'

/** ================================================================================================
 ** Returns configs based on start work sheet metric version field along with its extracted data.
 *@param workbook type: WB | Read the metric file as a WorkBook using XLSX module
 *@return type: object
 *================================================================================================**/
const getConfigsAndStartSheetData = async (workBook) => {
  try {
    // Get first sheet config
    const startSheetConfig = (await import('./config/start.js')).default

    // Extract first sheet of the metric file to know its version
    const startSheetData = extractSingleSheetContent(workBook, startSheetConfig)
    // console.log("startSheetData==>", startSheetConfig, startSheetData)
    const metricVersion = (startSheetData?.metricVersion)?.toString().trim()
    if (!metricVersion) {
      throw new ValidationError(uploadMetricFileErrorCodes.INVALID_UPLOAD, 'Metric version field of Start worksheet required.')
    }

    // Get configs of all defined file under config directory
    const extractionConfigs = await getPreprocessedConfigs(metricVersion)

    // Return configs
    return { startSheetData, extractionConfigs }
  } catch (err) {
    logger.error(err)
  }
}

/** ================================================================================================
 ** Returns extracted data for a single sheet at a time.
 *@param workbook type: WB | Read the metric file as a WorkBook using XLSX module
 *@param extractionConfig type: object | An object of specific work sheet.
 *@return type: array
 *================================================================================================**/
const extractSingleSheetContent = (workbook, extractionConfig) => {
  if (_.isUndefined(extractionConfig) || _.isUndefined(workbook)) {
    logger.log(`${new Date().toUTCString()} Undifined metric extraction config of ${extractionConfig.sheetName}`)
    return null
  }

  const worksheet = workbook.Sheets[extractionConfig.sheetName]

  if (_.isUndefined(worksheet)) {
    logger.log(`${new Date().toUTCString()} Worksheet '${extractionConfig.sheetName}' not found`)
    return null
  }

  const titleCellValue = worksheet[extractionConfig.titleCellAddress]?.v || ''
  const sheetTitle =
    extractionConfig.titleCellAddress === undefined
      ? extractionConfig.sheetName
      : titleCellValue

  // Update sheet range
  if (extractionConfig.endCell) {
    worksheet['!ref'] = `${extractionConfig.startCell}:${extractionConfig.endCell}`
  } else {
    worksheet['!ref'] = `${extractionConfig.startCell}:${worksheet['!ref'].split(':')[1]}`
  }

  let data = {
    sheetTitle
  }
  // IF: Start sheet have vertical headers & row structure, so not need to add headers config option here
  // ELSE: Header config option useful for sheet whcih have multiple rows like 'D-1 Off-Site Habitat Baseline'
  if (extractionConfig.sheetName === 'Start') {
    data = xslx.utils.sheet_to_json(worksheet, { blankrows: false })
    data = parseVerticalColumns(data)
    return data
  }

  data = xslx.utils.sheet_to_json(worksheet, { skipHidden: false, blankrows: true, headers: 3 })

  if (_.isEmpty(data)) {
    logger.log(`${new Date().toUTCString()} Data does not extracted for ${extractionConfig.sheetName}`)
    return null
  }

  return prepareDataValues(data, extractionConfig)
}

/** ================================================================================================
 ** Returns formated key on the basis of given key string.
 *@param key type: string | Key of the extracted data
 *@return type: array
 *================================================================================================**/
const getFormatedNewKey = key => {
  const newKey = _.isString(key) ? key.trim().replace(':', '') : undefined
  return _.camelCase(newKey)
}

/** ================================================================================================
 ** Returns parsed data array on the basis of given raw array.
 *@param data type: array | Extracted raw data to json from metric file.
 *@return type: array
 *================================================================================================**/
const parseVerticalColumns = data => data.reduce((obj, item) => Object.assign(obj, { [getFormatedNewKey(Object.values(item)[0])]: Object.values(item)[1] }), {})

/** ================================================================================================
 ** Returns parsed data array on the basis of given raw array.
 *@param data type: array | Extracted raw data to json from metric file.
 *@param extractionConfig type: object | An object of specific work sheet.
 *@return type: array
 *================================================================================================**/
const prepareDataValues = (data, extractionConfig) => {
  const result = []
  const headers = extractionConfig.cellHeaders
  const columnsToCheckNull = extractionConfig.columnsToCheckNull

  const dataKeys = Object.keys(data[0])
  for (const item of data) {
    // Check if required field is non empty to avoid unneccessary looping
    const isUndefinedItem = _.isEmpty(item[columnsToCheckNull])
    const checkOnKeyFormatting = _.isEmpty(item[getFormatedNewKey(columnsToCheckNull)])
    if (isUndefinedItem && checkOnKeyFormatting) {
      break
    }

    result.push(Object.assign({}, ...getFilteredArrayByKeys(headers, dataKeys, item)))
  }
  return result
}

/** ================================================================================================
 ** Returns filtered array on the basis of given headers keys and config.
 *@param headers type: object | An object of the cell headers from config.
 *@param dataKeys type: array | Extracted keys form first row of data.
 *@param item type: object | Rows of data.
 *@return type: array
 *================================================================================================**/
const getFilteredArrayByKeys = (headers, dataKeys, item) => dataKeys.reduce((acc, el, i, arr) => {
  // Filtering keys to remove trailing space
  let _key
  if (_.isString(el)) {
    _key = el.trim()
    _key = _key.replace(':', '')
  }

  // Checking if key exists into headers array and EMPTY coulmn entries would be neglected
  const checkIfKeys = _.includes(headers, el) || el.indexOf('EMPTY') === -1
  if (!_.isUndefined(_key) && checkIfKeys) {
    // Checking for duplicates key and appending with index to differntiate
    if (arr.indexOf(_key) !== i && acc.indexOf(_key) < 0) {
      _key = `${_key}_${i}`
    }

    // Renamed keys in camelCase for easy to use and to avoid code smell
    _key = _.camelCase(_key)
    acc.push({ [_key]: item[el] })
  }
  return acc
}, [])

/** ================================================================================================
 ** Helps to extract metric file data by using input stream.
 *@param contentInputStream type: stream | Streamed data of uploaded file, which is passed by azure function.
 *@return type: array
 *================================================================================================**/
export default async (contentInputStream) => {
  return new Promise((resolve, reject) => {
    const data = []
    contentInputStream.on('data', chunk => {
      data.push(chunk)
    })

    contentInputStream.on('end', async () => {
      try {
        // Note: If in case extraction seems slow, then `sheetRows` option needs to added to extract limited rows
        const workBook = xslx.read(Buffer.concat(data), { type: 'buffer', sheetRows: 100 })

        const configAndStartSheetData = await getConfigsAndStartSheetData(workBook)
        
        if(!configAndStartSheetData) throw new ValidationError('Start worksheet required')

        const { startSheetData, extractionConfigs } = configAndStartSheetData
        const response = {
          startPage: startSheetData || {}
        }
        if (!_.isUndefined(extractionConfigs)) {
          Object.keys(extractionConfigs).forEach(key => {
            response[key] = extractSingleSheetContent(workBook, extractionConfigs[key])
          })
        }
        resolve(response)
      } catch (error) {
        console.error(error)
        reject(error)
      }
    })

    contentInputStream.on('error', err => {
      reject(err)
    })
  })
}
