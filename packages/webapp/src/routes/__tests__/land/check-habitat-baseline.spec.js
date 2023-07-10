import constants from '../../../utils/constants.js'
import checkHabitatBaseline from '../../land/check-habitat-baseline.js'
import applicationSession from '../../../__mocks__/application-session.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
const url = constants.routes.CHECK_HABITAT_BASELINE

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })

    it(`should render the ${url.substring(1)} view`, async () => {
      const session = applicationSession()
      const getHandler = checkHabitatBaseline[0].handler
      let viewArgs = ''
      const h = {
        view: (...args) => {
          viewArgs = args
        }
      }

      await getHandler({ yar: session }, h)
      expect(viewArgs[0]).toEqual(constants.views.CHECK_HABITAT_BASELINE)
      expect(viewArgs[1].habitatTypeAndCondition.length).toEqual(3)
      expect(viewArgs[1].habitatTypeAndCondition).toEqual(JSON.parse('[{"type":"Habitat","unitKey":"Area (hectares)","unit":"Area (ha)","header":"Broad habitat","description":"Habitat type","total":20.001,"items":[{"header":"Cropland","description":"Arable field margins tussocky","condition":"Condition Assessment N/A","amount":20.001}]},{"type":"Hedgerow","unitKey":"Length (km)","unit":"Length (km)","description":"Hedgerow type","total":40,"items":[{"description":"Native Species-rich native hedgerow with trees - associated with bank or ditch","condition":"Poor","amount":20},{"description":"Native hedgerow with trees - associated with bank or ditch","condition":"Poor","amount":20}]},{"type":"River","unitKey":"Length (km)","unit":"Length (km)","description":"Watercourse type","total":40,"items":[{"description":"Other Rivers and Streams","condition":"Fairly Poor","amount":20},{"description":"Priority Habitat","condition":"Poor","amount":20}]}]'))
    })
  })
  describe('POST', () => {
    it('Should continue journey to check habitat creation', async () => {
      const res = await submitPostRequest({ url })
      expect(res.headers.location).toEqual(constants.routes.CHECK_HABITAT_CREATED)
    })
  })
})
