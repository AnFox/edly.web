export const APP_ENV = process.env.REACT_APP_APP_ENV
export const RELEASE = process.env.REACT_APP_RELEASE
export const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN
export const API_SERVER = process.env.REACT_APP_API_SERVER
export const WS_SERVER = process.env.REACT_APP_WS_HOST
export const WS_PORT = process.env.REACT_APP_WS_PORT || 8443
export const WS_APP_CLUSTER = process.env.REACT_APP_WS_APP_CLUSTER || 'mt1'
export const WS_APP_KEY = process.env.REACT_APP_WS_APP_KEY || 'edly'
export const WS_ENCYPTED = !process.env.REACT_APP_WS_ENCYPTED ? true : process.env.REACT_APP_WS_ENCYPTED === "true"
export const WS_AUTH_ENDPOINT = process.env.REACT_APP_WS_AUTH_ENDPOINT
export const USS_API_ENDPOINT = process.env.REACT_APP_USS_API_ENDPOINT
export const OAUTH_CALLBACK = process.env.REACT_APP_OAUTH_CALLBACK
export const OAUTH_FB_ID = process.env.REACT_APP_OAUTH_FB_ID
export const OAUTH_GOOGLE_ID = process.env.REACT_APP_OAUTH_GOOGLE_ID
export const DEFAULT_LOCALE = 'ru'
