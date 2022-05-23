import * as types from './actionTypes'

export function showPopUp (payload) {
  return {
    type: types.APP_POP_UP_SHOW,
    payload
  }
}

export function changePopUp () {
  return {
    type: types.APP_POP_UP_CHANGE
  }
}

export function hidePopUp () {
  return {
    type: types.APP_POP_UP_HIDE
  }
}
