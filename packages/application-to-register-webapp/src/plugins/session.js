// TODO: add configuration to config object
import Yar from '@hapi/yar'

const session = {
  plugin: Yar,
  options: {
    cookieOptions: {
      password: 'thisisthecookiepasswordforsession',
      isSecure: false,
      isHttpOnly: true
    },
    maxCookieSize: 1024 // set this to 0 to force session storage to cache when installed
  }
}

export default session
