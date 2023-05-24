const isMetricWorkbook = workbook => {
  // Simple check to see if workbook is metric
  return !!workbook.Sheets.Start &&
    !!workbook.Sheets['Main Menu'] &&
    !!workbook.Sheets.Results &&
    !!workbook.Sheets['Headline Results']
}

export default isMetricWorkbook
