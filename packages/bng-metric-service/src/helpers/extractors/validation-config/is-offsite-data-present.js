const isOffsiteDataPresent = workbook => {
  const sheetName = 'Headline Results'
  const cells = ['H20', 'H21', 'H22', 'H24', 'H25', 'H26']
  const data = {}
  cells.forEach(item => {
    data[item] = workbook.Sheets[sheetName][item]?.v || 0
  })

  const hasBaseline = data.H20 > 0 || data.H21 > 0 || data.H22 > 0
  const hasPostIntevention = data.H24 > 0 || data.H25 > 0 || data.H26 > 0

  return hasBaseline && hasPostIntevention
}

export default isOffsiteDataPresent
