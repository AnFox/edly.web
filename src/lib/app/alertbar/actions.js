import * as types from './actionTypes'

export function alertbarShow(payload) {
  return {
    type: types.APP_ALERTBAR_SHOW,
    payload
  }
}

export function alertbarHide() {
  return {
    type: types.APP_ALERTBAR_HIDE,
  }
}

export function clearMessage(payload) {
  return {
    type: types.APP_ALERTBAR_CLEAR_MESSAGE,
    payload
  }
}
