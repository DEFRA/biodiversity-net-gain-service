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
      let data = xslx.utils.sheet_to_json(worksheet, { blankrows: false, skipHidden: true })
      const newData = []

      if (sheetTitle === 'Project details') {
        const resultData = {}
        data.map(item => {
          resultData[_.camelCase(item[Object.keys(item)[0]].toString().replace(':', ''))] =
          item[Object.keys(item)[1]]
          return item
        })
        data = resultData
      } else {
        let dataKey = 0
        for (const item of data) {
          // #1 Checking each row's to verify if all coliumn has valid values
          let isValidRow = false
          for (const key in item) {
            // Data was extracted even if all rows have null values due to 'Baseline ref'
            // So excluding this column will remove such blank rows.
            const val = item[key]
            if (key !== 'Baseline ref') {
              if (typeof val === 'string' && val.trim().length !== 0) {
                isValidRow = true
                break
              } else if (val && typeof val !== 'string' && typeof val !== 'undefined') {
                isValidRow = true
                break
              }
            }
          }

          // #2 Preparing obejct on the basis of 'extractionConfiguration'
          if (isValidRow) {
            const { columnsToBeRemoved, cellHeaders, substitutions, rowsToBeRemovedTemplate } = extractionConfiguration
            // #2.1 Column's name substitution
            for (const substitutionKey in substitutions) {
              const substituteValue = item[substitutionKey]
              if (typeof substituteValue !== 'undefined') {
                const newKey = substitutions[substitutionKey]
                item[newKey] = substituteValue
              }
            }

            // #2.2 Checking if all requested columns in configs are there
            const itemKeys = Object.keys(item)
            itemKeys.forEach(key => {
              if (!cellHeaders.includes(key) || columnsToBeRemoved.includes(key)) {
                delete item[key]
              }
            })

            // #2.3 Removing unwanted rows based on the config - rowsToBeRemovedTemplate
            rowsToBeRemovedTemplate?.forEach(rowTemplate => {
              if (itemKeys.length === rowTemplate.length && itemKeys.every(key => rowTemplate.includes(key))) {
                data.splice(dataKey, 1)
              }
            })

            newData.push(item)
          }
          dataKey++
        }
        data = newData
        data.sheetTitle = sheetTitle
      }

      return data
    }
  }

  #validateData = (workbook, validationConfiguration) => validationConfiguration(workbook)
}

export default BngMetricSingleDataExtractor
