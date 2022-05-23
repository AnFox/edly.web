import * as types from './actionTypes'

const initialState = {
  tokens: undefined,
  isValidEmail: false,
}

const auth = (state = initialState, { type, payload }) => {
  switch (type) {
  case types.LOG_IN:
    return {
      ...state,
      tokens: payload
    }

  case types.AUTH_EMAIL_CHECK:
    return {
      ...state,
      isValidEmail: payload,
    }

  case types.LOG_OUT:
    return initialState

  default:
    return state
  }
}

export default auth
