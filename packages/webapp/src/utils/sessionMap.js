class SessionMap extends Map {
  clear (key) {
    if (key !== undefined) {
      if (this.has(key)) {
        this.delete(key)
      } else {
        console.log(`Key "${key}" not found in the map.`)
      }
    } else {
      console.warn('No key provided to delete.')
    }
  }

  originalClear () {
    super.clear()
  }
}

export { SessionMap }
