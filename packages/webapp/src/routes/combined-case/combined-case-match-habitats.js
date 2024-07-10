import constants from '../../utils/constants.js'

// Function to get the number of objects in d1 array from metric data
const getNumberOfPages = (metricData) => {
  const numberOfPages = metricData.d1.length - 1
  console.log('Number of objects in d1 array:', numberOfPages)
  return numberOfPages
}

// Function to get the required habitat info from metric data
// const getHabitats = (metricData) => {
//   const habitats = metricData.d1.slice(0, -1).map((item) => ({
//     broadHabitat: item['Broad habitat'],
//     habitatType: item['Habitat type'],
//     area: item['Area (hectares)'],
//     condition: item.Condition
//   }))
//   console.log('Habitats:', habitats)
//   return habitats
// }

// // Function to get the broad habitat info from metric data
// const getBroadHabitat = (metricData) => {
//   const broadHabitat = metricData.d1.slice(0, -1).map((item) => item['Broad habitat'])
//   console.log('Broad habitat:', broadHabitat)
//   return broadHabitat
// }

// // Function to get the habitat type info from metric data
// const getHabitatType = (metricData) => {
//   const habitatType = metricData.d1.slice(0, -1).map((item) => item['Habitat type'])
//   console.log('Habitat type:', habitatType)
//   return habitatType
// }

// // Function to get the area from metric data
// const getArea = (metricData) => {
//   const area = metricData.d1.slice(0, -1).map((item) => item['Area (hectares)'])
//   console.log('Area:', area)
//   return area
// }

// // Function to get the condition from metric data
// const getCondition = (metricData) => {
//   const condition = metricData.d1.slice(0, -1).map((item) => item.Condition)
//   console.log('Condition:', condition)
//   return condition
// }

// Function to get detailed habitat information from metric data
const getHabitatDetails = (metricData) => {
  const details = metricData.d1.slice(0, -1).map((item) => ({
    broadHabitat: item['Broad habitat'],
    habitatType: item['Habitat type'],
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
    console.log('Metric data:', metricData)
    const numberOfPages = getNumberOfPages(metricData)
    const { broadHabitat, habitatType, area, condition } = getHabitatDetails(metricData)
    return h.view(constants.views.COMBINED_CASE_MATCH_HABITATS, { numberOfPages, broadHabitat, habitatType, area, condition })
  },
  post: async (request, h) => {
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
