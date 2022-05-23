import * as types from './actionTypes'
import { LOG_OUT } from "../../auth/actionTypes"

const initialState = {}

const user = (state = initialState, { type, payload }) => {
  switch (type) {
  case LOG_OUT:
    return {
      ...initialState,
    }
  case types.APP_USER_GET:
  case types.APP_USER_ACCOUNT_CARD_DELETE:
    return {
      ...state,
      ...payload,
    }
  case types.APP_USER_ACCOUNT_GET:
    return {
      ...state,
      account: {
        ...state.account,
        ...payload
      }
    }

  default:
    return state
  }
}

export default user
