import _ from 'lodash'
import xslx from 'xlsx'
import { logger } from 'defra-logging-facade'

const readAndExtractContent = async (contentInputStream, extractionConfiguration) => {
  return new Promise((resolve, reject) => {
    const data = []
    contentInputStream.on('data', chunk => {
      data.push(chunk)
    })

    contentInputStream.on('end', () => {
      // Note: If in case extraction seems slow, then `sheetRows` option needs to added to extract limited rows
      const workBook = xslx.read(Buffer.concat(data), { type: 'buffer', sheetRows: 100 })
      const response = {}
      if (!_.isUndefined(extractionConfiguration)) {
        Object.keys(extractionConfiguration).forEach(key => {
          response[key] = extractSingleSheetContent(workBook, extractionConfiguration[key])
        })
      }
      resolve(response)
    })

    contentInputStream.on('error', err => {
      reject(err)
    })
  })
}

const extractSingleSheetContent = (workbook, extractionConfiguration) => {
  if (_.isUndefined(extractionConfiguration) || _.isUndefined(workbook)) {
    logger.log(`${new Date().toUTCString()} Undifined metric extraction config`)
    return null
  }

  const worksheet = workbook.Sheets[extractionConfiguration.sheetName]

  if (_.isUndefined(worksheet)) {
    logger.log(`${new Date().toUTCString()} Worksheet not found`)
    return null
  }

  const titleCellValue = worksheet[extractionConfiguration.titleCellAddress]?.v || ''
  const sheetTitle =
    extractionConfiguration.titleCellAddress === undefined
      ? extractionConfiguration.sheetName
      : titleCellValue

  // Update sheet range
  if (extractionConfiguration.endCell) {
    worksheet['!ref'] = `${extractionConfiguration.startCell}:${extractionConfiguration.endCell}`
  } else {
    worksheet['!ref'] = `${extractionConfiguration.startCell}:${worksheet['!ref'].split(':')[1]}`
  }

  let data = {
    sheetTitle
  }
  // IF: Start sheet have vertical header & row structure, so not need to add header config option here
  // ELSE: Header config option useful for sheet whcih have multiple rows like 'D-1 Off-Site Habitat Baseline'
  if (extractionConfiguration.sheetName === 'Start') {
    data = xslx.utils.sheet_to_json(worksheet, { blankrows: false })
    data = parseVerticalColumns(data)
    return data
  }

  data = xslx.utils.sheet_to_json(worksheet, { skipHidden: false, blankrows: true, header: 3 })
  return prepareDataValues(data, extractionConfiguration)
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
 *@param data type: extracted raw data to json from metric file.
 *@param header type: cell header from config.
 *@return type: array
 *================================================================================================**/
const prepareDataValues = (data, config) => {
  const result = []
  const header = config.cellHeaders
  const requiredField = config.requiredField

  if (_.isEmpty(data)) {
    logger.log(`${new Date().toUTCString()} Data does not extracted for ${config.sheetName}`)
    return null
  }

  const keyValues = Object.keys(data[0])
  for (const item of data) {
    // Check if required field is non empty to avoid unneccessary looping
    const isUndefinedItem = _.isEmpty(item[requiredField])
    const checkOnKeyFormatting = !_.isUndefined(item[getFormatedNewKey(requiredField)]) && _.isEmpty(item[getFormatedNewKey(requiredField)])
    if (isUndefinedItem && checkOnKeyFormatting) {
      break
    }

    const tmpArr = keyValues.reduce((acc, el, i, arr) => {
      // Filtering keys to remove trailing space
      let _key = _.isString(el) ? el.trim() : ''
      _key = _key.replace(':', '')

      // Checking if key exists into header config and EMPTY coulmn entries would be neglected
      if (_.includes(header, el) || el.indexOf('EMPTY') === -1) {
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
    result.push(Object.assign({}, ...tmpArr))
  }
  return result
}

export default (contentInputStream, config) => readAndExtractContent(contentInputStream, config)
