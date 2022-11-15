import xslx from 'xlsx'

class BNGMatricHabitatGroupExtractor {
  extractHabitatGroup = (workBook, extractionConfiguration) => {
    return this.#extractData(workBook, extractionConfiguration)
  }

  #extractData = (workbook, extractionConfiguration) => {
    const worksheet = workbook.Sheets[extractionConfiguration.sheetName]
    let multiTableSheet = {
      allHabitatData: {
        title: '',
        data: []
      },
      hedgeGrowAndTrees: {
        title: '',
        data: []
      },
      riversAndStreams: {
        title: '',
        data: []
      },
      groupSubTotals: {
        title: '',
        data: []
      },
      distinctiveBandVeryHigh: {
        title: '',
        data: []
      },
      distinctiveBandHigh: {
        title: '',
        data: []
      },
      distinctiveBandMedium: {
        title: '',
        data: []
      },
      distinctiveBandLow: {
        title: '',
        data: []
      },
      distinctiveBandVeryLow: {
        title: '',
        data: []
      }
    }

    extractionConfiguration.titleCellAddress.map((title, index) => {
      if (extractionConfiguration.endCells !== undefined) {
        worksheet['!ref'] = extractionConfiguration.startCells[index] + ':AG141'
      } else {
        worksheet['!ref'] = extractionConfiguration.startCells[index] + ':' + worksheet['!ref'].split(':')[1]
      }
      const data = xslx.utils.sheet_to_json(worksheet, { blankrows: false })
      multiTableSheet = this.#getAllHabitatsData(data, multiTableSheet, title, extractionConfiguration)
      return title
    })

    return multiTableSheet
  }

  #getAllHabitatsData = (data, multiTableSheet, extractionPage, extractionConfiguration) => {
    if (extractionPage === 'A1') {
      multiTableSheet.allHabitatData.title = 'All Habitats'
      multiTableSheet.allHabitatData.data = data.slice(0, data.findIndex(object => object['1'] === 'Hedgerows and lines of trees'))
      multiTableSheet.allHabitatData.data = this.#performSubstitution([].concat.apply([], multiTableSheet.allHabitatData.data), extractionConfiguration.substitutions[extractionPage])
      multiTableSheet.allHabitatData.data = this.#removeUnwantedColumns([].concat.apply([], multiTableSheet.allHabitatData.data), extractionConfiguration, extractionPage)

      multiTableSheet.hedgeGrowAndTrees.title = 'Hedgerows and lines of trees'
      multiTableSheet.hedgeGrowAndTrees.data = data.slice(multiTableSheet.allHabitatData.data.length + 1, data.findIndex(object => object['1'] === 'Rivers and Streams'))
      multiTableSheet.hedgeGrowAndTrees.data = this.#performSubstitution([].concat.apply([], multiTableSheet.hedgeGrowAndTrees.data), extractionConfiguration.substitutions[extractionPage])
      multiTableSheet.hedgeGrowAndTrees.data = this.#removeUnwantedColumns([].concat.apply([], multiTableSheet.hedgeGrowAndTrees.data), extractionConfiguration, extractionPage)

      multiTableSheet.riversAndStreams.data.title = 'Rivers and Streams'
      multiTableSheet.riversAndStreams.data = data.slice(data.findIndex(object => object['1'] === 'Rivers and Streams') + 1, data.length)
      multiTableSheet.riversAndStreams.data = this.#performSubstitution([].concat.apply([], multiTableSheet.riversAndStreams.data), extractionConfiguration.substitutions[extractionPage])
      multiTableSheet.riversAndStreams.data = this.#removeUnwantedColumns([].concat.apply([], multiTableSheet.riversAndStreams.data), extractionConfiguration, extractionPage)
    }
    if (extractionPage === 'AJ1') {
      multiTableSheet.groupSubTotals.title = 'Group Sub-totals'
      multiTableSheet.groupSubTotals.data = data
      multiTableSheet.groupSubTotals.data = this.#performSubstitution([].concat.apply([], multiTableSheet.groupSubTotals.data), extractionConfiguration.substitutions[extractionPage])
      multiTableSheet.groupSubTotals.data = this.#removeUnwantedColumns([].concat.apply([], multiTableSheet.groupSubTotals.data), extractionConfiguration, extractionPage)
    }
    if (extractionPage === 'AU1') {
      multiTableSheet.distinctiveBandVeryHigh.title = 'Very High'
      multiTableSheet.distinctiveBandVeryHigh.data = data.slice(0, data.findIndex(object => object['Habitat Group'] === 'High'))
      multiTableSheet.distinctiveBandVeryHigh.data = this.#performSubstitution([].concat.apply([], multiTableSheet.distinctiveBandVeryHigh.data), extractionConfiguration.substitutions[extractionPage])
      multiTableSheet.distinctiveBandVeryHigh.data = this.#removeUnwantedColumns([].concat.apply([], multiTableSheet.distinctiveBandVeryHigh.data), extractionConfiguration, extractionPage)

      multiTableSheet.distinctiveBandHigh.title = 'High'
      multiTableSheet.distinctiveBandHigh.data = data.slice(data.findIndex(object => object['Habitat Group'] === 'High') + 1, data.findIndex(object => object['Habitat Group'] === 'Medium'))
      multiTableSheet.distinctiveBandHigh.data = this.#performSubstitution([].concat.apply([], multiTableSheet.distinctiveBandHigh.data), extractionConfiguration.substitutions[extractionPage])
      multiTableSheet.distinctiveBandHigh.data = this.#removeUnwantedColumns([].concat.apply([], multiTableSheet.distinctiveBandHigh.data), extractionConfiguration, extractionPage)

      multiTableSheet.distinctiveBandMedium.title = 'Medium'
      multiTableSheet.distinctiveBandMedium.data = data.slice(data.findIndex(object => object['Habitat Group'] === 'Medium') + 1, data.findIndex(object => object['Habitat Group'] === 'Low'))
      multiTableSheet.distinctiveBandMedium.data = this.#performSubstitution([].concat.apply([], multiTableSheet.distinctiveBandMedium.data), extractionConfiguration.substitutions[extractionPage])
      multiTableSheet.distinctiveBandMedium.data = this.#removeUnwantedColumns([].concat.apply([], multiTableSheet.distinctiveBandMedium.data), extractionConfiguration, extractionPage)

      multiTableSheet.distinctiveBandLow.title = 'Low'
      multiTableSheet.distinctiveBandLow.data = data.slice(data.findIndex(object => object['Habitat Group'] === 'Low') + 1, data.findIndex(object => object['Habitat Group'] === 'Very Low'))
      multiTableSheet.distinctiveBandLow.data = this.#performSubstitution([].concat.apply([], multiTableSheet.distinctiveBandLow.data), extractionConfiguration.substitutions[extractionPage])
      multiTableSheet.distinctiveBandLow.data = this.#removeUnwantedColumns([].concat.apply([], multiTableSheet.distinctiveBandLow.data), extractionConfiguration, extractionPage)

      multiTableSheet.distinctiveBandVeryLow.title = 'Very Low'
      multiTableSheet.distinctiveBandVeryLow.data = data.slice(data.findIndex(object => object['Habitat Group'] === 'Very Low') + 1, data.length)
      multiTableSheet.distinctiveBandVeryLow.data = this.#performSubstitution([].concat.apply([], multiTableSheet.distinctiveBandVeryLow.data), extractionConfiguration.substitutions[extractionPage])
      multiTableSheet.distinctiveBandVeryLow.data = this.#removeUnwantedColumns([].concat.apply([], multiTableSheet.distinctiveBandVeryLow.data), extractionConfiguration, extractionPage)
    }
    return multiTableSheet
  }

  #performSubstitution = (data, substitutionFields) => {
    data = data.map(content => {
      Object.keys(substitutionFields).forEach(substitutionKey => {
        const substituteValue = content[substitutionKey]
        if (substituteValue !== undefined) {
          Object.defineProperty(content, substitutionFields[substitutionKey],
            Object.getOwnPropertyDescriptor(content, substitutionKey))
          delete content[substitutionKey]
        }
      })
      return content
    })

    return data
  }

  #removeUnwantedColumns = (data, extractionConfiguration, extractionPage) => {
    data.forEach(row => {
      extractionConfiguration.columnsToBeRemoved[extractionPage].forEach(column => {
        if (row[column] !== undefined) {
          delete row[column]
        }
      })

      Object.keys(row).forEach(key => {
        if (!extractionConfiguration.cellHeaders[extractionPage].includes(key)) {
          if (row[key] !== undefined) {
            delete row[key]
          }
        }
      })
    })

    data = data.map(content => {
      delete content.Ref
      return content
    }).filter(content => Object.values(content).some(value => (value !== null && value !== '')))

    return data
  }
}

export default BNGMatricHabitatGroupExtractor
