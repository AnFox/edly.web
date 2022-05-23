import reduxStore from './StoreService'

import { deleteTokens, updateTokens } from '../lib/auth/actions'

const store = reduxStore.get()

class ApiTokensStorage {
  getTokens() {
    const state = store.getState()

    return state.auth.tokens ? { ...state.auth.tokens, expired_at: state.auth.tokens.expired_at - 1200 } : {}
  }

  setTokens(tokens) {
    store.dispatch(updateTokens(tokens))
  }

  clearTokens() {
    store.dispatch(deleteTokens())
  }
}

export default ApiTokensStorage
