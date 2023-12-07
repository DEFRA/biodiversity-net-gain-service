import constants from '../../../utils/constants.js'
import checkHabitatCreated from '../../land/check-habitat-created.js'
import applicationSession from '../../../__mocks__/application-session.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
const url = constants.routes.CHECK_HABITAT_CREATED

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })

    it(`should render the ${url.substring(1)} view`, async () => {
      const session = applicationSession()
      const getHandler = checkHabitatCreated[0].handler
      let viewArgs = ''
      const h = {
        view: (...args) => {
          viewArgs = args
        }
      }

      await getHandler({ yar: session }, h)
      expect(viewArgs[0]).toEqual(constants.views.CHECK_HABITAT_CREATED)
      expect(viewArgs[1].combinedHabitatTypeAndCondition.length).toEqual(3)
      expect(viewArgs[1].combinedHabitatTypeAndCondition).toEqual(JSON.parse('[{"type":"Habitat","unitKey":"Area (hectares)","unit":"Area (ha)","header":"Broad habitat","description":"Proposed habitat","dataTestId":"habitatTotal","total":3.5,"items":[{"header":"Grassland","description":"Other neutral grassland","condition":"Fairly Good","amount":0.9},{"header":"Heathland and shrub","description":"Bramble scrub","condition":"Condition Assessment N/A","amount":0.1},{"header":"Wetland","description":"Lowland raised bog","condition":"Good","amount":1},{"header":"Woodland and forest","description":"Other woodland; mixed","condition":"Good","amount":0.5},{"header":"Grassland","description":"Modified grassland","condition":"Good","amount":1}]},{"type":"Hedgerow","unitKey":"Length (km)","unit":"Length (km)","description":"Habitat type","dataTestId":"hedgeTotal","total":0.6,"items":[{"description":"Native hedgerow with trees","condition":"Good","amount":0.3},{"description":"Native hedgerow - associated with bank or ditch","condition":"Moderate","amount":0.3}]},{"type":"Watercourse","unitKey":"Length (km)","unit":"Length (km)","description":"Watercourse type","dataTestId":"riverTotal","total":0.6,"items":[{"description":"Ditches","condition":"Fairly Good","amount":0.3},{"description":"Ditches","condition":"Good","amount":0.3}]}]'))
    })
  })
  describe('POST', () => {
    it('Should continue journey to check metric details', async () => {
      const res = await submitPostRequest({ url })
      expect(res.headers.location).toEqual(constants.routes.CHECK_METRIC_DETAILS)
    })
  })
})
