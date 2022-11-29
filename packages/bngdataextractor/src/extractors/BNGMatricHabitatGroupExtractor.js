import xslx from 'xlsx'

class BNGMatricHabitatGroupExtractor {
  extractHabitatGroup = (workBook, extractionConfiguration) => this.#extractData(workBook, extractionConfiguration)

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
        worksheet['!ref'] = `${extractionConfiguration.startCells[index]}':'${worksheet['!ref'].split(':')[1]}`
      }
      const data = xslx.utils.sheet_to_json(worksheet, { blankrows: false })
      multiTableSheet = this.#getAllHabitatsData(data, multiTableSheet, title, extractionConfiguration)
      return title
    })

    return multiTableSheet
  }

  #getAllHabitatsData = (data, multiTableSheet, extractionPage, extractionConfiguration) => {
    const riversStreamsTitle = 'Rivers and Streams'
    if (extractionPage === 'A1') {
      multiTableSheet.allHabitatData.title = 'All Habitats'
      let allHabitatData = data.slice(0, data.findIndex(object => object['1'] === 'Hedgerows and lines of trees'))
      allHabitatData = this.#performSubstitution([].concat.apply([], allHabitatData), extractionConfiguration.substitutions[extractionPage])
      allHabitatData = this.#removeUnwantedColumns([].concat.apply([], allHabitatData), extractionConfiguration, extractionPage)
      multiTableSheet.allHabitatData.data = allHabitatData

      multiTableSheet.hedgeGrowAndTrees.title = 'Hedgerows and lines of trees'
      let hedgeGrowAndTrees = data.slice(multiTableSheet.allHabitatData.data.length + 1, data.findIndex(object => object['1'] === riversStreamsTitle))
      hedgeGrowAndTrees = this.#performSubstitution([].concat.apply([], hedgeGrowAndTrees), extractionConfiguration.substitutions[extractionPage])
      hedgeGrowAndTrees = this.#removeUnwantedColumns([].concat.apply([], hedgeGrowAndTrees), extractionConfiguration, extractionPage)
      multiTableSheet.hedgeGrowAndTrees.data = hedgeGrowAndTrees

      multiTableSheet.riversAndStreams.title = riversStreamsTitle
      let riversAndStreams = data.slice(data.findIndex(object => object['1'] === multiTableSheet.riversAndStreams.title) + 1, data.length)
      riversAndStreams = this.#performSubstitution([].concat.apply([], riversAndStreams), extractionConfiguration.substitutions[extractionPage])
      riversAndStreams = this.#removeUnwantedColumns([].concat.apply([], riversAndStreams), extractionConfiguration, extractionPage)
      multiTableSheet.riversAndStreams.data = riversAndStreams
    }
    if (extractionPage === 'AJ1') {
      multiTableSheet.groupSubTotals.title = 'Group Sub-totals'
      let groupSubTotals = data
      groupSubTotals = this.#performSubstitution([].concat.apply([], groupSubTotals), extractionConfiguration.substitutions[extractionPage])
      groupSubTotals = this.#removeUnwantedColumns([].concat.apply([], groupSubTotals), extractionConfiguration, extractionPage)
      multiTableSheet.groupSubTotals.data = groupSubTotals
    }
    if (extractionPage === 'AU1') {
      const habitatGrp = 'Habitat Group'
      multiTableSheet.distinctiveBandVeryHigh.title = 'Very High'
      let distinctiveBandVeryHigh = data.slice(0, data.findIndex(object => object[habitatGrp] === 'High'))
      distinctiveBandVeryHigh = this.#performSubstitution([].concat.apply([], distinctiveBandVeryHigh), extractionConfiguration.substitutions[extractionPage])
      distinctiveBandVeryHigh = this.#removeUnwantedColumns([].concat.apply([], distinctiveBandVeryHigh), extractionConfiguration, extractionPage)
      multiTableSheet.distinctiveBandVeryHigh.data = distinctiveBandVeryHigh

      multiTableSheet.distinctiveBandHigh.title = 'High'
      let distinctiveBandHigh = data.slice(data.findIndex(object => object[habitatGrp] === 'High') + 1, data.findIndex(object => object[habitatGrp] === 'Medium'))
      distinctiveBandHigh = this.#performSubstitution([].concat.apply([], distinctiveBandHigh), extractionConfiguration.substitutions[extractionPage])
      distinctiveBandHigh = this.#removeUnwantedColumns([].concat.apply([], distinctiveBandHigh), extractionConfiguration, extractionPage)
      multiTableSheet.distinctiveBandHigh.data = distinctiveBandHigh

      multiTableSheet.distinctiveBandMedium.title = 'Medium'
      let distinctiveBandMedium = data.slice(data.findIndex(object => object[habitatGrp] === 'Medium') + 1, data.findIndex(object => object[habitatGrp] === 'Low'))
      distinctiveBandMedium = this.#performSubstitution([].concat.apply([], distinctiveBandMedium), extractionConfiguration.substitutions[extractionPage])
      distinctiveBandMedium = this.#removeUnwantedColumns([].concat.apply([], distinctiveBandMedium), extractionConfiguration, extractionPage)
      multiTableSheet.distinctiveBandMedium.data = distinctiveBandMedium

      multiTableSheet.distinctiveBandLow.title = 'Low'
      let distinctiveBandLow = data.slice(data.findIndex(object => object[habitatGrp] === 'Low') + 1, data.findIndex(object => object[habitatGrp] === 'Very Low'))
      distinctiveBandLow = this.#performSubstitution([].concat.apply([], distinctiveBandLow), extractionConfiguration.substitutions[extractionPage])
      distinctiveBandLow = this.#removeUnwantedColumns([].concat.apply([], distinctiveBandLow), extractionConfiguration, extractionPage)
      multiTableSheet.distinctiveBandLow.data = distinctiveBandLow

      multiTableSheet.distinctiveBandVeryLow.title = 'Very Low'
      let distinctiveBandVeryLow = data.slice(data.findIndex(object => object[habitatGrp] === 'Very Low') + 1, data.length)
      distinctiveBandVeryLow = this.#performSubstitution([].concat.apply([], distinctiveBandVeryLow), extractionConfiguration.substitutions[extractionPage])
      distinctiveBandVeryLow = this.#removeUnwantedColumns([].concat.apply([], distinctiveBandVeryLow), extractionConfiguration, extractionPage)
      multiTableSheet.distinctiveBandVeryLow.data = distinctiveBandVeryLow
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
        if (!extractionConfiguration.cellHeaders[extractionPage].includes(key) && row[key] !== undefined) {
          delete row[key]
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
