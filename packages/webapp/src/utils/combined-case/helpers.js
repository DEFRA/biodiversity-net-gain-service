import constants from '../constants.js'

let habitatReferenceCounter = 0
let ownReferenceCounter = 0

const generateHabitatReference = () => `HAB-00000000-${habitatReferenceCounter++}`

const generateOwnReference = () => `${ownReferenceCounter++}`

const generateGainSiteNumber = () => 'BGS-123456789'

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

          if (habitatType && condition) {
            habitats.push({
              habitatType,
              condition,
              sheet,
              module: getModule(sheet),
              state: getState(sheet),
              id: isAllocation ? generateOwnReference() : generateHabitatReference(),
              size: habitat['Length (km)'] ?? habitat['Area (hectares)'],
              measurementUnits: 'Length (km)' in habitat ? 'kilometres' : 'hectares',
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

const habitatHint = habitat =>
  `${habitat.size} ${habitat.measurementUnits} / ${habitat.condition} condition`

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

export {
  generateOwnReference,
  generateHabitatReference,
  generateGainSiteNumber,
  processMetricData,
  habitatDescription,
  getMatchingHabitats,
  summariseHabitatMatches,
  habitatHint,
  getHabitatType,
  getState,
  getModule
}
