import { submitGetRequest } from '../helpers/server.js'
import creditsPurchaseConstants from '../../../utils/credits-purchase-constants.js'

const url = creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASK_LIST

describe(url, () => {
  describe('GET', () => {
    let getOptions
    beforeEach(() => {
      getOptions = {
        url
      }
    })
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
    it('should render view with no completed task', async () => {
      let viewResult, contextResult
      const h = {
        view: (view, context) => {
          viewResult = view
          contextResult = context
        }
      }
      const redisMap = new Map()
      const request = {
        yar: redisMap
      }

      const developerTasklist = require('../../../routes/credits-purchase/tasklist')
      await developerTasklist.default[0].handler(request, h)

      const response = await submitGetRequest(getOptions)
      expect(response.statusCode).toBe(200)
      expect(viewResult).toEqual('credits-purchase/tasklist')
      expect(contextResult.tasks.taskList.length).toEqual(6)
      expect(contextResult.tasks.taskList[0]).toEqual({
        taskTitle: 'Statutory biodiversity metric',
        tasks: [
          {
            title: 'Upload statutory biodiversity metric',
            status: 'NOT STARTED',
            url: creditsPurchaseConstants.routes.CREDITS_PURCHASE_UPLOAD_METRIC,
            id: 'upload-metric'
          }
        ]
      })
      expect(contextResult.tasks.taskList[1]).toEqual({
        taskTitle: 'Statutory biodiversity credits',
        tasks: [
          {
            title: 'Add statutory biodiversity credits',
            status: 'NOT STARTED',
            url: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CREDITS_SELECTION,
            id: 'add-credits'
          }
        ]
      })
      expect(contextResult.tasks.taskList[2]).toEqual({
        taskTitle: 'Purchase order',
        tasks: [
          {
            title: 'Add a purchase order number',
            status: 'NOT STARTED',
            url: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_PURCHASE_ORDER,
            id: 'add-purchase-order'
          }
        ]
      })
      expect(contextResult.tasks.taskList[3]).toEqual({
        taskTitle: 'Customer due diligence (CDD)',
        tasks: [
          {
            title: 'Complete customer due diligence',
            status: 'NOT STARTED',
            url: creditsPurchaseConstants.routes.CREDITS_PURCHASE_INDIVIDUAL_OR_ORG,
            id: 'customer-due-diligence'
          }
        ]
      })
      expect(contextResult.tasks.taskList[4]).toEqual({
        taskTitle: 'Terms and conditions',
        tasks: [
          {
            title: 'Accept terms and conditions',
            status: 'NOT STARTED',
            url: creditsPurchaseConstants.routes.CREDITS_PURCHASE_TERMS_AND_CONDITIONS,
            id: 'terms-and-conditions'
          }
        ]
      })
    })
  })
})
