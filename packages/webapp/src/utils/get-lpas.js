import * as fs from 'fs'
const filePathAndName = './src/utils/ref-data/lpas-names-and-ids.json'
let lpaList
let cleansedLpaList

try {
  const data = fs.readFileSync(filePathAndName, 'binary')
  lpaList = JSON.parse(Buffer.from(data))
  cleansedLpaList = lpaList.map(lpa => lpa.name)
} catch (err) {
  throw new Error('Error processing LPA file - ', err)
}

const getLpaNamesAndCodes = () => ([...lpaList])
const getLpaNames = () => ([...cleansedLpaList])

export { getLpaNamesAndCodes, getLpaNames }
