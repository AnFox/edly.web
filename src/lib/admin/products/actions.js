import api from '../../../services/ApiService'
import * as types from './actionTypes'
import { alertbarShow } from '../../app/alertbar/actions'

function productsGetSuccess (payload, meta) {
  return {
    type: types.APP_ADMIN_PRODUCTS_GET,
    payload,
    meta
  }
}

function productCreateSuccess (payload) {
  return {
    type: types.APP_ADMIN_PRODUCT_POST,
    payload
  }
}

function productGetSuccess (payload) {
  return {
    type: types.APP_ADMIN_PRODUCT_GET,
    payload,
  }
}

function productUpdateSuccess (payload) {
  return {
    type: types.APP_ADMIN_PRODUCT_UPDATE,
    payload
  }
}

function productDeleteSuccess (payload) {
  return {
    type: types.APP_ADMIN_PRODUCT_DELETE,
    payload
  }
}

export function getProducts (pageNumber = 1, pageSize = 8) {
  return dispatch => api.getProducts(pageNumber, pageSize).then(res => dispatch(productsGetSuccess(res.data.data, res.data.meta)))
}

export function getProduct (id) {
  return dispatch => api.getProduct(id).then((res) => {
    dispatch(productGetSuccess(res.data.data))
  })
}

export function createProduct (product) {
  return dispatch => api.postProduct(product).then((res) => {
    dispatch(productCreateSuccess(res.data.data))
    return res.data.data
  })
}

export function updateProduct (id, product) {
  return dispatch => api.updateProduct(id, product).then((res) => {
    dispatch(productUpdateSuccess(res.data.data))
    dispatch(alertbarShow({
      type: 'info',
      messages: [`Информация о товаре обновлена`]
    }))
  })
}

export function deleteProduct (id) {
  return dispatch => api.deleteProduct(id).then(() => {
    dispatch(productDeleteSuccess(id))
  })
}

export function copyProduct (id, data) {
  return dispatch => api.duplicateProduct(id, data).then(res => {
    const product = res.data.data
    dispatch(productCreateSuccess(product))
    dispatch(alertbarShow({
      type: 'info',
      messages: [`Товар ${data.productName} был успешно скопирован под номером ${product.id}.`]
    }))
  })
}
