export const SERVER_PORT = process.env.PORT || 3000
export const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1'
export const REDIS_PORT = process.env.REDIS_PORT || '6379'
export const REDIS_TLS = process.env.REDIS_TLS || false
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || ''
export const SESSION_COOKIE_PASSWORD = process.env.SESSION_COOKIE_PASSWORD || 'the-password-must-be-at-least-32-characters-long'
export const COOKIE_IS_SECURE = process.env.COOKIE_IS_SECURE ? JSON.parse(process.env.COOKIE_IS_SECURE) : false
export const KEEP_ALIVE_TIMEOUT_MS = process.env.KEEP_ALIVE_TIMEOUT_MS || undefined
export const AZURE_FUNCTION_APP_URL = process.env.AZURE_FUNCTION_APP_URL || 'http://localhost:7071/api'
export const NODE_ENV = process.env.NODE_ENV
export const IS_PRODUCTION = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prd'
export const SERVICE_HOME_URL = process.env.SERVICE_HOME_URL || 'http://localhost:3000'

// DefraId Config
export const DEFRA_ID = {
  DEFRA_ID_SESSION_COOKIE_PASSWORD: process.env.DEFRA_ID_SESSION_COOKIE_PASSWORD || 'the-password-must-be-at-least-32-characters-long',
  DEFRA_ID_POLICY_ID: process.env.DEFRA_ID_POLICY_ID,
  DEFRA_ID_SERVICE_ID: process.env.DEFRA_ID_SERVICE_ID,
  DEFRA_ID_INSTANCE: process.env.DEFRA_ID_INSTANCE,
  DEFRA_ID_DOMAIN: process.env.DEFRA_ID_DOMAIN,
  DEFRA_ID_CLIENT_SECRET: process.env.DEFRA_ID_CLIENT_SECRET,
  DEFRA_ID_CLIENT_ID: process.env.DEFRA_ID_CLIENT_ID,
  DEFRA_ID_REDIRECT_URI: process.env.DEFRA_ID_REDIRECT_URI || 'http://localhost:3000/signin/callback',
  DEFRA_ID_MOCK: process.env.DEFRA_ID_MOCK ? JSON.parse(process.env.DEFRA_ID_MOCK) : false
}
export const BACS_ACCOUNT_NAME = process.env.BACS_ACCOUNT_NAME || 'Natural England'
export const BACS_SORT_CODE = process.env.BACS_SORT_CODE || '123456'
export const BACS_ACCOUNT_NUMBER = process.env.BACS_ACCOUNT_NUMBER || '12345678'
export const BACS_SWIFT_CODE = process.env.BACS_SWIFT_CODE || 'ABCDEF2G'
