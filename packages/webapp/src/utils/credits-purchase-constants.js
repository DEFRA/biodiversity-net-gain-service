const routes = {
  ESTIMATOR_CREDITS_INDIVIDUAL_ORG: '/credits-purchase/applying-individual-organisation'
}

const views = Object.fromEntries(
  Object.entries(routes).map(([k, v]) => [k, v.substring(1)])
)

export default {
  routes,
  views
}
