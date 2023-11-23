const AGENT_ACTING_FOR_CLIENT = 'applicant/agent-acting-for-client'

// Route constants used by two or more journeys that have a common view and route
// handlers. Each route has journey specufic URLs.
// Each constant specifies the location of the file containing the route definition.
// Unlike unshared route definitions, the location of the file does NOT correspond to
// the runtime URL associated with the route. The definition of each common route
// is responsible for associating the common view and route handlers with runtime URLs
// for two or more journeys.

// EXAMPLE
// The registration and allocation journeys need to capture if an application is being made
// by an agent.
// The common view is defined in ../views/applicant/agent-acting-for-client.html
// The common route definition is defined in ../routes/applicant/agent-acting-for-client.js.
// The constant in this file is used to register the common view and route definition using
// the same mechanism as unshared routes.
// ./loj-constants.js and ./developer-contants.js use the AGENT_ACTING_FOR CLIENT constant to
// define journey specific constants associated with the following runtime URLs:
// - /land/agent-acting-for-client
// - /developer/agent-acting-for-client
// The journey specific constants are used to associate the common view and route handlers with
// the journey specific URLs.
const routes = Object.freeze({
  AGENT_ACTING_FOR_CLIENT
})

export default routes
