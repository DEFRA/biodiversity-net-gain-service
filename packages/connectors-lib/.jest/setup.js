const ORIGINAL_ENV = process.env

afterEach(async () => {
   process.env = { ...ORIGINAL_ENV }
})
