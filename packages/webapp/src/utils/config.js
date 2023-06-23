export const SERVER_PORT = process.env.PORT || 3000
export const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1'
export const REDIS_PORT = process.env.REDIS_PORT || '6379'
export const REDIS_TLS = process.env.REDIS_TLS || false
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || ''
export const SESSION_COOKIE_PASSWORD = process.env.SESSION_COOKIE_PASSWORD || 'the-password-must-be-at-least-32-characters-long'
export const KEEP_ALIVE_TIMEOUT_MS = process.env.KEEP_ALIVE_TIMEOUT_MS || undefined

// DefraId Config
export const DEFRA_ID_POLICY_ID = process.env.DEFRA_ID_POLICY_ID
export const DEFRA_ID_SERVICE_ID = process.env.DEFRA_ID_SERVICE_ID
export const DEFRA_ID_INSTANCE = process.env.DEFRA_ID_INSTANCE
export const DEFRA_ID_DOMAIN = process.env.DEFRA_ID_DOMAIN
export const DEFRA_ID_CLIENT_SECRET = process.env.DEFRA_ID_CLIENT_SECRET
export const DEFRA_ID_CLIENT_ID = process.env.DEFRA_ID_CLIENT_ID