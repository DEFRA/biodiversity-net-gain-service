import constants from '../../utils/constants.js'
import { getTaskList } from '../../journey-validation/task-list-generator.js'
import application from '../../utils/combined-case-application.js'
import getRegistrationDetails from '../../utils/get-land-check-and-submit-details.js'
import getDeveloperDetails from '../../utils/get-developer-check-and-submit-details.js'
import combinedCaseApplicationValidation from '../../utils/combined-case-application-validation.js'
import { postJson } from '../../utils/http.js'
import getOrganisationDetails from '../../utils/get-organisation-details.js'

const displayUnitMap = {
  hectares: 'ha',
  kilometres: 'km'
}

const getMatchedHabitats = (habitats) => {
  if (!habitats) {
    return []
  }

  const habitatGroups = {
    habitat: [],
    hedgerow: [],
    watercourse: []
  }

  let totalHabitatUnits = 0
  let totalHedgeUnits = 0
  let totalWatercourseUnits = 0

  habitats.forEach(item => {
    const habitatUnitsDelivered = item?.habitatUnitsDelivered || 0

    if (item?.state === 'Habitat') {
      habitatGroups.habitat.push(item)
      totalHabitatUnits += habitatUnitsDelivered
    } else if (item?.state === 'Hedge') {
      habitatGroups.hedgerow.push(item)
      totalHedgeUnits += habitatUnitsDelivered
    } else if (item?.state === 'Watercourse') {
      habitatGroups.watercourse.push(item)
      totalWatercourseUnits += habitatUnitsDelivered
    }
  })

  const habitatDetails = []

  const addItemsWithTotal = (items = [], total, totalLabel, padFirstRow) => {
    items.forEach((item, index) => {
      const baseRow = index === 0 && padFirstRow ? { classes: 'table-extra-padding' } : {}
      habitatDetails.push([
        { text: item?.habitatType ?? '', ...baseRow },
        { html: item?.condition?.replace(/ /g, '&nbsp;') ?? '', ...baseRow },
        { html: `${item?.size ?? ''}&nbsp;${displayUnitMap[item?.measurementUnits] ?? item?.measurementUnits ?? ''}`, ...baseRow },
        { html: `${(item?.habitatUnitsDelivered ?? 0).toFixed(1)}&nbsp;units`, ...baseRow }
      ])
    })
    habitatDetails.push([
      { text: totalLabel, colspan: 3, classes: 'table-heavy-border' },
      { text: `${total.toFixed(1)} units`, classes: 'table-heavy-border' }
    ])
  }

  addItemsWithTotal(habitatGroups.habitat, totalHabitatUnits, 'Total habitat units', false)
  addItemsWithTotal(habitatGroups.hedgerow, totalHedgeUnits, 'Total hedgerow units', true)
  addItemsWithTotal(habitatGroups.watercourse, totalWatercourseUnits, 'Total watercourse units', true)

  return habitatDetails
}

const handlers = {
  get: (request, h) => {
    const habitats = request.yar.get(constants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS_PROCESSING)
    const matchedHabitats = getMatchedHabitats(habitats)

    const appSubmitted = request.yar.get(constants.redisKeys.COMBINED_CASE_APPLICATION_SUBMITTED)

    if (appSubmitted) {
      return h.redirect(constants.routes.MANAGE_BIODIVERSITY_GAINS)
    }

    const { canSubmit } = getTaskList(constants.applicationTypes.COMBINED_CASE, request.yar)

    if (!canSubmit) {
      return h.redirect(constants.routes.COMBINED_CASE_TASK_LIST)
    }

    const applicationDetails = application(request.yar, request.auth.credentials.account).combinedCase
    console.log('applicationDetails', JSON.stringify(applicationDetails, null, 2))
    const claims = request.auth.credentials.account.idTokenClaims
    const { currentOrganisation } = getOrganisationDetails(claims)

    return h.view(
      constants.views.COMBINED_CASE_CHECK_AND_SUBMIT,
      {
        ...getRegistrationDetails(request, applicationDetails),
        ...getDeveloperDetails(request, request.yar, currentOrganisation),
        matchedHabitats
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
    return h.redirect(constants.routes.COMBINED_CASE_CONFIRMATION)
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
