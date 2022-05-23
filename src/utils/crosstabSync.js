// based on https://github.com/rt2zz/redux-persist-crosstab

export function crosstabSync(store, config, storagePrefix, actionType) {
  const blacklist = config.blacklist || null
  const whitelist = config.whitelist || null
  const storeKey = `${storagePrefix}${config.key}`

  function handleStorageEvent(e) {
    if (e.key === storeKey) {
      if (e.oldValue === e.newValue) {
        return
      }

      const toObject = (json)=> {
        const value = JSON.parse(json)
        let res = {}
        for (const code in value) {
          res = { ...res, [code]: JSON.parse(value[code]) }
        }
        return res
      }

      const statePartial = toObject(e.newValue)

      // let blackFlag = false
      // let whiteFlag = false

      // const recursion = (obj) => {
      //   if (typeof obj === 'object') {
      //     if (obj !== null && Object.keys(obj).length !== 0) {
      //       const keys = Object.keys(obj)
      //       for (let key of keys) {
      //         if (blacklist && blacklist.indexOf(key) !== -1) {
      //           blackFlag = true
      //         }
      //         if (whitelist && whitelist.indexOf(key) === -1) {
      //           whiteFlag = true
      //         }
      //       }
      //       for (const code in obj) {
      //         recursion(obj[code])
      //       }
      //     }
      //   }
      // }

      const state = Object.keys(statePartial).reduce((newState, reducerKey) => {
        if (whitelist && whitelist.indexOf(reducerKey) === -1) {
          return newState
        }
        if (blacklist && blacklist.indexOf(reducerKey) !== -1) {
          return newState
        }

        return {
          ...newState,
          [reducerKey]: statePartial[reducerKey],
        }
      }, {})

      // recursion(statePartial)

      store.dispatch({
        key: config.key,
        payload: state,
        type: actionType,
      })
    }
  }

  window.addEventListener('storage', handleStorageEvent, false)
}
