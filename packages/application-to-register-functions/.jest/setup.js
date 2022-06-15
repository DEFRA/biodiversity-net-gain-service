import Context from '../__mocks__/mock-context.js'
import { recreateContainers, recreateQueues } from '@defra/bng-azure-storage-test-utils'

let context

beforeEach(async () => {
  jest.resetAllMocks()
  context = new Context()
  recreateContainers(),
  recreateQueues()
})

const getContext = () => {
  return context
}

export { getContext }