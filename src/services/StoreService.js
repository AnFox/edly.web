import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { persistReducer, persistStore, createMigrate } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { createBlacklistFilter } from 'redux-persist-transform-filter'
import { createStateSyncMiddleware, initMessageListener } from 'redux-state-sync'
// import { crosstabSync } from '../utils/crosstabSync'

import rootReducer from '../lib'

const chat = createBlacklistFilter(
  'app',
  ['chat', 'loader', 'popUp']
)

const migrations = {
  '12': (state) => {
    return {
      ...state,
      app: { ...state.app, popUp: { type: '' } }
    }
  },
}



const persistConfig = {
  key: 'webinar',
  storage,
  whitelist: [
    'auth',
    'app',
    'navigation',
    'admin'
  ],
  transforms: [
    chat
  ],
  version: 12,
  migrate: createMigrate(migrations, { debug: false }),
}

const stateSyncConfig = {
  channel: 'crossTabSync',
  blacklist: ['persist/REHYDRATE', 'persist/PERSIST', 'APP_CHAT_MESSAGES_WS'],

}

class StoreService {
  constructor () {
    this.store = this.createStore()
    initMessageListener(this.store)
    if (localStorage.getItem('persist:webinar')) {
      const versionStorage = JSON.parse(JSON.parse(localStorage.getItem('persist:webinar'))._persist).version
      if (versionStorage <= 10) {
        localStorage.clear()
      }
    }
    this.persistor = new Promise(resolve => persistStore(this.store, null, () => resolve()))
  }

  createStore () {
    const persistedReducer = persistReducer(persistConfig, rootReducer)
    const __REDUX_DEVTOOLS_EXTENSION__ = window.__REDUX_DEVTOOLS_EXTENSION__
    const initialState = {}
    const middlewares = [thunk, createStateSyncMiddleware(stateSyncConfig)]

    return createStore(
      persistedReducer,
      initialState,
      compose(
        applyMiddleware(...middlewares),
        (__REDUX_DEVTOOLS_EXTENSION__ && process.env.REACT_APP_APP_ENV !== 'production')
          ? __REDUX_DEVTOOLS_EXTENSION__() : f => f
      )
    )
  }

  get () {
    return this.store
  }

  getPersistor () {
    return this.persistor
  }
}

const store = new StoreService()

export default store
