import * as types from './actionTypes'
import { LOG_OUT } from '../../auth/actionTypes'

const initialState = {
  messages: [],
  type: '',
  duration: 1000 * 10
}

const alertBar = (state = initialState, { type, payload }) => {
  switch (type) {
  case types.APP_ALERTBAR_SHOW:
    return {
      ...state,
      ...payload
    }
  case types.APP_ALERTBAR_CLEAR_MESSAGE:
    return {
      ...state,
      messages: state.messages.filter(message => message !== payload)
    }
  case LOG_OUT:
  case types.APP_ALERTBAR_HIDE:
    return {
      ...initialState
    }

  default:
    return state
  }
}

export default alertBar
