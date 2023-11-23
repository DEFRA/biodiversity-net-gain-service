import * as fs from 'fs'
let lpaList = null

const readLPAs = (filePathAndName) => {
  if (!lpaList) {
    try {
      const data = fs.readFileSync(filePathAndName, 'binary')
      lpaList = JSON.parse(Buffer.from(data))
    } catch (err) {
      throw new Error('Error processing LPA file - ', err)
    }
  }
}

const getLpaNamesAndCodes = (filePathAndName) => {
  readLPAs(filePathAndName)
  return [...lpaList]
}

const getLpaNames = (filePathAndName) => {
  readLPAs(filePathAndName)
  return lpaList.map(lpa => lpa.name)
}

export { getLpaNamesAndCodes, getLpaNames }
