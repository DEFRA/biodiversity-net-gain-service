import constants from '../../utils/constants.js'

// const numberOfPages = constants.redisKeys.METRIC_DATA.d1.length
// console.log('Number of objects in d1 array:', numberOfPages)

// Function to get the number of objects in d1 array from metric data
const getPageDetails = (metricData) => {
  const numberOfPages = metricData.d1.length
  console.log('Number of objects in d1 array:', numberOfPages)
  return numberOfPages
}

const handlers = {
  get: async (request, h) => {
    // Retrieve metric data from session
    const metricData = request.yar.get(constants.redisKeys.METRIC_DATA)
    // Get the number of pages from metric data
    const numberOfPages = getPageDetails(metricData)
    // Render the view with the number of pages data
    return h.view(constants.views.COMBINED_CASE_MATCH_HABITATS, { numberOfPages })
  },
  post: async (request, h) => {
    // Redirect for POST request
    return h.redirect(constants.routes.COMBINED_CASE_MATCH_HABITATS)
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
