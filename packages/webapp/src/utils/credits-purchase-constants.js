const PURCHASE_CREDITS_INDIVIDUAL_MIDDLE_NAME = 'credits-purchase/individual-middle-name'
const PURCHASE_CREDITS_INDIVIDUAL_DOB = 'credits-purchase/individual-dob'
const PURCHASE_CREDITS_INDIVIDUAL_NATIONALITY = 'credits-purchase/individual-nationality'
const PURCHASE_CREDITS_INDIVIDUAL_ORG = 'credits-purchase/applying-individual-organisation'

export default {
  redisKeys: {
    PURCHASE_CREDITS_INDIVIDUAL_MIDDLE_NAME: 'credits_purchase_individual_middle_name',
    PURCHASE_CREDITS_INDIVIDUAL_DOB: 'credits_purchase_individual_dob',
    PURCHASE_CREDITS_INDIVIDUAL_NATIONALITY: 'credits_purchase_individual_nationality'
  },
  routes: {
    PURCHASE_CREDITS_INDIVIDUAL_MIDDLE_NAME,
    PURCHASE_CREDITS_INDIVIDUAL_DOB,
    PURCHASE_CREDITS_INDIVIDUAL_NATIONALITY,
    PURCHASE_CREDITS_INDIVIDUAL_ORG
  },
  uploadTypes: {},
  setCreditsReferer: [],
  clearCreditsReferer: []
}
