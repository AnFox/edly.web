import api from '../../../services/ApiService'
import userServiceApi from '../../../services/UserServiceApiService'
import * as types from './actionTypes'

export function userGetSuccess (payload) {
  return {
    type: types.APP_USER_GET,
    payload
  }
}

export function userAccountGetSuccess (payload) {
  return {
    type: types.APP_USER_ACCOUNT_GET,
    payload
  }
}

export function cardDeletedFromUserAccount () {
  return {
    type: types.APP_USER_ACCOUNT_CARD_DELETE
  }
}

export function getUser () {
  return dispatch => api.getUser().then(res => dispatch(userGetSuccess(res.data.data)))
}

export function updateUser (data) {
  return dispatch => api.updateUser(data).then(res => dispatch(userGetSuccess(res.data.data)))
}

export function requestEmailVerificationCode () {
  return dispatch => userServiceApi.requestEmail()
}

export function requestPhoneVerificationCode () {
  return dispatch => userServiceApi.requestCode()
}

export function submitPhoneVerificationCode (data) {
  return dispatch => userServiceApi.submitCode(data)
}

export function deleteAccountCard () {
  return dispatch => api.deleteAccountCard().then(res => dispatch(userGetSuccess(res.data.data)))
}

export function setAccountPaymentSettings (data) {
  return dispatch => api.setAccountPaymentSettings(data).then(res => dispatch(userAccountGetSuccess(res.data.data)))
}

export function setAccountPixelSettings (fbPixel) {
  const data = { fb_pixel: fbPixel }

  return dispatch => api.setAccountPixelSettings(data).then(res => dispatch(userAccountGetSuccess(res.data.data)))
}

export function unsetAccountPixelSettings () {
  return dispatch => api.unsetAccountPixelSettings().then(res => dispatch(userAccountGetSuccess(res.data.data)))
}
