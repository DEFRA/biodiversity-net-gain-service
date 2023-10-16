const applicationStatuses = Object.freeze({
  inProgress: 'IN PROGRESS',
  received: 'RECEIVED'
})

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
    aps.application_session
  FROM
    bng.application_session aps
      INNER JOIN bng.application_reference ar
        ON aps.application_reference = ar.application_reference
  WHERE
    aps.application_reference = $1
    AND ar.contact_id = $2
    AND ar.application_type = $3;
`
const getApplicationCountByContactIdStatement = `
  SELECT
    contact_id,
    COUNT(application_reference) AS application_count
  FROM
    bng.application_reference
  WHERE
    contact_id = $1
  GROUP BY
    contact_id;
`

const getApplicationStatusesByContactIdAndApplicationTypeStatement = `
  (SELECT
    ar.application_reference,
    aps.date_modified,
    '${applicationStatuses.received}' AS application_status
  FROM
    bng.application_reference ar
      INNER JOIN bng.application_status aps
        ON ar.application_reference = aps.application_reference
  WHERE
    ar.contact_id = $1
    AND ar.application_type = $2::bng.application_type
  UNION
  SELECT
    ar.application_reference,
    aps.date_modified,
    '${applicationStatuses.inProgress}' AS application_status
  FROM
    bng.application_reference ar
      INNER JOIN bng.application_session aps
        ON ar.application_reference = aps.application_reference
  WHERE
    ar.contact_id = $1
    AND ar.application_type = $2::bng.application_type)
  ORDER BY
    application_status,
    date_modified DESC;
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

const createApplicationReference = (db, values, context) => db.query('SELECT bng.fn_create_application_reference($1, $2);', values, context)

const saveApplicationSession = (db, values, context) => db.query(insertApplicationSessionStatement, values, context)

const deleteApplicationSession = (db, values, context) => db.query(deleteApplicationSessionStatement, values, context)

const getApplicationCountByContactId = (db, values, context) => db.query(getApplicationCountByContactIdStatement, values, context)

const getApplicationSessionById = (db, values, context) => db.query('SELECT application_session FROM bng.application_session WHERE application_session_id = $1', values, context)

const getApplicationSessionByReferenceContactIdAndApplicationType = (db, values, context) => db.query(getApplicationSessionByReferenceContactIdAndApplicationTypeStatement, values, context)

const getApplicationStatusesByContactIdAndApplicationType = (db, values, context) => db.query(getApplicationStatusesByContactIdAndApplicationTypeStatement, values, context)

const clearApplicationSession = (db, context) => db.query(deleteApplicationSessionsAt28DaysStatement, [], context)

const getExpiringApplicationSessions = (db, context) => db.query(getExpiringApplicationSessionsStatement, [], context)

const recordExpiringApplicationSessionNotification = (db, values, context) => db.query(recordExpiringApplicationSessionNotificationStatement, values, context)

const isPointInEngland = (db, values, context) => db.query('select bng.fn_is_point_in_england_27700($1, $2)', values, context)

const insertApplicationStatus = (db, values, context) => db.query(insertApplicationStatusStatement, values, context)

const getApplicationStatus = (db, values, context) => db.query(getApplicationStatusStatement, values, context)

export {
  createApplicationReference,
  saveApplicationSession,
  deleteApplicationSession,
  getApplicationCountByContactId,
  getApplicationSessionById,
  getApplicationSessionByReferenceContactIdAndApplicationType,
  getApplicationStatusesByContactIdAndApplicationType,
  getExpiringApplicationSessions,
  clearApplicationSession,
  recordExpiringApplicationSessionNotification,
  isPointInEngland,
  insertApplicationStatus,
  getApplicationStatus,
  applicationStatuses
}
