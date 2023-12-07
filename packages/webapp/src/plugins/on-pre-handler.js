import constants from '../utils/constants.js'
import getOrganisationDetails from '../utils/get-organisation-details.js'

const onPostAuthHandler = {
  plugin: {
    name: 'on-pre-handler',
    register: (server, _options) => {
      server.ext('onPreHandler', async function (request, h) {
        // Ignore public asset requests
        if (!request.path.includes('/public/')) {
          if (request.auth?.credentials && Object.keys(request.yar._store).length > 0) {
            // Ensure login matches session
            const { contactId } = request.auth.credentials.account.idTokenClaims
            const { currentOrganisationId: organisationId } = getOrganisationDetails(request.auth.credentials.account.idTokenClaims)
            const sessionOrganisationId = request.yar.get(constants.redisKeys.ORGANISATION_ID) || undefined
            if (contactId !== request.yar.get(constants.redisKeys.CONTACT_ID)) {
              return h.redirect(constants.routes.CANNOT_VIEW_APPLICATION).takeover()
            }
            if (organisationId !== sessionOrganisationId) {
              return h.redirect(`${constants.routes.CANNOT_VIEW_APPLICATION}?orgError=true`).takeover()
            }
          }
          // Do not allow users to change the application type part way through a journey without using the dashboards.
          const applicationType = request.yar.get(constants.redisKeys.APPLICATION_TYPE)
          if (isBlockedDeveloperJourneyRouteOnLandownerJourney(request.path, applicationType) ||
              isBlockedCreditsEstimationRouteOnLandownerJourney(request.path, applicationType)) {
            return h.redirect(constants.routes.REGISTER_LAND_TASK_LIST).takeover()
          } else if (isBlockedLandownerJourneyRouteOnDeveloperJourney(request.path, applicationType) ||
                    isBlockedCreditsEstimationRouteOnDeveloperJourney(request.path, applicationType)) {
            return h.redirect(constants.routes.DEVELOPER_TASKLIST).takeover()
          }
        }
        return h.continue
      })
    }
  }
}

const isBlockedDeveloperJourneyRouteOnLandownerJourney = (path, applicationType) => {
  return applicationType === constants.applicationTypes.REGISTRATION &&
         path.startsWith('/developer') &&
         !path.startsWith(constants.routes.DEVELOPER_NEW_DEVELOPMENT_PROJECT) &&
         !path.startsWith(constants.routes.DEVELOPER_CONTINUE_DEVELOPMENT_PROJECT) &&
         path !== constants.routes.DEVELOPER_DEVELOPMENT_PROJECTS &&
         path !== constants.routes.DEVELOPER_TASKLIST
}

const isBlockedLandownerJourneyRouteOnDeveloperJourney = (path, applicationType) => {
  return applicationType === constants.applicationTypes.ALLOCATION &&
         path.startsWith('/land') &&
         !path.startsWith(constants.routes.NEW_REGISTRATION) &&
         !path.startsWith(constants.routes.CONTINUE_REGISTRATION) &&
         path !== constants.routes.BIODIVERSITY_GAIN_SITES &&
         path !== constants.routes.REGISTER_LAND_TASK_LIST
}

const isBlockedCreditsEstimationRouteOnDeveloperJourney = (path, applicationType) => {
  return applicationType === constants.applicationTypes.ALLOCATION &&
         path.startsWith(constants.creditsEstimationPath)
}

const isBlockedCreditsEstimationRouteOnLandownerJourney = (path, applicationType) => {
  return applicationType === constants.applicationTypes.REGISTRATION &&
         path.startsWith(constants.creditsEstimationPath)
}
export default onPostAuthHandler
