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
      expect(viewArgs[1].combinedHabitatTypeAndCondition).toEqual(JSON.parse('[{"type":"Habitat","unitKey":"Area (hectares)","unit":"Area (ha)","header":"Broad habitat","description":"Proposed habitat","dataTestId":"habitatTotal","total":20.001,"items":[{"header":"Wetland","description":"Fens (upland and lowland)","condition":"Moderate","amount":0.529},{"header":"Wetland","description":"Lowland raised bog","condition":"Good","amount":19.472}]},{"type":"Hedgerow","unitKey":"Length (km)","unit":"Length (km)","description":"Habitat type","dataTestId":"hedgeTotal","total":24,"items":[{"description":"Native species-rich hedgerow with trees","condition":"Moderate","amount":20},{"description":"Native Species-rich native hedgerow with trees - associated with bank or ditch","condition":"Good","amount":2},{"description":"Native hedgerow with trees - associated with bank or ditch","condition":"Good","amount":2}]},{"type":"River","unitKey":"Length (km)","unit":"Length (km)","description":"Watercourse type","dataTestId":"riverTotal","total":45,"items":[{"description":"Other Rivers and Streams","condition":"Fairly Good","amount":5},{"description":"Other Rivers and Streams","condition":"Fairly Good","amount":20},{"description":"Priority Habitat","condition":"Fairly Good","amount":20}]}]'))
    })
  })
  describe('POST', () => {
    it('Should continue journey to check metric details', async () => {
      const res = await submitPostRequest({ url })
      expect(res.headers.location).toEqual(constants.routes.CHECK_METRIC_DETAILS)
    })
  })
})
