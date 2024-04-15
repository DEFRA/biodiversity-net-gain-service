import combinedCaseConstants from './constants.js'

let habitatReferenceCounter = 0

const generateHabitatReference = () => `HAB-00000000-${habitatReferenceCounter++}`

const generateGainSiteNumber = () => 'BGS-123456789'

const processMetricData = session => {
  const registrationMetricData = session.get(combinedCaseConstants.redisKeys.COMBINED_CASE_REGISTRATION_METRIC_DATA)
  const allocationMetricData = session.get(combinedCaseConstants.redisKeys.COMBINED_CASE_ALLOCATION_METRIC_DATA)
  const registrationHabitats = []
  const allocationHabitats = []
  const sheets = ['d2', 'd3', 'e2', 'e3', 'f2', 'f3']

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

  const extractHabitats = (metricData, habitats, isAllocation) => {
    sheets.forEach(sheet => {
      metricData[sheet].forEach(habitat => {
        const habitatType = getHabitatType(sheet, habitat)
        const condition = habitat.Condition

        if (habitatType && condition) {
          habitats.push({
            habitatType,
            condition,
            id: isAllocation ? generateHabitatReference() : 'qqq',
            size: habitat['Length (km)'] ?? habitat['Area (hectares)'],
            measurementUnits: 'Length (km)' in habitat ? 'kilometres' : 'hectares',
            processed: false
          })
        }
      })
    })
  }

  extractHabitats(registrationMetricData, registrationHabitats, false)
  extractHabitats(allocationMetricData, allocationHabitats, true)

  session.set(combinedCaseConstants.redisKeys.COMBINED_CASE_REGISTRATION_HABITATS, registrationHabitats)
  session.set(combinedCaseConstants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS, allocationHabitats)
}

export {
  generateHabitatReference,
  generateGainSiteNumber,
  processMetricData
}
