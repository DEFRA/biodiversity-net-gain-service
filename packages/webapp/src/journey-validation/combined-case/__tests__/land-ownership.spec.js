import constants from '../../../utils/constants'
import { landOwnershipRouteDefinitions } from '../land-ownership.js'

const [
  UPLOAD_LAND_OWNERSHIP,
  CHECK_PROOF_OF_OWNERSHIP,
  LAND_OWNERSHIP_PROOF_LIST
] = landOwnershipRouteDefinitions

describe('Route Definitions', () => {
  let session

  beforeEach(() => {
    session = new Map()
  })

  test('UPLOAD_LAND_OWNERSHIP returns correct URL', () => {
    session.set(constants.redisKeys.TEMP_LAND_OWNERSHIP_PROOF, { id: '12345' })
    const result = UPLOAD_LAND_OWNERSHIP.nextUrl(session)
    expect(result).toBe(`${constants.reusedRoutes.COMBINED_CASE_CHECK_PROOF_OF_OWNERSHIP}?id=12345`)
    expect(session.get(constants.redisKeys.TEMP_LAND_OWNERSHIP_PROOF)).toEqual({ id: '12345' })
  })

  test('CHECK_PROOF_OF_OWNERSHIP returns correct route based on session data', () => {
    session.set(constants.redisKeys.LAND_OWNERSHIP_CHECKED, 'no')
    let result = CHECK_PROOF_OF_OWNERSHIP.nextUrl(session)
    expect(result).toBe(constants.reusedRoutes.COMBINED_CASE_UPLOAD_LAND_OWNERSHIP)
    expect(session.get(constants.redisKeys.LAND_OWNERSHIP_CHECKED)).toBe('no')

    session.set(constants.redisKeys.LAND_OWNERSHIP_CHECKED, 'yes')
    result = CHECK_PROOF_OF_OWNERSHIP.nextUrl(session)
    expect(result).toBe(constants.reusedRoutes.COMBINED_CASE_LAND_OWNERSHIP_PROOF_LIST)
    expect(session.get(constants.redisKeys.LAND_OWNERSHIP_CHECKED)).toBe('yes')
  })

  test('LAND_OWNERSHIP_PROOF_LIST returns correct route or referrer URL', () => {
    session.set(constants.redisKeys.LAND_OWNERSHIP_PROOF_LIST_KEY, 'some_key')
    const result = LAND_OWNERSHIP_PROOF_LIST.nextUrl(session)
    expect(result).toBe(constants.routes.COMBINED_CASE_TASK_LIST)
    expect(session.get(constants.redisKeys.LAND_OWNERSHIP_PROOF_LIST_KEY)).toBe('some_key')
  })
})
