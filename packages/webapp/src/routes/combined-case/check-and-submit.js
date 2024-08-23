import constants from '../../utils/constants.js'
import { getTaskList } from '../../journey-validation/task-list-generator.js'
import application from '../../utils/combined-case-application.js'
import getRegistrationDetails from '../../utils/get-land-check-and-submit-details.js'
import getDeveloperDetails from '../../utils/get-developer-check-and-submit-details.js'
import combinedCaseApplicationValidation from '../../utils/combined-case-application-validation.js'
import { postJson } from '../../utils/http.js'
import getOrganisationDetails from '../../utils/get-organisation-details.js'

const handlers = {
  get: (request, h) => {
    const combinedCaseAllocationHabitatsProcessing = request.yar.get(constants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS_PROCESSING)
    console.log('COMBINED_CASE_ALLOCATION_HABITATS_PROCESSING:', combinedCaseAllocationHabitatsProcessing)

    const matchedHabitatItems = (request) => {
      const habitats = request.yar.get(constants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS_PROCESSING) || []

      const groupedItems = {
        area: [],
        hedgerow: [],
        watercourse: []
      }

      let totalHabitatUnits = 0
      let totalHedgeUnits = 0
      let totalWatercourseUnits = 0

      habitats.forEach(item => {
        const habitatUnitsDelivered = item?.habitatUnitsDelivered || 0

        if (item?.state === 'Habitat') {
          groupedItems.area.push(item)
          totalHabitatUnits += habitatUnitsDelivered
        } else if (item?.state === 'Hedge') {
          groupedItems.hedgerow.push(item)
          totalHedgeUnits += habitatUnitsDelivered
        } else if (item?.state === 'Watercourse') {
          groupedItems.watercourse.push(item)
          totalWatercourseUnits += habitatUnitsDelivered
        }
      })

      const habitatItems = []

      const addItemsWithTotal = (items, total, totalLabel) => {
        items.forEach(item => {
          habitatItems.push([
            { text: item?.habitatType },
            { text: item?.condition },
            { text: `${item?.size} ${item?.measurementUnits}` },
            { text: `${item?.habitatUnitsDelivered.toFixed(1)} units` }
          ])
        })
        habitatItems.push([
          { text: totalLabel, colspan: 3 },
          { text: `${total.toFixed(1)} units` }
        ])
      }

      addItemsWithTotal(groupedItems.area, totalHabitatUnits, 'Total area units')
      addItemsWithTotal(groupedItems.hedgerow, totalHedgeUnits, 'Total hedgerow units')
      addItemsWithTotal(groupedItems.watercourse, totalWatercourseUnits, 'Total watercourse units')

      return habitatItems
    }

    const appSubmitted = request.yar.get(constants.redisKeys.COMBINED_CASE_APPLICATION_SUBMITTED)

    if (appSubmitted) {
      return h.redirect(constants.routes.MANAGE_BIODIVERSITY_GAINS)
    }

    const { canSubmit } = getTaskList(constants.applicationTypes.COMBINED_CASE, request.yar)

    if (!canSubmit) {
      return h.redirect(constants.routes.COMBINED_CASE_TASK_LIST)
    }

    const applicationDetails = application(request.yar, request.auth.credentials.account).combinedCase
    const claims = request.auth.credentials.account.idTokenClaims
    const { currentOrganisation } = getOrganisationDetails(claims)
    return h.view(
      constants.views.COMBINED_CASE_CHECK_AND_SUBMIT,
      {
        ...getRegistrationDetails(request, applicationDetails),
        ...getDeveloperDetails(request, request.yar, currentOrganisation),
        matchedHabitatItems: matchedHabitatItems(request)
      }
    )
  },
  post: async (request, h) => {
    const combinedCaseApplication = application(request.yar, request.auth.credentials.account)
    const applicationDetails = combinedCaseApplication.combinedCase

    if (request.payload.termsAndConditionsConfirmed !== 'Yes') {
      const claims = request.auth.credentials.account.idTokenClaims
      const { currentOrganisation } = getOrganisationDetails(claims)
      const err = [{
        text: 'You must confirm you have read the terms and conditions',
        href: '#termsAndConditionsConfirmed'
      }]
      return h.view(constants.views.COMBINED_CASE_CHECK_AND_SUBMIT,
        {
          ...getRegistrationDetails(request, applicationDetails),
          ...getDeveloperDetails(request, request.yar, currentOrganisation),
          err
        })
    }

    const { value, error } = combinedCaseApplicationValidation.validate(combinedCaseApplication)
    if (error) {
      throw new Error(error)
    }

    const result = await postJson(`${constants.AZURE_FUNCTION_APP_URL}/processcombinedcaseapplication`, value)
    request.yar.set(constants.redisKeys.COMBINED_CASE_APPLICATION_REFERENCE, result.applicationReference)
    return h.redirect(constants.routes.APPLICATION_SUBMITTED)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.COMBINED_CASE_CHECK_AND_SUBMIT,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.COMBINED_CASE_CHECK_AND_SUBMIT,
    handler: handlers.post
  }
]
