import constants from '../../utils/constants.js'
import mockMetricData from './mock-metric-data.js'

const getNumberOfPages = (mockMetricData) => {
  const keys = ['d2', 'd3', 'e2', 'e3', 'f2', 'f3']
  const numberOfPages = keys.reduce((acc, key) => acc + mockMetricData[key].slice(0, -1).length, 0)
  console.log('Number of pages:', numberOfPages)
  return numberOfPages
}

const getHabitatDetails = (metricData) => {
  const details = metricData.d2.slice(0, -1).map((item) => ({
    broadHabitat: item['Broad habitat'],
    habitatType: item['Proposed habitat'],
    area: item['Area (hectares)'],
    condition: item.Condition
  }))

  return {
    broadHabitat: details.map(detail => detail.broadHabitat),
    habitatType: details.map(detail => detail.habitatType),
    area: details.map(detail => detail.area),
    condition: details.map(detail => detail.condition)
  }
}

const handlers = {
  get: async (request, h) => {
    const metricData = request.yar.get(constants.redisKeys.METRIC_DATA)
    const currentPage = parseInt(request.query.page || '1', 10)
    const numberOfPages = getNumberOfPages(mockMetricData)
    console.log('Metric data:', metricData)
    const { broadHabitat, habitatType, area, condition } = getHabitatDetails(metricData)

    const safeCurrentPage = Math.max(1, Math.min(currentPage, numberOfPages))

    return h.view(constants.views.COMBINED_CASE_MATCH_HABITATS, {
      numberOfPages,
      currentPage: safeCurrentPage,
      broadHabitat: broadHabitat[safeCurrentPage - 1],
      habitatType: habitatType[safeCurrentPage - 1],
      area: area[safeCurrentPage - 1],
      condition: condition[safeCurrentPage - 1]
    })
  },
  post: async (request, h) => {
    // Logic to handle form submission, potentially updating session state or database
    // Redirect to the next page based on the user's selection
    const nextPage = parseInt(request.payload.currentPage, 10) + 1
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
