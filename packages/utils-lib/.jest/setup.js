const ORIGINAL_ENV = process.env

beforeEach(() => {
  jest.resetAllMocks()
})

afterEach(() => {
   process.env = { ...ORIGINAL_ENV }
})
