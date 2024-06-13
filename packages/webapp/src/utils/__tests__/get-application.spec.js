import constants from '../constants.js'
import creditsPurchaseConstants from '../credits-purchase-constants.js'
import { postJson } from '../http.js'
import Boom from '@hapi/boom'
import getOrganisationDetails from '../get-organisation-details.js'
import {
  getDevelopmentProject,
  getRegistration,
  getCreditsPurchase,
  getCombinedCase,
  getApplication
} from '../get-application.js'

jest.mock('../http.js')
jest.mock('../save-application-session-if-needed.js')
jest.mock('../get-organisation-details.js')

describe('getApplication', () => {
  const h = {
    redirect: jest.fn().mockReturnThis()
  }
  const request = {
    params: { path: 'some-path' },
    auth: {
      credentials: {
        account: {
          idTokenClaims: {
            contactId: 'contact-id',
            account: {
              idTokenClaims: {
                contactId: 'contact-id'
              }
            }
          }
        }
      }
    },
    yar: {
      set: jest.fn()
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should redirect to REGISTER_LAND_TASK_LIST for REGISTRATION application type', async () => {
    const session = { 'organisation-id': 'org-id' }
    getOrganisationDetails.mockReturnValue({ currentOrganisationId: 'org-id' })
    postJson.mockResolvedValue(session)

    await getRegistration(request, h)
    expect(h.redirect).toHaveBeenCalledWith(constants.routes.REGISTER_LAND_TASK_LIST)
  })

  it('should redirect to DEVELOPER_TASKLIST for ALLOCATION application type', async () => {
    const session = { 'organisation-id': 'org-id' }
    getOrganisationDetails.mockReturnValue({ currentOrganisationId: 'org-id' })
    postJson.mockResolvedValue(session)

    await getDevelopmentProject(request, h)
    expect(h.redirect).toHaveBeenCalledWith(constants.routes.DEVELOPER_TASKLIST)
  })

  it('should redirect to CREDITS_PURCHASE_TASK_LIST for CREDITS_PURCHASE application type', async () => {
    const session = { 'organisation-id': 'org-id' }
    getOrganisationDetails.mockReturnValue({ currentOrganisationId: 'org-id' })
    postJson.mockResolvedValue(session)

    await getCreditsPurchase(request, h)
    expect(h.redirect).toHaveBeenCalledWith(creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASK_LIST)
  })

  it('should redirect to REGISTER_LAND_TASK_LIST for COMBINED_CASE application type', async () => {
    const session = { 'organisation-id': 'org-id' }
    getOrganisationDetails.mockReturnValue({ currentOrganisationId: 'org-id' })
    postJson.mockResolvedValue(session)

    await getCombinedCase(request, h)
    expect(h.redirect).toHaveBeenCalledWith(constants.routes.REGISTER_LAND_TASK_LIST)
  })

  it('should handle missing session data', async () => {
    getOrganisationDetails.mockReturnValue({ currentOrganisationId: 'org-id' })
    postJson.mockResolvedValue({})

    await getRegistration(request, h)
    expect(h.redirect).toHaveBeenCalledWith(constants.routes.CANNOT_VIEW_APPLICATION)
  })

  it('should handle organisation error', async () => {
    getOrganisationDetails.mockReturnValue({ currentOrganisationId: 'different-org-id' })
    postJson.mockResolvedValue({ 'organisation-id': 'org-id' })

    await getRegistration(request, h)
    expect(h.redirect).toHaveBeenCalledWith(`${constants.routes.CANNOT_VIEW_APPLICATION}?orgError=true`)
  })

  it('should return bad request if application reference is missing', async () => {
    const badRequestResponse = Boom.badRequest('Application reference is missing')
    request.params.path = undefined

    const response = await getRegistration(request, h)
    expect(response).toEqual(badRequestResponse)
  })

  it('should redirect to / if application type is unknown', async () => {
    const session = { 'organisation-id': 'test-org-id' }
    postJson.mockResolvedValue(session)
    getOrganisationDetails.mockReturnValue({ currentOrganisationId: 'test-org-id' })

    const unknownApplicationType = 'UNKNOWN_TYPE'
    await getApplication(request, h, unknownApplicationType)

    expect(request.yar.set).toHaveBeenCalledWith(session)
    expect(h.redirect).toHaveBeenCalledWith('/')
  })
})
