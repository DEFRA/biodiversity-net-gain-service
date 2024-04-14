let habitatReferenceCounter = 0

const generateHabitatReference = () => `HAB-00000000-${habitatReferenceCounter++}`

const generateGainSiteNumber = () => 'BGS-123456789'

export {
  generateHabitatReference,
  generateGainSiteNumber
}
