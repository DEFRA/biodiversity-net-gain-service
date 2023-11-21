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
      expect(viewArgs[1].habitatTypeAndCondition).toEqual(JSON.parse('[{"type":"Habitat","unitKey":"Area (hectares)","unit":"Area (ha)","header":"Broad habitat","description":"Habitat type","dataTestId":"habitatTotal","total":3.5,"items":[{"header":"Cropland","description":"Cereal crops","condition":"Condition Assessment N/A","amount":1},{"header":"Grassland","description":"Modified grassland","condition":"Moderate","amount":1},{"header":"Woodland and forest","description":"Other woodland; mixed","condition":"Poor","amount":0.5},{"header":"Grassland","description":"Modified grassland","condition":"Poor","amount":1}]},{"type":"Hedgerow","unitKey":"Length (km)","unit":"Length (km)","description":"Hedgerow type","dataTestId":"hedgeTotal","total":0.6,"items":[{"description":"Native hedgerow - associated with bank or ditch","condition":"Poor","amount":0.3},{"description":"Native hedgerow","condition":"Poor","amount":0.3}]},{"type":"River","unitKey":"Length (km)","unit":"Length (km)","description":"Watercourse type","dataTestId":"riverTotal","total":0.6,"items":[{"description":"Ditches","condition":"Poor","amount":0.3},{"description":"Ditches","condition":"Poor","amount":0.3}]}]'))
    })
  })
  describe('POST', () => {
    it('Should continue journey to check habitat creation', async () => {
      const res = await submitPostRequest({ url })
      expect(res.headers.location).toEqual(constants.routes.CHECK_HABITAT_CREATED)
    })
  })
})
