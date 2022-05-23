import api from '../../../services/ApiService';
import * as types from './actionTypes';

export function productGetSuccess(payload) {
  return {
    type: types.APP_PRODUCT_GET,
    payload
  };
}

export function getProductPublicInfo(productId) {
  return dispatch => api.getProductPublicInfo({productId}).then(res => dispatch(productGetSuccess(res.data.data)));
}
