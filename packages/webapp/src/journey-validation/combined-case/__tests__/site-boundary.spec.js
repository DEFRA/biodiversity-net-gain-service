import constants from '../../../utils/constants'
import { siteBoundaryRouteDefinitions } from '../site-boundary.js'
import { FormError } from '../../../utils/form-error.js'

const [
  UPLOAD_LAND_BOUNDARY,
  CHECK_LAND_BOUNDARY,
  ADD_GRID_REFERENCE,
  ADD_HECTARES,
  CHECK_LAND_BOUNDARY_DETAILS
] = siteBoundaryRouteDefinitions

describe('Route Definitions', () => {
  let session

  beforeEach(() => {
    session = new Map()
  })

  test('UPLOAD_LAND_BOUNDARY returns correct URL', () => {
    const result = UPLOAD_LAND_BOUNDARY.nextUrl(session)
    expect(result).toBe(constants.reusedRoutes.COMBINED_CASE_CHECK_LAND_BOUNDARY)
  })

  test('CHECK_LAND_BOUNDARY returns correct route based on session data', () => {
    session.set(constants.redisKeys.LAND_BOUNDARY_CHECKED, 'no')
    let result = CHECK_LAND_BOUNDARY.nextUrl(session)
    expect(result).toBe(constants.reusedRoutes.COMBINED_CASE_UPLOAD_LAND_BOUNDARY)

    session.set(constants.redisKeys.LAND_BOUNDARY_CHECKED, 'yes')
    session.set(constants.redisKeys.LAND_BOUNDARY_GRID_REFERENCE, 'grid_ref')
    result = CHECK_LAND_BOUNDARY.nextUrl(session)
    expect(result).toBe('/combined-case/add-grid-reference')

    session.set(constants.redisKeys.LAND_BOUNDARY_GRID_REFERENCE, null)
    result = CHECK_LAND_BOUNDARY.nextUrl(session)
    expect(result).toBe(constants.reusedRoutes.COMBINED_CASE_ADD_GRID_REFERENCE)

    session.set(constants.redisKeys.LAND_BOUNDARY_CHECKED, 'invalid_value')
    expect(() => CHECK_LAND_BOUNDARY.nextUrl(session)).toThrow(FormError)
  })

  test('ADD_GRID_REFERENCE returns correct route based on session data', () => {
    session.set(constants.redisKeys.LAND_BOUNDARY_HECTARES, 'hectares')
    let result = ADD_GRID_REFERENCE.nextUrl(session)
    expect(result).toBe('/combined-case/add-hectares')

    session.set(constants.redisKeys.LAND_BOUNDARY_HECTARES, null)
    result = ADD_GRID_REFERENCE.nextUrl(session)
    expect(result).toBe(constants.reusedRoutes.COMBINED_CASE_ADD_HECTARES)
  })

  test('ADD_HECTARES returns correct route based on session data', () => {
    let result = ADD_HECTARES.nextUrl(session)
    expect(result).toBe('/combined-case/check-land-boundary-details')

    result = ADD_HECTARES.nextUrl(session)
    expect(result).toBe(constants.reusedRoutes.COMBINED_CASE_CHECK_LAND_BOUNDARY_DETAILS)
  })

  test('CHECK_LAND_BOUNDARY_DETAILS returns correct URL', () => {
    const result = CHECK_LAND_BOUNDARY_DETAILS.nextUrl(session)
    expect(result).toBe(constants.routes.COMBINED_CASE_TASK_LIST)
  })
})
