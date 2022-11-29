import xslx from 'xlsx'
import BNGMatricHabitatGroupExtractor from './bng-habitatgroup-extractor.js'

class BNGMetrixSingleDataExtracrtor {
  #habitatGroupExtractor = undefined
  constructor () {
    this.#habitatGroupExtractor = new BNGMatricHabitatGroupExtractor()
  }

  extractContent = async (contentInputStream, extractionConfiguration) => {
    return new Promise((resolve, reject) => {
      const data = []
      contentInputStream.on('data', (chunk) => {
        data.push(chunk)
      })

      contentInputStream.on('end', () => {
        const workBook = xslx.read(Buffer.concat(data), { type: 'buffer' })
        const response = {}
        Object.keys(extractionConfiguration).forEach(key => {
          if (key !== 'habitatGroup') {
            response[key] = this.#extractData(workBook, extractionConfiguration[key])
          } else {
            response[key] = this.#habitatGroupExtractor.extractHabitatGroup(workBook, extractionConfiguration[key])
          }
        })
        resolve(response)
      })

      contentInputStream.on('error', (err) => {
        reject(err)
      })
    })
  }

  #extractData = (workbook, extractionConfiguration) => {
    const worksheet = workbook.Sheets[extractionConfiguration.sheetName]
    const sheetTitle =
      extractionConfiguration.titleCellAddress === undefined
        ? extractionConfiguration.sheetName
        : worksheet[extractionConfiguration.titleCellAddress].v
    if (extractionConfiguration.endCell !== undefined) {
      worksheet['!ref'] =
        extractionConfiguration.startCell +
        ':' +
        extractionConfiguration.endCell // Update sheet range
    } else {
      worksheet['!ref'] =
        extractionConfiguration.startCell +
        ':' +
        worksheet['!ref'].split(':')[1]
    }
    let data = xslx.utils.sheet_to_json(worksheet, { blankrows: false })
    if (sheetTitle === 'Project details') {
      const resultData = {}
      data.map((item) => {
        resultData[item[Object.keys(item)[0]].replace(':', '')] =
          item[Object.keys(item)[1]]
        return item
      })
      data = resultData
    } else if (sheetTitle === 'Headline Results') {
      data = this.#getHeadlineResultData(data, extractionConfiguration)
    } else {
      data = this.#performSubstitution(data, extractionConfiguration)
      data = this.#removeUnwantedColumns(data, extractionConfiguration)
      data.sheetTitle = sheetTitle
    }
    return data
  }

  #performSubstitution = (data, extractionConfiguration) => {
    if (extractionConfiguration.substitutions !== undefined) {
      data = data.map((content) => {
        Object.keys(extractionConfiguration.substitutions).forEach(
          (substitutionKey) => {
            const substituteValue = content[substitutionKey]
            if (substituteValue !== undefined) {
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
    data.forEach((row) => {
      extractionConfiguration.columnsToBeRemoved.forEach((column) => {
        if (row[column] !== undefined) {
          delete row[column]
        }
      })

      Object.keys(row).forEach((key) => {
        if (!extractionConfiguration.cellHeaders.includes(key) && row[key] !== undefined) {
          delete row[key]
        }
      })
    })

    data = data
      .map((content) => {
        delete content.Ref
        return content
      })
      .filter((content) =>
        Object.values(content).some((value) => value !== null && value !== '')
      )
    // .filter(row => Object.keys(row).length == extractionConfiguration.cellHeaders.length);

    return data
  }

  #getHeadlineResultData = (data, extractionConfiguration) => {
    let tmpObj = {}
    const finalData = []
    const chunkedArray = []
    const chunkSize = 3
    for (let i = 0; i < data.length; i += chunkSize) {
      chunkedArray.push(data.slice(i, i + chunkSize))
    }

    chunkedArray.map((items, i) => {
      const obj = {}
      items.map(item => {
        Object.keys(extractionConfiguration.substitutions).forEach(
          (substitutionKey) => {
            const substituteValue = item[substitutionKey]
            if (substituteValue !== undefined) {
              Object.defineProperty(
                item,
                extractionConfiguration.substitutions[substitutionKey],
                Object.getOwnPropertyDescriptor(item, substitutionKey)
              )
              delete item[substitutionKey]
            }
          }
        )

        if (Object.hasOwnProperty.call(item, 'task')) {
          obj.task = item.task.split('\r\n')[0]
          obj.subtask = item.task.split('\r\n')[1] || ''
        }
        obj[item.unit] = item.value
        tmpObj = Object.assign({}, obj)
        return item
      })
      finalData.push(tmpObj)
      return items
    })
    return finalData
  }
}

export default BNGMetrixSingleDataExtracrtor
