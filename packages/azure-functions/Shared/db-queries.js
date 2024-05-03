import { retryDbOperation, randomReferenceString } from './reference-helpers.js'

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
const getApplicationCountByContactIdAndOrganisationIdStatement = `
  SELECT
    contact_id,
    COUNT(application_reference) AS application_count
  FROM
    bng.application_reference
  WHERE
    contact_id = $1
    AND (organisation_id = $2 OR $2 IS NULL AND organisation_id IS NULL)
  GROUP BY
    contact_id;
`

const getApplicationStatusesByContactIdAndOrganisationIdAndApplicationTypeStatement = `
  (SELECT
    ar.application_reference,
    ar.project_name,
    aps.date_modified,
    '${applicationStatuses.received}' AS application_status
  FROM
    bng.application_reference ar
      INNER JOIN bng.application_status aps
        ON ar.application_reference = aps.application_reference
  WHERE
    ar.contact_id = $1
    AND (organisation_id = $2 OR $2 IS NULL AND organisation_id IS NULL)
    AND ar.application_type = $3::bng.application_type
  UNION
  SELECT
    ar.application_reference,
    ar.project_name,
    aps.date_modified,
    '${applicationStatuses.inProgress}' AS application_status
  FROM
    bng.application_reference ar
      INNER JOIN bng.application_session aps
        ON ar.application_reference = aps.application_reference
  WHERE
    ar.contact_id = $1
    AND (organisation_id = $2 OR $2 IS NULL AND organisation_id IS NULL)
    AND ar.application_type = $3::bng.application_type)
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
const updateProjectNameStatement = `
  UPDATE bng.application_reference
  SET project_name = $2
  WHERE application_reference = $1 AND project_name IS DISTINCT FROM $2;
`

const insertApplicationReferenceStatement = `
  INSERT INTO
      bng.application_reference(application_reference, contact_id, application_type, organisation_id)
    VALUES
      ($1, $2, $3, $4)
    RETURNING application_reference;
`

const registrationAppPrefix = 'BNGREG'
const creditsAppPrefix = 'BNGCRD'

const createUniqueApplicationReference = (prefix, db, values) => {
  const firstRandomString = randomReferenceString(5)
  const secondRandomString = randomReferenceString(4)
  const referenceString = `${prefix}-${firstRandomString}-A${secondRandomString}`

  return db.query(insertApplicationReferenceStatement, [...[referenceString], ...values])
}

const createApplicationReference = (db, values) => retryDbOperation(createUniqueApplicationReference, [registrationAppPrefix, db, values])

const saveApplicationSession = (db, values) => db.query(insertApplicationSessionStatement, values)

const deleteApplicationSession = (db, values) => db.query(deleteApplicationSessionStatement, values)

const getApplicationCountByContactIdAndOrganisationId = (db, values) => db.query(getApplicationCountByContactIdAndOrganisationIdStatement, values)

const getApplicationSessionById = (db, values) => db.query('SELECT application_session FROM bng.application_session WHERE application_session_id = $1', values)

const getApplicationSessionByReferenceContactIdAndApplicationType = (db, values) => db.query(getApplicationSessionByReferenceContactIdAndApplicationTypeStatement, values)

const getApplicationStatusesByContactIdAndOrganisationIdAndApplicationType = (db, values) => db.query(getApplicationStatusesByContactIdAndOrganisationIdAndApplicationTypeStatement, values)

const clearApplicationSession = db => db.query(deleteApplicationSessionsAt28DaysStatement)

const getExpiringApplicationSessions = db => db.query(getExpiringApplicationSessionsStatement)

const recordExpiringApplicationSessionNotification = (db, values) => db.query(recordExpiringApplicationSessionNotificationStatement, values)

const isPointInEngland = (db, values) => db.query('select bng.fn_is_point_in_england_27700($1, $2)', values)

const insertApplicationStatus = (db, values) => db.query(insertApplicationStatusStatement, values)

const getApplicationStatus = (db, values) => db.query(getApplicationStatusStatement, values)

const updateProjectName = (db, values) => db.query(updateProjectNameStatement, values)

const createCreditsAppReference = (db, values) => retryDbOperation(createUniqueApplicationReference, [creditsAppPrefix, db, values])

export {
  createApplicationReference,
  saveApplicationSession,
  deleteApplicationSession,
  getApplicationCountByContactIdAndOrganisationId,
  getApplicationSessionById,
  getApplicationSessionByReferenceContactIdAndApplicationType,
  getApplicationStatusesByContactIdAndOrganisationIdAndApplicationType,
  getExpiringApplicationSessions,
  clearApplicationSession,
  recordExpiringApplicationSessionNotification,
  isPointInEngland,
  insertApplicationStatus,
  getApplicationStatus,
  applicationStatuses,
  updateProjectName,
  createCreditsAppReference
}
