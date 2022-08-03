// import { recreateContainers, recreateQueues } from '@defra/bng-azure-storage-test-utils'

const ORIGINAL_ENV = process.env

beforeEach(async () => {
  process.env = { ...ORIGINAL_ENV }
  jest.resetAllMocks()
})

afterEach(async () => {
  process.env = ORIGINAL_ENV
})
