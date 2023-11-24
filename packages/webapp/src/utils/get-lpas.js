import allLPAs from './ref-data/lpas-names-and-ids.js'

function getLpaNamesAndCodes () {
  return [...allLPAs]
}

const getLpaNames = () => {
  return allLPAs.map(lpa => lpa.name)
}

export { getLpaNamesAndCodes, getLpaNames }
