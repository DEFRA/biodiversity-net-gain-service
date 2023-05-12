import { recreateContainers, recreateQueues } from '@defra/bng-azure-storage-test-utils'

const ORIGINAL_ENV = process.env

beforeEach(async () => {
  jest.resetAllMocks()
  await recreateContainers(),
  await recreateQueues()
})

afterEach(async () => {
   process.env = { ...ORIGINAL_ENV }
})
