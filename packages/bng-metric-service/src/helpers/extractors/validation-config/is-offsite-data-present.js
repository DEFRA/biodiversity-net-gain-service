const isOffsiteDataPresent = workbook => {
  const sheetName = 'Headline Results'
  const cells = ['H20', 'H21', 'H22', 'H24', 'H25', 'H26']
  const data = {}
  cells.forEach(item => {
    data[item] = workbook.Sheets[sheetName][item]?.v || 0
  })

  return (data.H20 + data.H21 + data.H22 > 0) && (data.H24 + data.H25 + data.H26 > 0)
}

export default isOffsiteDataPresent
