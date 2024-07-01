import { newApplication } from '../new-application.js'
import constants from '../constants.js'
import creditsPurchaseConstants from '../credits-purchase-constants.js'
import saveApplicationSessionIfNeeded from '../save-application-session-if-needed.js'

jest.mock('../save-application-session-if-needed.js')

describe('newApplication', () => {
  let request, h

  beforeEach(() => {
    request = {
      yar: {
        set: jest.fn()
      }
    }
    h = {
      redirect: jest.fn()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should save application session and set application type', async () => {
    await newApplication(request, h, constants.applicationTypes.ALLOCATION)

    expect(saveApplicationSessionIfNeeded).toHaveBeenCalledWith(request.yar, true)
    expect(request.yar.set).toHaveBeenCalledWith(constants.redisKeys.APPLICATION_TYPE, constants.applicationTypes.ALLOCATION)
  })

  it('should redirect to REGISTER_LAND_TASK_LIST for REGISTRATION application type', async () => {
    await newApplication(request, h, constants.applicationTypes.REGISTRATION)

    expect(h.redirect).toHaveBeenCalledWith(constants.routes.REGISTER_LAND_TASK_LIST)
  })

  it('should redirect to DEVELOPER_TASKLIST for ALLOCATION application type', async () => {
    await newApplication(request, h, constants.applicationTypes.ALLOCATION)

    expect(h.redirect).toHaveBeenCalledWith(constants.routes.DEVELOPER_TASKLIST)
  })

  it('should redirect to CREDITS_PURCHASE_TASK_LIST for CREDITS_PURCHASE application type', async () => {
    await newApplication(request, h, constants.applicationTypes.CREDITS_PURCHASE)

    expect(h.redirect).toHaveBeenCalledWith(creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASK_LIST)
  })

  it('should redirect to COMBINED_CASE_TASK_LIST for COMBINED_CASE application type', async () => {
    await newApplication(request, h, constants.applicationTypes.COMBINED_CASE)

    expect(h.redirect).toHaveBeenCalledWith(constants.routes.COMBINED_CASE_TASK_LIST)
  })

  it('should redirect to root for unknown application type', async () => {
    await newApplication(request, h, 'unknown')

    expect(h.redirect).toHaveBeenCalledWith('/')
  })
})
