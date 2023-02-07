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
      const workBook = xslx.read(Buffer.concat(data), { type: 'buffer' })
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
    return
  }

  const worksheet = workbook.Sheets[extractionConfiguration.sheetName]

  if (_.isUndefined(worksheet)) {
    logger.log(`${new Date().toUTCString()} Worksheet not found`)
    return
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

  let data = {}
  data.sheetTitle = sheetTitle
  // IF: Start sheet have vertical header & row structure, so not need to add header config option here
  // ELSE: Header config option useful for sheet whcih have multiple rows like 'D-1 Off-Site Habitat Baseline'
  if (extractionConfiguration.sheetName === 'Start') {
    data = xslx.utils.sheet_to_json(worksheet, { blankrows: false })
    data = parseVerticalColumns(data, extractionConfiguration)
  } else {
    data = xslx.utils.sheet_to_json(worksheet, { blankrows: true, raw: true, defval: null, range: worksheet['!ref'], skipHidden: true })
    data = prepareDataValues(data, extractionConfiguration.cellHeaders)
  }

  return data
}

const getFormatedNewKey = (key) => {
  const newKey = _.isString(key) ? key.trim().replace(':', '') : undefined
  return _.camelCase(newKey)
}

const parseVerticalColumns = (data) => {
  return data.reduce((obj, item) => Object.assign(obj, { [getFormatedNewKey(Object.values(item)[0])]: Object.values(item)[1] }), {})
}

const prepareDataValues = (data, header) => {
  if (!_.isEmpty(data)) {
    return data.map(item => {
      const keyValues = Object.keys(item).map(key => {
        const _key = _.isString(key) ? key.trim().replace(':', '') : ''
        if (_.includes(header, _key)) {
          return { [_.camelCase(_key)]: item[key] }
        }
        return null
      })
      return Object.assign({}, ...keyValues)
    })
  }
  return null
}

export default (contentInputStream, config) => {
  return readAndExtractContent(contentInputStream, config)
}
