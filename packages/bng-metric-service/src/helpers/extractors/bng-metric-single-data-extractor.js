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
      const sheetTitle = worksheet[extractionConfiguration.titleCellAddress]?.v || extractionConfiguration.sheetName
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
        data.forEach(item => (item.rowNum = (item.__rowNum__ + 1)))
        data = this.#performSubstitution(data, extractionConfiguration)
        data = this.#removeUnwantedColumns(data, extractionConfiguration)
        data = this.#removeUnwantedRows(data, extractionConfiguration)
        data.sheetTitle = sheetTitle
      }

      // If configuration has cells array then pull out the specific cells
      if (extractionConfiguration.cells?.length > 0) {
        data.cells = {}
        extractionConfiguration.cells.forEach(item => {
          data.cells[item.name || item.cell] = worksheet[item.cell]?.v
        })
      }

      return data
    }
  }

  #performSubstitution = (data, extractionConfiguration) => {
    if (extractionConfiguration.substitutions) {
      data = data.map(content => {
        Object.keys(extractionConfiguration.substitutions).forEach(
          substitutionKey => {
            const substituteValue = content[substitutionKey]
            if (typeof substituteValue !== 'undefined') {
              Object.defineProperty(
                content,
                extractionConfiguration.substitutions[substitutionKey],
                Object.getOwnPropertyDescriptor(content, substitutionKey)
              )
              delete content[substitutionKey]
            }
          }
        )

        return content
      })
    }

    return data
  }

  #removeUnwantedColumns = (data, extractionConfiguration) => {
    const { columnsToBeRemoved, cellHeaders } = extractionConfiguration
    const cellHeadersCopy = structuredClone(cellHeaders)
    cellHeadersCopy.push('rowNum')

    data.forEach(row => {
      columnsToBeRemoved.forEach(column => {
        if (row[column]) {
          delete row[column]
        }
      })

      // Checking if all requested columns in configs are there
      Object.keys(row).forEach(key => {
        if (!cellHeadersCopy.includes(key)) {
          delete row[key]
        }
      })
    })

    data = data.filter(content => Object.entries(content).some(
      ([key, value]) => value !== null && value !== '' && key !== 'rowNum')
    )

    return data
  }

  #removeUnwantedRows = (data, extractionConfiguration) => {
    const { rowsToBeRemovedTemplate } = extractionConfiguration

    rowsToBeRemovedTemplate?.forEach(rowTemplate => {
      const rowTemplateToRemove = ['rowNum', ...rowTemplate]

      data = data.filter(row => {
        const keys = Object.keys(row)
        return !(keys.length === rowTemplateToRemove.length && keys.every(key => rowTemplateToRemove.includes(key)))
      })
    })

    return data
  }

  #validateData = (workbook, validationConfiguration) => validationConfiguration(workbook)
}

export default BngMetricSingleDataExtractor
