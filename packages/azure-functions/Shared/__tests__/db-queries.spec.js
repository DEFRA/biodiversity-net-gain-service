import {
  createApplicationReference,
  saveApplicationSession,
  getApplicationSessionById,
  getApplicationSessionByReferenceAndEmail,
  clearApplicationSession
} from '../db-queries.js'

const expectedInsertStatement = `
  INSERT INTO
    bng.application_session (application_reference, email, application_session)
  VALUES ($1, $2, $3)
  ON CONFLICT (application_reference) DO UPDATE SET
    email = EXCLUDED.email, application_session = EXCLUDED.application_session,
    date_modified = now() AT TIME ZONE 'utc'
  RETURNING application_session_id;
`

describe('createApplicationReference', () => {
  it('Should be a function', () => {
    expect(typeof createApplicationReference).toBe('function')
  })
  it('Should run db.query with correct script', () => {
    const db = {
      query: query => query
    }
    expect(createApplicationReference(db)).toEqual('SELECT bng.fn_create_application_reference();')
    expect(saveApplicationSession(db)).toEqual(expectedInsertStatement)
    expect(getApplicationSessionById(db)).toEqual('SELECT application_session FROM bng.application_session WHERE application_session_id = $1')
    expect(getApplicationSessionByReferenceAndEmail(db)).toEqual('SELECT application_session FROM bng.application_session WHERE application_reference = $1 AND email = $2;')
    expect(clearApplicationSession(db)).toEqual('DELETE FROM bng.application_session WHERE date_modified AT TIME ZONE \'UTC\' < NOW() AT TIME ZONE \'UTC\' - INTERVAL \'28 days\';')
  })
})
