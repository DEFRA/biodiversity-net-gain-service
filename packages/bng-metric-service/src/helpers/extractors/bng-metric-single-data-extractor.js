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
          // console.log("==================RESP=========")
          // console.log(response)
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
      let data = xslx.utils.sheet_to_json(worksheet, { blankrows: false, skipHidden: true})
      // console.log('================== DATA ==================')
      // console.log(data)
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
          // #1 Checking row's values if all has valid
          let isValidRow = false
          for (const [key, val] of Object.entries(item)) {
            // As of now data extracting even if all rows has null values due to 'Baseline ref'
            // So excluding this column to remove such blank rows
            if (key !== 'Baseline ref') {
              if (typeof val === 'string' && val.trim().length !== 0) {
                isValidRow = true
                break
              } else if (val && typeof val !== 'string' && typeof val !== 'undefined'){
                isValidRow = true
                break
              }
            }
          }

          // #2 Preparing obejct on the basis of 'extractionConfiguration'
          if (isValidRow) {
            const { columnsToBeRemoved, cellHeaders, substitutions, rowsToBeRemovedTemplate } = extractionConfiguration
            // #2.1 Column's name substitution
            for (let substitutionKey in substitutions) {
              const substituteValue = item[substitutionKey]
              if (typeof substituteValue !== 'undefined') {
                const newKey = substitutions[substitutionKey]
                // console.log('substitution', substitutionKey, ':', substituteValue)
                // console.log('C', newKey)
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
              if(!(itemKeys.length === rowTemplate.length && itemKeys.every(key => rowTemplate.includes(key)))) {
                data.splice(dataKey, 1)
              }
            })

            dataKey++
            newData.push(item)
          }
        }
        // console.log(`==================AFTER FILTER DATA: ${sheetTitle} ==================`)
        // console.log(newData)
        newData.sheetTitle = sheetTitle
      }

      // If configuration has cells array then pull out the specific cells
      // if (extractionConfiguration.cells?.length > 0) {
      //   data.cells = {}
      //   extractionConfiguration.cells.forEach(item => {
      //     data.cells[item.name || item.cell] = worksheet[item.cell]?.v
      //   })
      // }

      return newData
    }
  }

  // #performSubstitution = (data, extractionConfiguration) => {
  //   const { substitutions } = extractionConfiguration
  //   if (substitutions) {
  //     data = data.map(content => {
  //       for (let substitutionKey in substitutions) {
  //         const substituteValue = content[substitutionKey]
  //         // if (typeof substituteValue !== 'undefined') {
  //           const newKey = substitutions[substitutionKey]
  //           console.log('substitution', substitutionKey, ':', substituteValue)
  //           console.log('C', newKey)
  //           content[newKey] = substituteValue
  //           delete content[substitutionKey]
  //         // }
  //         return content
  //       }
  //       // Object.keys(substitutions).forEach(
  //       //   substitutionKey => {
  //       //     const substituteValue = content[substitutionKey]
  //       //     if (typeof substituteValue !== 'undefined') {
  //       //       console.log('substitution', substitutionKey, ':', substituteValue)
  //       //       console.log('C', substitutions[substitutionKey])
  //       //       content[substitutions[substitutionKey]] = substituteValue
  //       //       delete content[substitutionKey]
  //       //       return content
  //       //       // Object.defineProperty(
  //       //       //   content,
  //       //       //   extractionConfiguration.substitutions[substitutionKey],
  //       //       //   Object.getOwnPropertyDescriptor(content, substitutionKey)
  //       //       // )
  //       //       // delete content[substitutionKey]
  //       //     }
  //       //   }
  //       // )

  //       return content
  //     })
  //   }

  //   return data
  // }

  // #removeUnwantedColumns = (data, extractionConfiguration) => {
  //   // const { columnsToBeRemoved, cellHeaders } = extractionConfiguration
  //   // data.forEach(row => {
  //   //   columnsToBeRemoved.forEach(column => {
  //   //     if (row[column]) {
  //   //       delete row[column]
  //   //     }
  //   //   })

  //   //   // Checking if all requested columns in configs are there
  //   //   Object.keys(row).forEach(key => {
  //   //     if (!cellHeaders.includes(key)) {
  //   //       delete row[key]
  //   //     }
  //   //   })
  //   // })

  //   data = data
  //     .map(content => {
  //       delete content.Ref
  //       return content
  //     })
  //     .filter(content =>
  //       Object.values(content).some(value => value !== null && value !== '')
  //     )

  //   return data
  // }

  // #removeUnwantedRows = (data, extractionConfiguration) => {
  //   const { rowsToBeRemovedTemplate } = extractionConfiguration

  //   rowsToBeRemovedTemplate?.forEach(rowTemplate => {
  //     data = data.filter(row => {
  //       const keys = Object.keys(row)
  //       return !(keys.length === rowTemplate.length && keys.every(key => rowTemplate.includes(key)))
  //     })
  //   })

  //   return data
  // }

  #validateData = (workbook, validationConfiguration) => validationConfiguration(workbook)
}

export default BngMetricSingleDataExtractor
