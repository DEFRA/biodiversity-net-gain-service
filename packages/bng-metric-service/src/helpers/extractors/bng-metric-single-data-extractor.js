import _ from 'lodash'
import xslx from 'xlsx'
import isMetricWorkbook from './validation-config/is-metric-workbook.js'

class BngMetricSingleDataExtractor {
  extractContent = async (contentInputStream, { extractionConfiguration, validationConfiguration }) => {
    return new Promise((resolve, reject) => {
      const data = []
      contentInputStream.on('data', chunk => {
        data.push(chunk)
      })

      contentInputStream.on('end', () => {
        try {
          const workBook = xslx.read(Buffer.concat(data), { type: 'buffer' })
          const response = {}
          if (extractionConfiguration) {
            Object.keys(extractionConfiguration).forEach(key => {
              response[key] = this.#extractData(workBook, extractionConfiguration[key])
            })
          }
          // Validate data matches a metric workbook format
          if (!isMetricWorkbook(workBook)) {
            throw new Error('Workbook is not a valid metric')
          }

          if (validationConfiguration) {
            response.validation = {}
            Object.keys(validationConfiguration).forEach(key => {
              response.validation[key] = this.#validateData(workBook, validationConfiguration[key])
            })
          }
          resolve(response)
        } catch (err) {
          reject(err)
        }
      })

      contentInputStream.on('error', err => {
        reject(err)
      })
    })
  }

  #extractData = (workbook, extractionConfiguration) => {
    const worksheet = workbook.Sheets[extractionConfiguration.sheetName]
    if (!worksheet) {
      return null
    } else {
      const sheetTitle =
      extractionConfiguration.titleCellAddress === undefined
        ? extractionConfiguration.sheetName
        : worksheet[extractionConfiguration.titleCellAddress].v
      if (extractionConfiguration.endCell) {
        worksheet['!ref'] = `${extractionConfiguration.startCell}:${extractionConfiguration.endCell}` // Update sheet range
      } else {
        worksheet['!ref'] = `${extractionConfiguration.startCell}:${worksheet['!ref'].split(':')[1]}`
      }
      let data = xslx.utils.sheet_to_json(worksheet, { blankrows: false })

      if (sheetTitle === 'Project details') {
        const resultData = {}
        data.map(item => {
          resultData[_.camelCase(item[Object.keys(item)[0]].toString().replace(':', ''))] =
          item[Object.keys(item)[1]]
          return item
        })
        data = resultData
      } else {
        data = data.reduce((newData, item) => {
          // #1 Checking each row's to verify if all coliumn has valid values
          const hasValidValuesInRow = Object.keys(item).some(key => key !== 'a' && !_.isEmpty(item[key]))

          // #2 Preparing obejct on the basis of 'extractionConfiguration'
          if (hasValidValuesInRow) {
            item = this.#prepareDataItems(item, extractionConfiguration)
            newData.push(item)
          }
          return newData
        }, [])
        // #3 Removing unwanted rows based on the config - rowsToBeRemovedTemplate
        data = this.#removeUnwantedRows(data, extractionConfiguration)
        data.sheetTitle = sheetTitle
      }

      return data
    }
  }

  #prepareDataItems = (item, extractionConfiguration) => {
    const { columnsToBeRemoved, cellHeaders, substitutions } = extractionConfiguration
    const itemKeys = Object.keys(item)

    // #2.1 Column's name substitution
    for (const substitutionKey in substitutions) {
      const substituteValue = item[substitutionKey]
      if (typeof substituteValue !== 'undefined') {
        const newKey = substitutions[substitutionKey]
        item[newKey] = substituteValue
      }
    }

    // #2.2 Checking if all requested columns in configs are there
    itemKeys.forEach(key => {
      if (!cellHeaders.includes(key) || columnsToBeRemoved.includes(key)) {
        delete item[key]
      }
    })

    return item
  }

  #removeUnwantedRows = (data, extractionConfiguration) => {
    const { rowsToBeRemovedTemplate } = extractionConfiguration

    rowsToBeRemovedTemplate?.forEach(rowTemplate => {
      data = data.filter(row => {
        const keys = Object.keys(row)
        return !(keys.length === rowTemplate.length && keys.every(key => rowTemplate.includes(key)))
      })
    })

    return data
  }

  #validateData = (workbook, validationConfiguration) => validationConfiguration(workbook)
}

export default BngMetricSingleDataExtractor
