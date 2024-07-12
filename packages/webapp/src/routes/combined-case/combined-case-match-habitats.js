import constants from '../../utils/constants.js'
import getHabitatType from '../../utils/getHabitatType.js'
import mockMetricData from './mock-metric-data.js'

const keys = ['d2', 'd3', 'e2', 'e3', 'f2', 'f3']

const getNumberOfPages = (data) => keys.reduce((acc, key) => acc + data[key].slice(0, -1).length, 0)

const getHabitats = (data) => ({
  proposed: keys.flatMap(identifier =>
    data[identifier].filter(details => 'Condition' in details).map(details => ({
      habitatType: getHabitatType(identifier, details),
      area: details['Length (km)'] ?? details['Area (hectares)'],
      condition: details.Condition
    }))
  )
})

const handlers = {
  get: async (request, h) => {
    // const registrationMetricData = request.yar.get(constants.redisKeys.METRIC_DATA)
    // const allocationMetricData = request.yar.get(constants.redisKeys.DEVELOPER_METRIC_DATA)
    const { page = '1' } = request.query
    const currentPage = parseInt(page, 10)
    const numberOfPages = getNumberOfPages(mockMetricData)
    const habitatsData = getHabitats(mockMetricData)

    const safeCurrentPage = Math.max(1, Math.min(currentPage, numberOfPages))
    const habitat = habitatsData.proposed[safeCurrentPage - 1] || { habitatType: '', area: '', condition: '' }

    return h.view(constants.views.COMBINED_CASE_MATCH_HABITATS, {
      numberOfPages,
      currentPage: safeCurrentPage,
      habitatType: habitat.habitatType,
      area: habitat.area,
      condition: habitat.condition
    })
  },
  post: async (request, h) => {
    // Logic to handle form submission, potentially updating session state or database
    // Redirect to the next page based on the user's selection
    const { currentPage } = request.payload
    const nextPage = parseInt(currentPage, 10) + 1
    return h.redirect(`${constants.routes.COMBINED_CASE_MATCH_HABITATS}?page=${nextPage}`)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.COMBINED_CASE_MATCH_HABITATS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.COMBINED_CASE_MATCH_HABITATS,
  handler: handlers.post
}]
