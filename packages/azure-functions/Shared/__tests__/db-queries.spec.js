import { createApplicationReference } from '../db-queries'

describe('createApplicationReference', () => {
  it('Should be a function', () => {
    expect(typeof createApplicationReference).toBe('function')
  })
  it('Should run db.query with correct script', () => {
    const db = {
      query: query => query
    }
    expect(createApplicationReference(db)).toEqual('select bng_user.fn_create_application_reference();')
  })
})
