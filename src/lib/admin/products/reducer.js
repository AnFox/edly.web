import * as types from './actionTypes'
import { LOG_OUT } from '../../auth/actionTypes'

const initialState = {
  products: [],
  product: null
}

const products = (state = initialState, { type, payload, meta }) => {
  switch (type) {
  case types.APP_ADMIN_PRODUCT_GET:
    return {
      ...state,
      product: {
        ...state.product,
        [payload.id]: payload
      }
    }
  case types.APP_ADMIN_PRODUCT_UPDATE:
    return {
      product: {
        ...state.product,
        [payload.id]: payload
      },
      products: state.products.map(product => product.id === payload.id ? payload : product)
    }
  case types.APP_ADMIN_PRODUCTS_GET:
    return {
      ...state,
      products: payload,
      pagination: meta
    }

  case types.APP_ADMIN_PRODUCT_POST:
    return {
      ...state,
      products: [payload, ...state.products]
    }

  case types.APP_ADMIN_PRODUCT_DELETE:
    return {
      ...state,
      products: state.products.filter((product) => product.id !== payload)
    }
  case LOG_OUT:
    return {
      ...initialState
    }

  default:
    return state
  }
}

export default products
