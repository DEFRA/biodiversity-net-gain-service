import fs from 'fs'
// import data from './ref-data/lpas-names-and-ids.json'

const getLpaNames = () => {
  const data = fs.readFileSync('./src/utils/ref-data/lpas-names-and-ids.json')
  // const data = fs.readFileSync('./ref-data/lpas-names-and-ids.json')

  const lpaList = JSON.parse(data)
  const cleansedLpaList = []

  lpaList
    .filter(element => !!element.id)
    .forEach(element => {
      cleansedLpaList.push(element.name)
    })
  return cleansedLpaList
}

export default getLpaNames
