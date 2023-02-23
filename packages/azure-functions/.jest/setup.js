import Context from '../__mocks__/mock-context.js'
import timer from '../__mocks__/mock-timer.js'
import { recreateContainers, recreateQueues } from '@defra/bng-azure-storage-test-utils'

const ORIGINAL_ENV = process.env

let context

beforeEach(async () => {
  jest.resetAllMocks()
  context = new Context()
  await recreateContainers(),
  await recreateQueues()
})

afterEach(async () => {
  process.env = ORIGINAL_ENV
})

const getContext = () => {
  return context
}

const getTimer = () => {
  return timer
}

export { getContext, getTimer }
