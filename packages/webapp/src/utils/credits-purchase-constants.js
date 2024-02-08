const creditPurchaseRoutes = {
  ESTIMATOR_CREDITS_INDIVIDUAL_ORG: '/credits-purchase/credits-individual-or-organisation'
}

const views = Object.fromEntries(
  Object.entries(creditPurchaseRoutes).map(([k, v]) => [k, v.substring(1)])
)

export default {
  creditPurchaseRoutes,
  views
}
