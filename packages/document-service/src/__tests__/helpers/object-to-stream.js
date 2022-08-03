import { Readable } from 'stream'

const objectToStream = async object => {
  return bufferToStream(Buffer.from(typeof object === 'string' ? object : JSON.stringify(object)))
}

// Adapted from https://stackoverflow.com/questions/47089230/how-to-convert-buffer-to-stream-in-nodejs
const bufferToStream = buffer => {
  const readable = new Readable({
    read () {
      this.push(buffer)
      this.push(null)
    }
  })
  return readable
}

export default objectToStream
