import {
  createApplicationReference,
  saveApplicationSession,
  getApplicationSessionById,
  getApplicationSessionByReferenceContactIdAndApplicationType,
  getApplicationStatusesByContactIdAndApplicationType,
  getExpiringApplicationSessions,
  clearApplicationSession,
  recordExpiringApplicationSessionNotification,
  isPointInEngland,
  applicationStatuses
} from '../db-queries.js'

const expectedDeleteStatement = `
  DELETE FROM
    bng.application_session
  WHERE
    date_modified AT TIME ZONE 'UTC' < NOW() AT TIME ZONE 'UTC' - INTERVAL '28 days';
`

const expectedInsertStatement = `
  INSERT INTO
    bng.application_session (application_reference, application_session)
  VALUES ($1, $2)
  ON CONFLICT (application_reference) DO UPDATE SET
    date_of_expiry_notification = EXCLUDED.date_of_expiry_notification,
    date_modified = now() AT TIME ZONE 'utc'
  RETURNING application_session_id;
`

const expectedGetApplicationStatusesByContactIdAndApplicationTypeStatement = `
  SELECT
    ar.application_reference,
    ${applicationStatuses.inProgress} AS application_status
  FROM
    bng.application_reference ar
      INNER JOIN bng.application_session aps
        ON ar.application_reference = aps.application_reference
  WHERE
    ar.contact_id = $1
    AND ar.application_type = $2
  UNION
  SELECT
    ar.application_reference,
    ${applicationStatuses.received} AS application_status
  FROM
    bng.application_reference ar
      INNER JOIN bng.application_status aps
        ON ar.application_reference = aps.application_reference
  WHERE
    ar.contact_id = $1
    AND ar.application_type = $2;
`
const expectedGetApplicationSessionByReferenceContactIdAndApplicationTypeStatement = `
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
const expectedGetExpiringApplicationSessionsStatement = `
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
const expectedRecordExpiringApplicationSessionNotificationStatement = `
  UPDATE
    bng.application_session
  SET
    date_of_expiry_notification = NOW() AT TIME ZONE 'UTC'
  WHERE
    application_session_id = $1;
`

describe('Database queries', () => {
  describe('createApplicationReference', () => {
    it('Should be a function', () => {
      expect(typeof createApplicationReference).toBe('function')
    })
  })
  it('Should run db.query with correct script', () => {
    const db = {
      query: query => query
    }
    expect(createApplicationReference(db)).toEqual('SELECT bng.fn_create_application_reference($1, $2);')
    expect(saveApplicationSession(db)).toEqual(expectedInsertStatement)
    expect(getApplicationSessionById(db)).toEqual('SELECT application_session FROM bng.application_session WHERE application_session_id = $1')
    expect(getApplicationSessionByReferenceContactIdAndApplicationType(db)).toEqual(expectedGetApplicationSessionByReferenceContactIdAndApplicationTypeStatement)
    expect(getApplicationStatusesByContactIdAndApplicationType(db)).toEqual(expectedGetApplicationStatusesByContactIdAndApplicationTypeStatement)
    expect(getExpiringApplicationSessions(db)).toEqual(expectedGetExpiringApplicationSessionsStatement)
    expect(clearApplicationSession(db)).toEqual(expectedDeleteStatement)
    expect(recordExpiringApplicationSessionNotification(db)).toEqual(expectedRecordExpiringApplicationSessionNotificationStatement)
    expect(isPointInEngland(db)).toEqual('select bng.fn_is_point_in_england_27700($1, $2)')
  })
})
