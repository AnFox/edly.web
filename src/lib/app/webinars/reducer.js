import * as types from './actionTypes'
import { LOG_OUT } from '../../auth/actionTypes'

const initialState = {
  items: [],
  pagination: {}
}

const webinars = (state = initialState, { type, payload, meta }) => {
  switch (type) {
  case LOG_OUT:
    return {
      ...initialState
    }
  case types.APP_WEBINARS_GET:
    return {
      ...state,
      items: payload,
      pagination: meta
    }

  default:
    return state
  }
}

export default webinars
