import { promises as fs } from 'fs'

const getLpaNames = async (file) => {
  try {
    const data = await fs.readFile(file, 'binary')
    const lpaList = JSON.parse(Buffer.from(data))

    const cleansedLpaList = []

    lpaList.forEach(element => cleansedLpaList.push(element.name))
    return cleansedLpaList
  } catch (err) {
    throw new Error('Error processing LPA file - ', err)
  }
}

export default getLpaNames
