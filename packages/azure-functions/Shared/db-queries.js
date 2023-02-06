const deleteStatement = `
  DELETE FROM
    bng.application_session
  WHERE
    date_modified AT TIME ZONE 'UTC' < NOW() AT TIME ZONE 'UTC' - INTERVAL '28 days';
`
const insertStatement = `
  INSERT INTO
    bng.application_session (application_reference, email, application_session)
  VALUES ($1, $2, $3)
  ON CONFLICT (application_reference) DO UPDATE SET
    email = EXCLUDED.email, application_session = EXCLUDED.application_session,
    date_modified = now() AT TIME ZONE 'utc'
  RETURNING application_session_id;
`

const createApplicationReference = db => db.query('SELECT bng.fn_create_application_reference();')

const saveApplicationSession = (db, values) => db.query(insertStatement, values)

const getApplicationSessionById = (db, values) => db.query('SELECT application_session FROM bng.application_session WHERE application_session_id = $1', values)

const getApplicationSessionByReferenceAndEmail = (db, values) => db.query('SELECT application_session FROM bng.application_session WHERE application_reference = $1 AND email = $2;', values)

const clearApplicationSession = db => db.query(deleteStatement)

export {
  createApplicationReference,
  saveApplicationSession,
  getApplicationSessionById,
  getApplicationSessionByReferenceAndEmail,
  clearApplicationSession
}
