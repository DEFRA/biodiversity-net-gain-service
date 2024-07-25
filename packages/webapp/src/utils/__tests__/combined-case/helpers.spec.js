import {
  generateOwnReference,
  generateHabitatReference,
  generateGainSiteNumber,
  processMetricData,
  habitatDescription,
  getMatchingHabitats,
  summariseHabitatMatches
} from '../../combined-case/helpers.js'
import combinedCaseConstants from '../../combined-case-constants.js'

describe('Combined Case Habitat Match Utility Functions', () => {
  beforeEach(() => {
    global.habitatReferenceCounter = 0
    global.ownReferenceCounter = 0
  })

  test('generateHabitatReference increments correctly', () => {
    expect(generateHabitatReference()).toBe('HAB-00000000-0')
    expect(generateHabitatReference()).toBe('HAB-00000000-1')
    expect(generateHabitatReference()).toBe('HAB-00000000-2')
  })

  test('generateOwnReference increments correctly', () => {
    expect(generateOwnReference()).toBe('0')
    expect(generateOwnReference()).toBe('1')
    expect(generateOwnReference()).toBe('2')
  })

  test('generateGainSiteNumber returns correct format', () => {
    expect(generateGainSiteNumber()).toBe('BGS-123456789')
  })
})

describe('processMetricData', () => {
  let session

  beforeEach(() => {
    session = {
      get: jest.fn(),
      set: jest.fn()
    }
    session.get.mockImplementation((key) => {
      if (key === combinedCaseConstants.redisKeys.COMBINED_CASE_REGISTRATION_METRIC_DATA) {
        return {
          d2: [{ 'Broad habitat': 'Forest', 'Proposed habitat': 'Woodland', Condition: 'Good', 'Area (hectares)': 10 }],
          d3: [{ 'Proposed Broad Habitat': 'Grassland', 'Proposed habitat': 'Meadow', Condition: 'Fair', 'Length (km)': 5 }]
        }
      } else if (key === combinedCaseConstants.redisKeys.COMBINED_CASE_ALLOCATION_METRIC_DATA) {
        return {
          e2: [{ 'Habitat type': 'Wetland', Condition: 'Poor', 'Area (hectares)': 15 }],
          f3: [{ 'Proposed habitat': 'Stream', Condition: 'Excellent', 'Length (km)': 2 }]
        }
      }
      return null
    })
  })

  test('processMetricData extracts and sets correct data', () => {
    processMetricData(session)

    const expectedRegistrationHabitats = [
      {
        habitatType: 'Forest - Woodland',
        condition: 'Good',
        module: 'Created',
        state: 'Habitat',
        id: 'HAB-00000000-0',
        size: 10,
        measurementUnits: 'hectares',
        processed: false
      },
      {
        habitatType: 'Grassland - Meadow',
        condition: 'Fair',
        module: 'Enhanced',
        state: 'Habitat',
        id: 'HAB-00000000-1',
        size: 5,
        measurementUnits: 'kilometres',
        processed: false
      }
    ]

    const expectedAllocationHabitats = [
      {
        habitatType: 'Wetland',
        condition: 'Poor',
        module: 'Created',
        state: 'Hedge',
        id: '0',
        size: 15,
        measurementUnits: 'hectares',
        processed: false
      },
      {
        habitatType: 'Stream',
        condition: 'Excellent',
        module: 'Enhanced',
        state: 'Watercourse',
        id: '1',
        size: 2,
        measurementUnits: 'kilometres',
        processed: false
      }
    ]

    expect(session.set).toHaveBeenCalledWith(
      combinedCaseConstants.redisKeys.COMBINED_CASE_REGISTRATION_HABITATS,
      expectedRegistrationHabitats
    )
    expect(session.set).toHaveBeenCalledWith(
      combinedCaseConstants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS,
      expectedAllocationHabitats
    )
  })
})

describe('habitatDescription', () => {
  test('habitatDescription returns formatted string', () => {
    const habitat = {
      habitatType: 'Forest',
      condition: 'Good',
      size: 10,
      measurementUnits: 'hectares',
      module: 'Created',
      state: 'Habitat'
    }
    expect(habitatDescription(habitat)).toBe('Forest || Good || 10 hectares || Created || Habitat')
  })
})

describe('getMatchingHabitats', () => {
  test('getMatchingHabitats returns matching habitats', () => {
    const habitat = {
      state: 'Habitat',
      module: 'Created',
      habitatType: 'Forest',
      condition: 'Good'
    }
    const habitatList = [
      { state: 'Habitat', module: 'Created', habitatType: 'Forest', condition: 'Good' },
      { state: 'Habitat', module: 'Created', habitatType: 'Forest', condition: 'Poor' },
      { state: 'Hedge', module: 'Created', habitatType: 'Forest', condition: 'Good' }
    ]
    const result = getMatchingHabitats(habitat, habitatList)
    expect(result).toEqual([habitatList[0]])
  })
})

describe('summariseHabitatMatches', () => {
  test('summariseHabitatMatches returns correct summary', () => {
    const registrationHabitats = [
      { id: '1', habitatType: 'Forest', condition: 'Good', size: 10, measurementUnits: 'hectares', module: 'Created', state: 'Habitat' }
    ]
    const allocationHabitats = [
      { id: '1', habitatType: 'Forest', condition: 'Good', size: 10, measurementUnits: 'hectares', module: 'Created', state: 'Habitat' }
    ]
    const result = summariseHabitatMatches(registrationHabitats, allocationHabitats)
    const expected = {
      1: {
        registration: 'Forest || Good || 10 hectares || Created || Habitat',
        allocation: 'Forest || Good || 10 hectares || Created || Habitat'
      }
    }
    expect(result).toEqual(expected)
  })

  test('summariseHabitatMatches handles unmatched habitats', () => {
    const registrationHabitats = [
      { id: '1', habitatType: 'Forest', condition: 'Good', size: 10, measurementUnits: 'hectares', module: 'Created', state: 'Habitat' }
    ]
    const allocationHabitats = [
      { id: '2', habitatType: 'Wetland', condition: 'Poor', size: 15, measurementUnits: 'hectares', module: 'Created', state: 'Hedge' }
    ]
    const result = summariseHabitatMatches(registrationHabitats, allocationHabitats)
    const expected = {
      1: {
        registration: 'Forest || Good || 10 hectares || Created || Habitat',
        allocation: undefined
      }
    }
    expect(result).toEqual(expected)
  })
})
