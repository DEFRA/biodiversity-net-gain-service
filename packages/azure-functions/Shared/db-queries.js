const deleteApplicationSessionsAt28DaysStatement = `
  DELETE FROM
    bng.application_session
  WHERE
    date_modified AT TIME ZONE 'UTC' < NOW() AT TIME ZONE 'UTC' - INTERVAL '28 days';
`
const insertApplicationSessionStatement = `
  INSERT INTO
    bng.application_session (application_reference, application_session)
  VALUES ($1, $2)
  ON CONFLICT (application_reference) DO UPDATE SET
    application_session = EXCLUDED.application_session,
    date_of_expiry_notification = EXCLUDED.date_of_expiry_notification,
    date_modified = now() AT TIME ZONE 'utc'
  RETURNING application_session_id;
`

const deleteApplicationSessionStatement = `
  DELETE FROM
    bng.application_session
  WHERE
    application_reference = $1;
`

const getApplicationSessionByReferenceContactIdAndApplicationTypeStatement = `
  SELECT
    application_session
  FROM
    bng.application_session as
      INNER JOIN bng.application_reference ar
        ON as.application_reference = ar.application_reference
  WHERE
    as.application_reference = $1
    AND ar.contact_id = $2
    AND ar.application_type = $3;
`
const getExpiringApplicationSessionsStatement = `
  SELECT
    application_session_id
  FROM
    bng.application_session
  WHERE
    date_modified AT TIME ZONE 'UTC' < NOW() AT TIME ZONE 'UTC' - INTERVAL '21 days'
    AND date_of_expiry_notification IS NULL
  UNION
  SELECT
    application_session_id
  FROM
    bng.application_session
  WHERE
    date_modified AT TIME ZONE 'UTC' < NOW() AT TIME ZONE 'UTC' - INTERVAL '21 days'
    AND date_modified > date_of_expiry_notification;
`
const recordExpiringApplicationSessionNotificationStatement = `
  UPDATE
    bng.application_session
  SET
    date_of_expiry_notification = NOW() AT TIME ZONE 'UTC'
  WHERE
    application_session_id = $1;
`

const insertApplicationStatusStatement = `
  INSERT INTO
    bng.application_status (application_reference, application_status)
  VALUES ($1, $2);
`

const getApplicationStatusStatement = `
  SELECT
    application_status
  FROM
    bng.application_status
  WHERE
    application_reference = $1
  ORDER BY
    date_modified DESC
  LIMIT 1;
`

const createApplicationReference = (db, values) => db.query('SELECT bng.fn_create_application_reference($1, $2);', values)

const saveApplicationSession = (db, values) => db.query(insertApplicationSessionStatement, values)

const deleteApplicationSession = (db, values) => db.query(deleteApplicationSessionStatement, values)

const getApplicationSessionById = (db, values) => db.query('SELECT application_session FROM bng.application_session WHERE application_session_id = $1', values)

const getApplicationSessionByReferenceContactIdAndApplicationType = (db, values) => db.query(getApplicationSessionByReferenceContactIdAndApplicationTypeStatement, values)

const clearApplicationSession = db => db.query(deleteApplicationSessionsAt28DaysStatement)

const getExpiringApplicationSessions = db => db.query(getExpiringApplicationSessionsStatement)

const recordExpiringApplicationSessionNotification = (db, values) => db.query(recordExpiringApplicationSessionNotificationStatement, values)

const isPointInEngland = (db, values) => db.query('select bng.fn_is_point_in_england_27700($1, $2)', values)

const insertApplicationStatus = (db, values) => db.query(insertApplicationStatusStatement, values)

const getApplicationStatus = (db, values) => db.query(getApplicationStatusStatement, values)

export {
  createApplicationReference,
  saveApplicationSession,
  deleteApplicationSession,
  getApplicationSessionById,
  getApplicationSessionByReferenceContactIdAndApplicationType,
  getExpiringApplicationSessions,
  clearApplicationSession,
  recordExpiringApplicationSessionNotification,
  isPointInEngland,
  insertApplicationStatus,
  getApplicationStatus
}
