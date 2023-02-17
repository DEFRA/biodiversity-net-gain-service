const lengthKm = 'Length (km)'
const proposedHabitat = 'Proposed habitat'
const habitatType = 'Habitat type'

const defaults = {
  habitat: {
    type: 'Habitat',
    unitKey: 'Area (hectares)',
    unit: 'Area (ha)',
    header: 'Broad habitat',
    description: habitatType
  },
  hedgerow: {
    type: 'Hedgerow',
    unitKey: lengthKm,
    unit: lengthKm,
    description: 'Hedgerow type'
  },
  river: {
    type: 'River',
    unitKey: lengthKm,
    unit: lengthKm,
    description: 'River type'
  }
}

const habitatTypeMap = {
  d1: defaults.habitat,
  d2: {
    ...defaults.habitat,
    description: proposedHabitat
  },
  d3: {
    ...defaults.habitat,
    header: 'Proposed Broad Habitat',
    description: proposedHabitat
  },
  e1: defaults.hedgerow,
  e2: {
    ...defaults.hedgerow,
    description: habitatType
  },
  e3: {
    ...defaults.hedgerow,
    description: proposedHabitat
  },
  f1: defaults.river,
  f2: defaults.river,
  f3: {
    ...defaults.river,
    description: proposedHabitat
  }
}

export default habitatTypeMap
