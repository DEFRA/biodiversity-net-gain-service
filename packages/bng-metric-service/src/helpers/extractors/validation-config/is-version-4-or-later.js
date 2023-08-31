const isVersion4OrLater = workbook => {
  const version = parseFloat(workbook.Sheets.Start?.D8?.v)
  return version >= 4.1
}

export default isVersion4OrLater
