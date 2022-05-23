import * as types from './actionTypes'

const initialState = {
  webinars: [],
  pagination: {},
  currentWebinar: {}
}

const webinars = (state = initialState, { type, payload, meta }) => {
  switch (type) {
  case types.APP_ADMIN_WEBINARS_GET:
    return {
      ...state,
      webinars: payload,
      pagination: meta
    }
  case types.APP_ADMIN_WEBINARS_SUCCESS:
    return {
      ...state,
      webinars: [payload, ...state.webinars]
    }
  case types.APP_ADMIN_WEBINAR_GET:
    return {
      ...state,
      currentWebinar: { ...state.webinar, [payload.id]: payload }
    }
  default:
    return state
  }
}

export default webinars
