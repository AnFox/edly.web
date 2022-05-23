import * as types from './actionTypes'
import { LOG_IN, LOG_OUT } from "../../auth/actionTypes"

const initialState = {}

const product = (state = initialState, { type, payload }) => {
  switch (type) {
  case LOG_IN:
  case LOG_OUT:
    return {
      ...initialState,
    }

  case types.APP_PRODUCT_GET:
    return {
      ...state,
      [payload.id] :payload,
    }

  default:
    return state
  }
}

export default product
