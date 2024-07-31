import constants from '../../../utils/constants.js'

const url = '/combined-case/match-allocation'

describe(url, () => {
  describe('GET', () => {
    let viewResult
    const redisMap = new Map()
    it(`should render the ${url.substring(1)} view`, async () => {
      const checkMetricFile = require('../../combined-case/match-allocation.js')
      const request = {
        yar: redisMap
      }
      const h = {
        view: (view) => {
          viewResult = view
        }
      }
      await checkMetricFile.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.views.COMBINED_CASE_MATCH_AVAILABLE_HABITATS)
    })
  })

  describe('POST', () => {
    let redisMap
    beforeEach(() => {
      redisMap = new Map()
    })

    it('should redirect to tasklist', (done) => {
      jest.isolateModules(async () => {
        try {
          let viewResult
          const checkMetricFile = require('../../combined-case/match-allocation.js')
          const request = {
            yar: redisMap,
            payload: {}
          }
          const h = {
            redirect: (view) => {
              viewResult = view
            },
            view: (view) => {
              viewResult = view
            }
          }
          await checkMetricFile.default[1].handler(request, h)
          expect(viewResult).toEqual(constants.routes.COMBINED_CASE_TASK_LIST)
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
