import api from '../../../services/ApiService'
import * as types from './actionTypes'

export function orderGetSuccess (payload) {
  return {
    type: types.APP_ORDER_GET,
    payload,
  }
}

export function ordersGetSuccess (payload, meta) {
  return {
    type: types.APP_ORDERS_GET,
    payload,
    meta,
  }
}

export function createOrder (productId, webinarId) {
  return async () => {
    const res = await api.createWebinarProductOrder(productId, webinarId)
    // dispatch(orderGetSuccess(order));

    return res.data.data
  }
}

export function getAccountOrders (pageNumber = 1, pageSize = 8) {
  return dispatch => api.getAccountOrders(pageNumber, pageSize)
    .then(res => dispatch(ordersGetSuccess(res.data.data, res.data.meta)))
}

export function searchAccountOrders (search, startDate, endDate, pageNumber = 1, pageSize = 8) {
  return dispatch => api.searchAccountOrders(search, startDate, endDate, pageNumber, pageSize)
    .then(res => dispatch(ordersGetSuccess(res.data.data, res.data.meta)))
}

export function createProductOrder (productId) {
  return async () => {
    const res = await api.createProductOrder(productId)

    return res.data.data
  }
}

export function createAccountBalanceRefillOrder (amount) {
  return async () => {
    const res = await api.createAccountBalanceRefillOrder(amount)
    return res.data.data
  }
}
