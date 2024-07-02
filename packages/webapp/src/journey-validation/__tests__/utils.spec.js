import {
  ANY,
  routeDefinition,
  journeyStepFromRoute,
  journeyStep,
  taskSectionDefinition
} from '../utils'

const testUrl = 'testUrl'
const testKey1 = 'testKey1'
const testKey2 = 'testKey2'
const testKeys = [testKey1, testKey2]
const testValues = [123, 456]

const testRouteDefinition = {
  startUrl: testUrl,
  sessionKeys: [testKey1]
}

const testJourneyStepWithInvalidate = {
  startUrl: testUrl,
  sessionMismatchWillInvalidate: true,
  sessionDataRequired: {
    [testKey1]: testValues[0],
    [testKey2]: testValues[1]
  }
}

const testJourneyStepWithoutInvalidate = {
  startUrl: testUrl,
  sessionMismatchWillInvalidate: false,
  sessionDataRequired: {
    [testKey1]: ANY
  }
}

const testTaskSectionDefinitionWithId = {
  title: 'testTitle',
  tasks: [],
  id: 'testId'
}

const testTaskSectionDefinitionWithIds = {
  title: 'testTitle',
  tasks: [],
  id: 'testId',
  dependantIds: ['fooId', 'barId']
}

const testTaskSectionDefinitionWithIdsAndNoId = {
  title: 'testTitle',
  tasks: [],
  dependantIds: ['fooId', 'barId']
}

describe('journey validation utils', () => {
  it('Route definition should be correct format', () => {
    const route = routeDefinition(testUrl, [testKey1])
    expect(route).toMatchObject(testRouteDefinition)
  })

  it('Journey step should be correct format', () => {
    const step = journeyStep(testUrl, testKeys, testValues, true)
    expect(step).toMatchObject(testJourneyStepWithInvalidate)
  })

  it('Journey step should be correct format and auto set invalidate to false', () => {
    const step = journeyStep(testUrl, [testKey1], [ANY])
    expect(step).toMatchObject(testJourneyStepWithoutInvalidate)
  })

  it('Journey step from route should be correct format', () => {
    const step = journeyStepFromRoute(testRouteDefinition)
    expect(step).toMatchObject(testJourneyStepWithoutInvalidate)
  })

  it('Task section definition should accept id', () => {
    const section = taskSectionDefinition(
      testTaskSectionDefinitionWithId.title,
      testTaskSectionDefinitionWithId.tasks,
      testTaskSectionDefinitionWithId.id)
    expect(section).toMatchObject(testTaskSectionDefinitionWithId)
  })

  it('Task section definition should accept ids', () => {
    const section = taskSectionDefinition(
      testTaskSectionDefinitionWithIds.title,
      testTaskSectionDefinitionWithIds.tasks,
      testTaskSectionDefinitionWithIds.id,
      testTaskSectionDefinitionWithIds.dependantIds)
    expect(section).toMatchObject(testTaskSectionDefinitionWithIds)
  })

  it('Task section definition should accept ids without id', () => {
    const section = taskSectionDefinition(
      testTaskSectionDefinitionWithIdsAndNoId.title,
      testTaskSectionDefinitionWithIdsAndNoId.tasks,
      null,
      testTaskSectionDefinitionWithIdsAndNoId.dependantIds)
    expect(section).toMatchObject(testTaskSectionDefinitionWithIdsAndNoId)
  })
})
