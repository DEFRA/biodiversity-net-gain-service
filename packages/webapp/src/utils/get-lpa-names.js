import fs from 'fs'

const getLpaNames = (file) => {
  const data = fs.readFileSync(file)

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
