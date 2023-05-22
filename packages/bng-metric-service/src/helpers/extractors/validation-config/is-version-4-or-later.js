const isVersion4OrLater = workbook => !!workbook.Sheets.Start?.D8?.v

export default isVersion4OrLater
