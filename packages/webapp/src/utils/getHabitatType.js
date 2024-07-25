const getHabitatType = (identifier, details) => {
  switch (identifier) {
    case 'd1':
      return `${details['Broad habitat']} - ${details['Habitat type']}`
    case 'd2':
      return `${details['Broad habitat']} - ${details['Proposed habitat']}`
    case 'd3':
      return `${details['Proposed Broad Habitat']} - ${details['Proposed habitat']}`
    case 'e1':
      return details['Habitat type']
    case 'e2':
      return details['Habitat type']
    case 'e3':
      return details['Proposed habitat']
    case 'f1':
      return details['Watercourse type']
    case 'f2':
      return details['Watercourse type']
    case 'f3':
      return details['Proposed habitat']
  }
}

export default getHabitatType
