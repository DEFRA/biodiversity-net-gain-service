const createApplicationReference = db => db.query('SELECT bng.fn_create_application_reference();')

const saveApplicationSession = (db, values) => db.query('INSERT INTO bng.application_session (application_reference, email, application_session) VALUES ($1, $2, $3) ON CONFLICT (application_reference) DO UPDATE SET email = EXCLUDED.email, application_session = EXCLUDED.application_session, date_modified = now() AT TIME ZONE \'utc\';', values)

const getApplicationSession = (db, values) => db.query('SELECT application_session FROM bng.application_session WHERE application_reference = $1 AND email = $2;', values)

const clearApplicationSession = db => db.query('DELETE FROM bng.application_session WHERE date_modified AT TIME ZONE \'UTC\' < NOW() AT TIME ZONE \'UTC\' - INTERVAL \'28 days\';')

export {
  createApplicationReference,
  saveApplicationSession,
  getApplicationSession,
  clearApplicationSession
}
