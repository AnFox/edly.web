import * as types from './actionTypes'

const initialState = { }

const slides = (state = initialState, { type, payload }) => {
  switch (type) {
  case types.APP_WEBINAR_CLEAR_SLIDES:
    return {
      ...state,
      [payload.roomId]: null
    }

  case types.APP_WEBINAR_SET_SLIDES:
    return {
      ...state,
      [payload.roomId]: { ...state[payload.roomId], slides: payload.slides }
    }

  case types.APP_WEBINAR_SET_PAGINATION:
    return {
      ...state,
      [payload.roomId]: { ...state[payload.roomId], pagination: payload.pagination }
    }
  default:
    return state
  }
}

export default slides
