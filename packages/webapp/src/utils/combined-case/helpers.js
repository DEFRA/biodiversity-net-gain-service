import constants from '../constants.js'
import crypto from 'crypto'

const randomString = (length, chars) => {
  let result = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, chars.length)
    result += chars[randomIndex]
  }
  return result
}

const randomIntegerString = length => randomString(length, '0123456789')
const randomCharString = length => randomString(length, 'ABCDEFGHJKMNPRTUVWXY')
const generateHabitatReference = () => `HAB-${randomIntegerString(8)}-P${randomCharString(4)}`

let ownReferenceCounter = 0
const generateOwnReference = () => `${ownReferenceCounter++}`

const getHabitatType = (identifier, details) => {
  switch (identifier) {
    case 'd2':
      if (details['Broad habitat'] && details['Proposed habitat']) {
        return `${details['Broad habitat']} - ${details['Proposed habitat']}`
      }
      return undefined
    case 'd3':
      if (details['Proposed Broad Habitat'] && details['Proposed habitat']) {
        return `${details['Proposed Broad Habitat']} - ${details['Proposed habitat']}`
      }
      return undefined
    case 'e2':
      return details['Habitat type']
    case 'e3':
      return details['Proposed habitat']
    case 'f2':
      return details['Watercourse type']
    case 'f3':
      return details['Proposed habitat']
  }
}

const getState = identifier => {
  switch (identifier.charAt(0)) {
    case 'd':
      return 'Habitat'
    case 'e':
      return 'Hedge'
    case 'f':
      return 'Watercourse'
  }
}

const getModule = identifier => {
  switch (identifier.charAt(identifier.length - 1)) {
    case '1':
      return 'Baseline'
    case '2':
      return 'Created'
    case '3':
      return 'Enhanced'
  }
}

const processMetricData = session => {
  const registrationMetricData = session.get(constants.redisKeys.METRIC_DATA)
  const allocationMetricData = session.get(constants.redisKeys.DEVELOPER_METRIC_DATA)
  const registrationHabitats = []
  const allocationHabitats = []
  const sheets = ['d2', 'd3', 'e2', 'e3', 'f2', 'f3']

  const extractHabitats = (metricData, habitats, isAllocation) => {
    sheets.forEach(sheet => {
      if (metricData[sheet]) {
        metricData[sheet].forEach(habitat => {
          const habitatType = getHabitatType(sheet, habitat)
          const condition = habitat.Condition
          const habitatUnitsDelivered = habitat['Habitat units delivered'] ?? habitat['Hedge units delivered'] ?? habitat['Watercourse units delivered']

          if (habitatType && condition) {
            habitat.generatedId = isAllocation ? generateOwnReference() : generateHabitatReference()

            habitats.push({
              habitatType,
              condition,
              sheet,
              module: getModule(sheet),
              state: getState(sheet),
              id: habitat.generatedId,
              size: habitat['Length (km)'] ?? habitat['Area (hectares)'],
              measurementUnits: 'Length (km)' in habitat ? 'kilometres' : 'hectares',
              habitatUnitsDelivered,
              rowNum: habitat?.rowNum,
              offsiteReference: habitat['Off-site reference'] ? String(habitat['Off-site reference']) : '',
              processed: false
            })
          }
        })
      }
    })
  }

  extractHabitats(registrationMetricData, registrationHabitats, false)
  extractHabitats(allocationMetricData, allocationHabitats, true)

  session.set(constants.redisKeys.COMBINED_CASE_REGISTRATION_HABITATS, registrationHabitats)
  session.set(constants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS, allocationHabitats)
}

const habitatDescription = habitat =>
  `${habitat.habitatType} || ${habitat.condition} || ${habitat.size} ${habitat.measurementUnits} || ${habitat.module} || ${habitat.state}`

const habitatHint = (habitat, sheetName) =>
  `${habitat.size} ${habitat.measurementUnits} / ${habitat.condition} condition / ${sheetName} sheet (row ${habitat.rowNum})`

const getMatchingHabitats = (habitat, habitatList) => habitatList.filter(h =>
  h.state === habitat.state &&
  h.module === habitat.module &&
  h.habitatType === habitat.habitatType &&
  h.condition === habitat.condition
)

const summariseHabitatMatches = (registrationHabitats, allocationHabitats) => {
  const matches = {}

  registrationHabitats.forEach(habitat => {
    const allocationHabitat = allocationHabitats.find(h => h.id === habitat.id)

    matches[habitat.id] = {
      registration: habitatDescription(habitat),
      allocation: allocationHabitat && habitatDescription(allocationHabitat)
    }
  })

  return matches
}

const displayUnitMap = {
  hectares: 'ha',
  kilometres: 'km'
}

const getMatchedHabitatsHtml = (habitats) => {
  habitats = habitats?.filter(h => h?.matchedHabitatId)

  if (!habitats) {
    return []
  }

  const habitatGroups = {
    habitat: [],
    hedgerow: [],
    watercourse: []
  }

  let totalHabitatUnits = 0
  let totalHedgeUnits = 0
  let totalWatercourseUnits = 0

  habitats.forEach(item => {
    if (item && Object.hasOwn(item, 'habitatUnitsDelivered')) {
      const habitatUnitsDelivered = isNaN(item.habitatUnitsDelivered) ? 0 : Number(item.habitatUnitsDelivered)

      if (item.state === 'Habitat') {
        habitatGroups.habitat.push(item)
        totalHabitatUnits += habitatUnitsDelivered
      } else if (item.state === 'Hedge') {
        habitatGroups.hedgerow.push(item)
        totalHedgeUnits += habitatUnitsDelivered
      } else if (item.state === 'Watercourse') {
        habitatGroups.watercourse.push(item)
        totalWatercourseUnits += habitatUnitsDelivered
      }
    }
  })

  const habitatDetails = []

  const addItemsWithTotal = (total, totalLabel, padFirstRow, items = []) => {
    if (total > 0) {
      const requiredProperties = ['habitatType', 'condition', 'size', 'measurementUnits', 'habitatUnitsDelivered']
      let itemsAdded = 0

      items.forEach((item, index) => {
        const baseRow = index === 0 && padFirstRow ? { classes: 'table-extra-padding' } : {}

        if (item && requiredProperties.every(prop => Object.hasOwn(item, prop))) {
          itemsAdded += 1
          const habitatUnits = item.habitatUnitsDelivered
          habitatDetails.push([
            { text: item.habitatType, ...baseRow },
            { html: item.condition.replace(/ /g, '&nbsp;'), ...baseRow },
            { html: `${item.size}&nbsp;${displayUnitMap[item.measurementUnits] ?? item.measurementUnits}`, ...baseRow },
            { html: `${isNaN(habitatUnits) ? '0.00' : Number(habitatUnits).toFixed(2)}&nbsp;units`, format: 'numeric', ...baseRow }
          ])
        }
      })

      if (itemsAdded > 0) {
        habitatDetails.push([
          { text: totalLabel, colspan: 3, classes: 'table-heavy-border' },
          { html: `${total.toFixed(2)}&nbsp;units`, classes: 'table-heavy-border', format: 'numeric' }
        ])
      }
    }
  }

  addItemsWithTotal(totalHabitatUnits, 'Total habitat units', false, habitatGroups.habitat)
  addItemsWithTotal(totalHedgeUnits, 'Total hedgerow units', true, habitatGroups.hedgerow)
  addItemsWithTotal(totalWatercourseUnits, 'Total watercourse units', true, habitatGroups.watercourse)

  return habitatDetails
}

export {
  generateOwnReference,
  generateHabitatReference,
  processMetricData,
  habitatDescription,
  getMatchingHabitats,
  summariseHabitatMatches,
  habitatHint,
  getHabitatType,
  getState,
  getModule,
  getMatchedHabitatsHtml
}
