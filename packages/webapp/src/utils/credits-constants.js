// Routes constants
const ESTIMATOR_CREDITS_COST = 'credits-estimation/credits-cost'
const ESTIMATOR_CREDITS_TIER = 'credits-estimation/credits-tier'
const ESTIMATOR_CREDITS_INDIVIDUAL_OR_ORG = 'credits-estimation/credits-individual-or-organisation'
const ESTIMATOR_CREDITS_APPLICANT_CONFIRM = 'credits-estimation/credits-applicant-details-confirm'
const ESTIMATOR_CREDITS_DEFRA_ACCOUNT_NOT_LINKED = 'credits-estimation/defra-account-not-linked'
// ./Routes constants

// RedisKeys constants
const ESTIMATOR_CREDITS_CALCULATION = 'estimator-credits-calculation'
const ESTIMATOR_CREDITS_USER_TYPE = 'estimator-credits-user-type'
// ./RedisKeys constants

// Other constants
const CREDITS_ESTIMATION_PATH = '/credits-estimation'
// ./Other constants

export default {
  routes: {
    ESTIMATOR_CREDITS_COST,
    ESTIMATOR_CREDITS_TIER,
    ESTIMATOR_CREDITS_INDIVIDUAL_OR_ORG,
    ESTIMATOR_CREDITS_APPLICANT_CONFIRM,
    ESTIMATOR_CREDITS_DEFRA_ACCOUNT_NOT_LINKED
  },
  redisKeys: {
    ESTIMATOR_CREDITS_CALCULATION,
    ESTIMATOR_CREDITS_USER_TYPE
  },
  CREDITS_ESTIMATION_PATH
}
