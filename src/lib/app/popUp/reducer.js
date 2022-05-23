import * as types from './actionTypes'
import { LOG_OUT } from '../../auth/actionTypes'

const initialState = {
  type: ''
}

const popUp = (state = initialState, { type, payload }) => {
  switch (type) {
  case types.APP_POP_UP_CHANGE:
  case types.APP_POP_UP_SHOW:
    return {
      type: payload
    }
  case types.APP_POP_UP_HIDE:
  case LOG_OUT:
    return initialState

  default:
    return state
  }
}

export default popUp
