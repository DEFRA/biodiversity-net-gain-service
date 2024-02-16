import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import credisPurchaseOrder from '../../credits-purchase/credits-purchase-order.js'
import Session from '../../../__mocks__/session.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.CREDITS_PURCHASE_ORDER
const postHandler = credisPurchaseOrder[1].handler

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url} view`, async () => {
      await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    let postOptions
    beforeEach(() => {
      postOptions = {
        url,
        payload: {}
      }
    })

    it('should store option value if any option is selected', done => {
      const purchaseOrderNumber = 'Test123'
      const payload = { willPOInUse: 'yes', purchaseOrderNumber }
      processCreditsPurchaseOrder(payload, done)
    })

    it('should display an error if no one option is selected', async () => {
      postOptions.payload = { willPOInUse: undefined, purchaseOrderNumber: undefined }
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('Select yes if you will be using a purchase order')
    })

    it('should display an error if option `Yes` is selected and purchase order number is blank', async () => {
      postOptions.payload = { willPOInUse: 'yes', purchaseOrderNumber: undefined }
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('Purchase order number cannot be left blank')
    })

    it('should navigate to next page if option `No` is selected', done => {
      const payload = { willPOInUse: 'no', purchaseOrderNumber: undefined }
      processCreditsPurchaseOrder(payload, done)
    })
  })
})

const processCreditsPurchaseOrder = (payload, done) => jest.isolateModules(async () => {
  try {
    const session = new Session()
    session.set(constants.redisKeys.CREDITS_PURCHASE_ORDER_NUMBER, payload.purchaseOrderNumber)
    let viewArgs = ''
    let redirectArgs = ''
    const h = {
      view: (...args) => {
        viewArgs = args
      },
      redirect: (...args) => {
        redirectArgs = args
      }
    }

    await postHandler({ payload, yar: session }, h)
    expect(viewArgs).toEqual('')
    expect(redirectArgs[0]).toEqual(constants.routes.CREDITS_APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION)
    done()
  } catch (err) {
    done(err)
  }
})
