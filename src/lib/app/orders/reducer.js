import * as types from './actionTypes'
import { LOG_OUT } from '../../auth/actionTypes'

const initialState = {}

const orders = (state = initialState, { type, payload, meta }) => {
  switch (type) {
  case LOG_OUT:
    return {
      ...initialState,
    }
  case types.APP_ORDER_GET:
    return [
      ...state,
      payload,
    ]
  case types.APP_ORDERS_GET:
    return {
      items: payload,
      pagination: meta,
    }

  default:
    return state
  }
}

export default orders
