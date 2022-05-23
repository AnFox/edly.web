import * as Sentry from '@sentry/browser'
import { RewriteFrames } from '@sentry/integrations'

import { APP_ENV, RELEASE, SENTRY_DSN } from '../config'

import reduxStore from '../services/StoreService'

const store = reduxStore.get()

class SentryService {
  static init() {
    if (SENTRY_DSN) {
      Sentry.init({
        dsn: SENTRY_DSN,
        release: RELEASE,
        integrations: [new RewriteFrames()],
        environment: APP_ENV,
        beforeSend(event) {
          const { auth } = store.getState()

          /* eslint-disable no-param-reassign */
          event.extra = event.extra || {}
          event.extra.redux = {
            auth: Boolean(auth.tokens),
            store: store.getState()
          }
          event.extra.connection = SentryService.getConnectionInfo()

          if (event.extra.Error && event.extra.Error.response) {
            event.tags = event.tags || {}
            event.tags['HTTP status'] = event.extra.Error.response.status
            event.tags['HTTP status message'] = event.extra.Error.response.statusText
          }

          /* eslint-enable no-param-reassign */

          return event
        }
      })
    }
  }

  static getConnectionInfo() {
    const networkInformation = window.navigator
      ? (window.navigator.connection || window.navigator.webkitConnection) : undefined
    const connection = {}

    if (!networkInformation) return connection

    for (const key in networkInformation) { // eslint-disable-line no-restricted-syntax
      if (typeof networkInformation[key] !== 'function') {
        connection[key] = networkInformation[key]
      }
    }

    return connection
  }

  static setFingerprints(fingerprints) {
    Sentry.configureScope((scope) => {
      scope.setFingerprint(fingerprints)
    })
  }
}

export default SentryService
