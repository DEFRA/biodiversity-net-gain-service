// Class to be used to mock the yar session value
class Session {
  constructor () {
    this.values = []
  }

  get (name) {
    return this.values[name]
  }

  set (name, value) {
    this.values[name] = value
  }

  reset () {
    this.values = []
  }
}

export default Session
