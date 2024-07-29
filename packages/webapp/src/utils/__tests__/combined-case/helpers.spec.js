import constants from '../../constants.js'

describe('Combined Case Habitat Match Utility Functions', () => {
  beforeEach(() => {
    global.habitatReferenceCounter = 0
    global.ownReferenceCounter = 0
  })

  test('generateHabitatReference increments correctly', () => {
    jest.isolateModules(() => {
      const { generateHabitatReference } = require('../../combined-case/helpers.js')
      expect(generateHabitatReference()).toBe('HAB-00000000-0')
      expect(generateHabitatReference()).toBe('HAB-00000000-1')
      expect(generateHabitatReference()).toBe('HAB-00000000-2')
    })
  })

  test('generateOwnReference increments correctly', () => {
    jest.isolateModules(() => {
      const { generateOwnReference } = require('../../combined-case/helpers.js')
      expect(generateOwnReference()).toBe('0')
      expect(generateOwnReference()).toBe('1')
      expect(generateOwnReference()).toBe('2')
    })
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
      if (key === constants.redisKeys.METRIC_DATA) {
        return {
          d2: [{ 'Broad habitat': 'Forest', 'Proposed habitat': 'Woodland', Condition: 'Good', 'Area (hectares)': 10 }],
          d3: [{ 'Proposed Broad Habitat': 'Grassland', 'Proposed habitat': 'Meadow', Condition: 'Fair', 'Length (km)': 5 }]
        }
      } else if (key === constants.redisKeys.DEVELOPER_METRIC_DATA) {
        return {
          e2: [{ 'Habitat type': 'Wetland', Condition: 'Poor', 'Area (hectares)': 15 }],
          f3: [{ 'Proposed habitat': 'Stream', Condition: 'Excellent', 'Length (km)': 2 }]
        }
      }
      return null
    })

    global.habitatReferenceCounter = 0
    global.ownReferenceCounter = 0
  })

  test('processMetricData extracts and sets correct data', () => {
    jest.isolateModules(() => {
      const { processMetricData } = require('../../combined-case/helpers.js')
      processMetricData(session)

      const expectedRegistrationHabitats = [
        {
          habitatType: 'Forest - Woodland',
          condition: 'Good',
          sheet: 'd2',
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
          sheet: 'd3',
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
          sheet: 'e2',
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
          sheet: 'f3',
          module: 'Enhanced',
          state: 'Watercourse',
          id: '1',
          size: 2,
          measurementUnits: 'kilometres',
          processed: false
        }
      ]

      // Verifying session.set calls with expected data
      expect(session.set).toHaveBeenCalledWith(
        constants.redisKeys.COMBINED_CASE_REGISTRATION_HABITATS,
        expectedRegistrationHabitats
      )
      expect(session.set).toHaveBeenCalledWith(
        constants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS,
        expectedAllocationHabitats
      )
    })
  })
})

describe('habitatDescription', () => {
  test('habitatDescription returns formatted string', () => {
    jest.isolateModules(() => {
      const { habitatDescription } = require('../../combined-case/helpers.js')
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
})

describe('getMatchingHabitats', () => {
  test('getMatchingHabitats returns matching habitats', () => {
    jest.isolateModules(() => {
      const { getMatchingHabitats } = require('../../combined-case/helpers.js')
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
})

describe('summariseHabitatMatches', () => {
  test('summariseHabitatMatches returns correct summary', () => {
    jest.isolateModules(() => {
      const { summariseHabitatMatches } = require('../../combined-case/helpers.js')
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
  })

  test('summariseHabitatMatches handles unmatched habitats', () => {
    jest.isolateModules(() => {
      const { summariseHabitatMatches } = require('../../combined-case/helpers.js')
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
})

describe('getHabitatType', () => {
  test('returns formatted habitat type for d2 identifier', () => {
    jest.isolateModules(() => {
      const { getHabitatType } = require('../../combined-case/helpers.js')
      const details = {
        'Broad habitat': 'Forest',
        'Proposed habitat': 'Woodland'
      }
      expect(getHabitatType('d2', details)).toBe('Forest - Woodland')
    })
  })

  test('returns undefined for d2 identifier with missing details', () => {
    jest.isolateModules(() => {
      const { getHabitatType } = require('../../combined-case/helpers.js')
      const details = {
        'Broad habitat': 'Forest'
      }
      expect(getHabitatType('d2', details)).toBeUndefined()
    })
  })

  test('returns formatted habitat type for d3 identifier', () => {
    jest.isolateModules(() => {
      const { getHabitatType } = require('../../combined-case/helpers.js')
      const details = {
        'Proposed Broad Habitat': 'Grassland',
        'Proposed habitat': 'Meadow'
      }
      expect(getHabitatType('d3', details)).toBe('Grassland - Meadow')
    })
  })

  test('returns undefined for d3 identifier with missing details', () => {
    jest.isolateModules(() => {
      const { getHabitatType } = require('../../combined-case/helpers.js')
      const details = {
        'Proposed Broad Habitat': 'Grassland'
      }
      expect(getHabitatType('d3', details)).toBeUndefined()
    })
  })

  test('returns habitat type for e2 identifier', () => {
    jest.isolateModules(() => {
      const { getHabitatType } = require('../../combined-case/helpers.js')
      const details = {
        'Habitat type': 'Wetland'
      }
      expect(getHabitatType('e2', details)).toBe('Wetland')
    })
  })

  test('returns proposed habitat for e3 identifier', () => {
    jest.isolateModules(() => {
      const { getHabitatType } = require('../../combined-case/helpers.js')
      const details = {
        'Proposed habitat': 'Stream'
      }
      expect(getHabitatType('e3', details)).toBe('Stream')
    })
  })

  test('returns watercourse type for f2 identifier', () => {
    jest.isolateModules(() => {
      const { getHabitatType } = require('../../combined-case/helpers.js')
      const details = {
        'Watercourse type': 'River'
      }
      expect(getHabitatType('f2', details)).toBe('River')
    })
  })

  test('returns proposed habitat for f3 identifier', () => {
    jest.isolateModules(() => {
      const { getHabitatType } = require('../../combined-case/helpers.js')
      const details = {
        'Proposed habitat': 'Stream'
      }
      expect(getHabitatType('f3', details)).toBe('Stream')
    })
  })
})

describe('getState', () => {
  test('returns Habitat for identifier starting with d', () => {
    jest.isolateModules(() => {
      const { getState } = require('../../combined-case/helpers.js')
      expect(getState('d2')).toBe('Habitat')
      expect(getState('d3')).toBe('Habitat')
    })
  })

  test('returns Hedge for identifier starting with e', () => {
    jest.isolateModules(() => {
      const { getState } = require('../../combined-case/helpers.js')
      expect(getState('e2')).toBe('Hedge')
      expect(getState('e3')).toBe('Hedge')
    })
  })

  test('returns Watercourse for identifier starting with f', () => {
    jest.isolateModules(() => {
      const { getState } = require('../../combined-case/helpers.js')
      expect(getState('f2')).toBe('Watercourse')
      expect(getState('f3')).toBe('Watercourse')
    })
  })
})

describe('getModule', () => {
  test('returns Baseline for identifier ending with 1', () => {
    jest.isolateModules(() => {
      const { getModule } = require('../../combined-case/helpers.js')
      expect(getModule('d1')).toBe('Baseline')
      expect(getModule('e1')).toBe('Baseline')
      expect(getModule('f1')).toBe('Baseline')
    })
  })

  test('returns Created for identifier ending with 2', () => {
    jest.isolateModules(() => {
      const { getModule } = require('../../combined-case/helpers.js')
      expect(getModule('d2')).toBe('Created')
      expect(getModule('e2')).toBe('Created')
      expect(getModule('f2')).toBe('Created')
    })
  })

  test('returns Enhanced for identifier ending with 3', () => {
    jest.isolateModules(() => {
      const { getModule } = require('../../combined-case/helpers.js')
      expect(getModule('d3')).toBe('Enhanced')
      expect(getModule('e3')).toBe('Enhanced')
      expect(getModule('f3')).toBe('Enhanced')
    })
  })
})
