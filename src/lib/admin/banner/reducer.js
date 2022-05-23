import * as types from './actionTypes'

const initialState = []

const banner = (state = initialState, { type, payload }) => {
  switch (type) {
  case types.APP_BANNER_GET:
    return {
      ...state,
      banners: payload,
    }
  case types.APP_BANNER_UPDATE:

    return state
  case types.APP_BANNER_POST:
    return payload
  case types.APP_BANNER_DELETE:
    return state
  default:
    return state
  }
}

export default banner
