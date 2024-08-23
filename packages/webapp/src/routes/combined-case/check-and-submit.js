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

      let totalHabitatUnits = 0
      let totalHedgeUnits = 0
      let totalWatercourseUnits = 0

      const habitatItems = habitats.map(habitat => {
        const habitatUnitsDelivered = habitat.habitatUnitsDelivered || 0

        if (habitat.state === 'Habitat') {
          totalHabitatUnits += habitatUnitsDelivered
        } else if (habitat.state === 'Hedge') {
          totalHedgeUnits += habitatUnitsDelivered
        } else if (habitat.state === 'Watercourse') {
          totalWatercourseUnits += habitatUnitsDelivered
        }

        return [
          {
            text: habitat?.habitatType
          },
          {
            text: habitat?.condition
          },
          {
            text: `${habitat?.size} ${habitat?.measurementUnits}`
          },
          {
            text: habitat?.habitatUnitsDelivered
          }
        ]
      })

      if (totalHabitatUnits > 0) {
        habitatItems.push([
          { text: 'Total area units', colspan: 3 },
          { text: totalHabitatUnits }
        ])
      }

      if (totalHedgeUnits > 0) {
        habitatItems.push([
          { text: 'Total hedgerow units', colspan: 3 },
          { text: totalHedgeUnits }
        ])
      }

      if (totalWatercourseUnits > 0) {
        habitatItems.push([
          { text: 'Total watercourse units', colspan: 3 },
          { text: totalWatercourseUnits }
        ])
      }

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
