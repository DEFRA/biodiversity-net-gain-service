import constants from '../../../utils/constants.js'
import { localLandChargeRouteDefinitions } from '../local-land-charge.js'
import { FormError } from '../../../utils/form-error.js'

const [
  UPLOAD_LOCAL_LAND_CHARGE,
  CHECK_LOCAL_LAND_CHARGE_FILE
] = localLandChargeRouteDefinitions

describe('Route Definitions', () => {
  let session

  beforeEach(() => {
    session = new Map()
  })

  test('UPLOAD_LOCAL_LAND_CHARGE returns correct URL', () => {
    const result = UPLOAD_LOCAL_LAND_CHARGE.nextUrl(session)
    expect(result).toBe(constants.reusedRoutes.COMBINED_CASE_CHECK_LOCAL_LAND_CHARGE_FILE)
  })

  test('CHECK_LOCAL_LAND_CHARGE_FILE returns correct route based on session data', () => {
    session.set(constants.redisKeys.LOCAL_LAND_CHARGE_CHECKED, 'no')
    let result = CHECK_LOCAL_LAND_CHARGE_FILE.nextUrl(session)
    expect(result).toBe(constants.reusedRoutes.COMBINED_CASE_UPLOAD_LOCAL_LAND_CHARGE)
    expect(session.get(constants.redisKeys.LOCAL_LAND_CHARGE_FILE_OPTION)).toBe('no')

    session.set(constants.redisKeys.LOCAL_LAND_CHARGE_CHECKED, 'yes')
    result = CHECK_LOCAL_LAND_CHARGE_FILE.nextUrl(session)
    expect(result).toBe('/combined-case/register-land-task-list')
    expect(session.get(constants.redisKeys.LOCAL_LAND_CHARGE_FILE_OPTION)).toBe('yes')

    result = CHECK_LOCAL_LAND_CHARGE_FILE.nextUrl(session)
    expect(result).toBe(constants.reusedRoutes.COMBINED_CASE_REGISTER_LAND_TASK_LIST)

    session.set(constants.redisKeys.LOCAL_LAND_CHARGE_CHECKED, 'invalid_value')
    expect(() => CHECK_LOCAL_LAND_CHARGE_FILE.nextUrl(session)).toThrow(FormError)
  })
})
